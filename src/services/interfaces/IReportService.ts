import AdminDashboardCountDto from "@/dtos/AdminDashboardCountDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";

export default interface IReportService {
    getAdminDashboardCount(): Promise<AxiosResponse<Response<AdminDashboardCountDto>>>; 
}
