import EventDto, { EventTypeDto } from "@/dtos/EventDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";

export default interface IEventService {
    getAll(): Promise<AxiosResponse<Response<EventDto[]>>>;
    getAllEventType(): Promise<AxiosResponse<Response<EventTypeDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<EventDto>>>;
    add(model: FormData): Promise<AxiosResponse<Response<EventDto>>>;
    update(id: number, model: FormData): Promise<AxiosResponse<Response<EventDto>>>;
}
