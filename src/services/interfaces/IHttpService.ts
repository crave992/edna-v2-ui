import { AxiosHeaders, AxiosInstance } from "axios";

export default interface IHttpService {
  externalCall(contentType?: string): AxiosInstance;
  call(contentType?: string): AxiosInstance;
  callWithoutInterceptor(contentType?: string): AxiosInstance;
}
