import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ISavedCardOrAchSrvice from "./interfaces/ISavedCardOrAchSrvice";
import { SavedCardOrAchDto } from "@/dtos/SavedCardOrAchDto";
import { SavedAchModel, SavedCardModel } from "@/models/SavedCardOrAchModel";

@injectable()
export default class SavedCardOrAchSrvice implements ISavedCardOrAchSrvice {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q: string, paymentMethodId: number): Promise<AxiosResponse<Response<SavedCardOrAchDto[]>>> {
        let result = this.httpService
            .call()
            .get<SavedCardOrAchDto[], AxiosResponse<Response<SavedCardOrAchDto[]>>>(
                `/SavedCardOrAch?q=${q}&paymentMethodId=${paymentMethodId}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .get<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(`/SavedCardOrAch/${id}`);

        return result;
    }

    addCard(model: SavedCardModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .post<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(`/SavedCardOrAch/AddCard`, model);

        return result;
    }

    updateCard(id: number, model: SavedCardModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .put<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(
                `/SavedCardOrAch/UpdateCard/${id}`,
                model
            );

        return result;
    }

    addAch(model: SavedAchModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .post<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(`/SavedCardOrAch/AddAch`, model);

        return result;
    }

    updateAch(id: number, model: SavedAchModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .put<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(
                `/SavedCardOrAch/UpdateAch/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<SavedCardOrAchDto>>> {
        let result = this.httpService
            .call()
            .delete<SavedCardOrAchDto, AxiosResponse<Response<SavedCardOrAchDto>>>(
                `/SavedCardOrAch/${id}`
            );

        return result;
    }
}
