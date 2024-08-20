import { injectable } from "inversify";

import IHttpService from "./interfaces/IHttpService";
import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";

import { logout } from "@/components/common/Logout";
import https from "https";
import { RefreshTokenRequest } from "@/dtos/RefreshTokenRequest";
import Response from "@/dtos/Response";
import LoginDto from "@/dtos/LoginDto";

@injectable()
export default class HttpService implements IHttpService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
    this.clientId = `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`;
  }
  
  async refreshToken(param:RefreshTokenRequest, instance:AxiosInstance){
    const res = await instance.post<LoginDto, AxiosResponse<Response<LoginDto>>>(`/Account/Refreshtoken`, param);
    if(res.data && res.data.success && res.data.data.token){
      localStorage.setItem("at", res.data.data.token);
      return res.data.data.token;
    } else {
      return undefined;
    }
  }

  externalCall(contentType: string = "application/json"): AxiosInstance {
    let instance = axios.create();
    instance.defaults.headers.common["Content-Type"] = contentType;
    return instance;
  }

  call(contentType: string = "application/json"): AxiosInstance {
    let instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });

    instance.interceptors.request.use(
        (config) => {
            var adminToken = localStorage.getItem('admin-token');

            if(adminToken){
              //only allow get request to show the data that can be seen during user audit/impersonation
              if (config.method !== 'get' && config.method !== 'GET') {
                return Promise.reject(new AxiosError('No changes allowed during user audit.'));
              }
            }
            
            return config
        },
        (error) => {
            Promise.reject(error)
        }
    )

    instance.defaults.headers.common["clientId"] = this.clientId;
    instance.defaults.headers.common["Content-Type"] = contentType;
    
    let token = "";
    if (typeof window !== 'undefined'){
      token = localStorage.getItem("at") || "";
    }
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    //validate response
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
            const prevRequest:any = error.config;

            if(!prevRequest.sent) {
                let refreshToken = localStorage.getItem("rt") || "";
                let userEmail = localStorage.getItem("userEmail") || "";
                
                var refreshTokenParam = {
                  refreshToken: refreshToken,
                  email:userEmail
                } as RefreshTokenRequest;

                prevRequest.sent = true;
                const newToken = await this.refreshToken(refreshTokenParam, instance);

                if(newToken){
                  prevRequest.headers["Authorization"] = `Bearer ${newToken}`
                  return instance(prevRequest)
                } else {
                  //Failed to refresh token, automatically logout
                  await logout();
                  return instance;
                }
            }
            return Promise.reject(error);
          } else if (error.response?.status === 403) {
            //403 Forbidden is the status code to return when a client has valid credentials but not enough privileges to perform an action on a resource
            console.log("call access-denied page"); //need to implement
          }

          let statusCode: number = error.response?.status || 0;
          if (statusCode >= 400 && statusCode < 500) {
            return error;
          }
        }

        return error;
      }
    );
    return instance;
  }
  callWithoutInterceptor(
    contentType: string = "application/json"
  ): AxiosInstance {
    let instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });
    instance.defaults.headers.common["clientId"] = this.clientId;
    instance.defaults.headers.common["Content-Type"] = contentType;

    return instance;
  }
}
