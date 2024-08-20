import { NotificationUrgencyDto } from "@/dtos/NotificationUrgencyDto";
import Response from "@/dtos/Response";
import NotificationUrgencyModel from "@/models/NotificationUrgencyModel";
import { AxiosResponse } from "axios";

export default interface INotificationUrgencyService {
    getAll(q?: string): Promise<AxiosResponse<Response<NotificationUrgencyDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<NotificationUrgencyDto>>>;
    add(model: NotificationUrgencyModel): Promise<AxiosResponse<Response<NotificationUrgencyDto>>>;
    update(
        id: number,
        model: NotificationUrgencyModel
    ): Promise<AxiosResponse<Response<NotificationUrgencyDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<NotificationUrgencyDto>>>;
}
