import axios from "axios";
import { injectable } from "inversify";
import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import IErrorHandlerService from "./interfaces/IErrorHandlerService";

@injectable()
export default class ErrorHandlerService implements IErrorHandlerService {

  constructor() {
  }

  getErrorMessage(error: any): string {

    try {
      if (axios.isAxiosError(error)) {
        let actualError: Response<any> = error.response?.data;

        if (actualError) {
          if (actualError.errors) return actualError.errors.join("<br/>");
          else if (actualError.data) {
            if(actualError.data && actualError.data.message){
              return actualError.data.message;
            } else {
              return actualError.data;
            }
          } else {
            if (process.env.NODE_ENV === 'production') {
              return "Some error occured.";
            } else {
              return actualError as unknown as string;
            }
          }
        } else if(error.message){
          return error.message;
        }
      } else {
        let castedError = error.data as Response<PlainDto>;
        if (castedError.data) return castedError.errors.join("<br/>");
        else if (castedError.message) return castedError.message;
      }
      return "Some error occured.";
    } catch (err) {
      return "Some error occured.";
    }
  }

}
