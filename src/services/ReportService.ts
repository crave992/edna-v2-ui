import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import AdminDashboardCountDto from "@/dtos/AdminDashboardCountDto";
import IReportService from "./interfaces/IReportService";

@injectable()
export default class ReportService implements IReportService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAdminDashboardCount(): Promise<AxiosResponse<Response<AdminDashboardCountDto>>> {
        let result = this.httpService
            .call()
            .get<AdminDashboardCountDto, AxiosResponse<Response<AdminDashboardCountDto>>>(
                `/Report/GetAdminDashboardCount`
            );

        return result;
    }
}
