import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import EventDto, { EventTypeDto } from "@/dtos/EventDto";
import IEventService from "./interfaces/IEventService";

@injectable()
export default class EventService implements IEventService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<EventDto[]>>> {
        let result = this.httpService
            .call()
            .get<EventDto[], AxiosResponse<Response<EventDto[]>>>(
                `/Event`
            );
        return result;
    }
    getAllEventType(): Promise<AxiosResponse<Response<EventTypeDto[]>>> {
        let result = this.httpService
            .call()
            .get<EventTypeDto[], AxiosResponse<Response<EventTypeDto[]>>>(
                `/EventType`
            );
        return result;
    }
    getById(id: number): Promise<AxiosResponse<Response<EventDto>>> {
        let result = this.httpService
            .call()
            .get<EventDto, AxiosResponse<Response<EventDto>>>(
                `/Event/${id}`
            );
        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<EventDto>>> {
        let result = this.httpService
            .call()
            .post<EventDto, AxiosResponse<Response<EventDto>>>(`/Event`, model);

        return result;
    }
    update(id: number, model: FormData): Promise<AxiosResponse<Response<EventDto>>> {
        let result = this.httpService
            .call()
            .put<EventDto, AxiosResponse<Response<EventDto>>>(
                `/Event/${id}`,
                model
            );

        return result;
    }
}
