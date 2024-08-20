import { CurrencyCodeDto } from "@/dtos/CurrencyCodeDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";

export default interface ICurrencyCodeService {
  getAll(q?: string): Promise<AxiosResponse<Response<CurrencyCodeDto[]>>>;
  convertToCurrency(amount: number, locales?: string, currencyCode?: string): string;
}