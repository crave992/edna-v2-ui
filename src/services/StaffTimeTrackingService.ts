import { StaffTimeTrackingListParams } from "./../params/StaffTimeTrackingListParams";
import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import {
  StaffTimeTrackingDto,
  StaffTimeTrackingListResponseDto,
} from "@/dtos/StaffTimeTrackingDto";
import { StaffTimeTrackingModel } from "@/models/StaffTimeTrackingModel";
import IStaffTimeTrackingService from "./interfaces/IStaffTimeTracking";

@injectable()
export default class StaffTimeTrackingService
  implements IStaffTimeTrackingService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  get(
    p?: StaffTimeTrackingListParams
  ): Promise<AxiosResponse<Response<StaffTimeTrackingListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        StaffTimeTrackingListResponseDto,
        AxiosResponse<Response<StaffTimeTrackingListResponseDto>>
      >(`/StaffTimeTracking`, {
        params: p,
      });

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>> {
    let result = this.httpService
      .call()
      .get<StaffTimeTrackingDto, AxiosResponse<Response<StaffTimeTrackingDto>>>(
        `/StaffTimeTracking/${id}`
      );

    return result;
  }

  add(
    modal: StaffTimeTrackingModel
  ): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>> {
    let result = this.httpService
      .call()
      .post<
        StaffTimeTrackingDto,
        AxiosResponse<Response<StaffTimeTrackingDto>>
      >(`/StaffTimeTracking`, modal);

    return result;
  }

  update(
    id: number,
    modal: StaffTimeTrackingModel
  ): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>> {
    let result = this.httpService
      .call()
      .put<StaffTimeTrackingDto, AxiosResponse<Response<StaffTimeTrackingDto>>>(
        `/StaffTimeTracking/${id}`,
        modal
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>> {
    let result = this.httpService
      .call()
      .delete<
        StaffTimeTrackingDto,
        AxiosResponse<Response<StaffTimeTrackingDto>>
      >(`/StaffTimeTracking/${id}`);

    return result;
  }
}
