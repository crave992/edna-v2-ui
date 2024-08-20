import { TYPES } from "@/config/types";
import INotificationUrgencyService from "./interfaces/INotificationUrgencyService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { NotificationUrgencyDto } from "@/dtos/NotificationUrgencyDto";
import NotificationUrgencyModel from "@/models/NotificationUrgencyModel";

@injectable()
export default class NotificationUrgencyService implements INotificationUrgencyService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<NotificationUrgencyDto[]>>> {
        let result = this.httpService
            .call()
            .get<NotificationUrgencyDto[], AxiosResponse<Response<NotificationUrgencyDto[]>>>(
                `/NotificationUrgencyLevel?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<NotificationUrgencyDto>>> {
        let result = this.httpService
            .call()
            .get<NotificationUrgencyDto, AxiosResponse<Response<NotificationUrgencyDto>>>(`/NotificationUrgencyLevel/${id}`);

        return result;
    }

    add(model: NotificationUrgencyModel): Promise<AxiosResponse<Response<NotificationUrgencyDto>>> {
        let result = this.httpService
            .call()
            .post<NotificationUrgencyDto, AxiosResponse<Response<NotificationUrgencyDto>>>(`/NotificationUrgencyLevel`, model);

        return result;
    }

    update(
        id: number,
        model: NotificationUrgencyModel
    ): Promise<AxiosResponse<Response<NotificationUrgencyDto>>> {
        let result = this.httpService
            .call()
            .put<NotificationUrgencyDto, AxiosResponse<Response<NotificationUrgencyDto>>>(
                `/NotificationUrgencyLevel/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<NotificationUrgencyDto>>> {
        let result = this.httpService
            .call()
            .delete<NotificationUrgencyDto, AxiosResponse<Response<NotificationUrgencyDto>>>(
                `/NotificationUrgencyLevel/${id}`
            );

        return result;
    }
}
