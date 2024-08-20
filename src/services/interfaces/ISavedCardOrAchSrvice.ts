import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { SavedCardOrAchDto } from "@/dtos/SavedCardOrAchDto";
import { SavedAchModel, SavedCardModel } from "@/models/SavedCardOrAchModel";

export default interface ISavedCardOrAchSrvice {
  getAll(q: string, paymentMethodId: number): Promise<AxiosResponse<Response<SavedCardOrAchDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;

  addCard(model: SavedCardModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;
  updateCard(id: number, model: SavedCardModel ): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;

  addAch(model: SavedAchModel): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;
  updateAch(id: number, model: SavedAchModel ): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;

  delete(id: number): Promise<AxiosResponse<Response<SavedCardOrAchDto>>>;
}
