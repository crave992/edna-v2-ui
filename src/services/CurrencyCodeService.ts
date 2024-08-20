import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ICurrencyCodeService from "./interfaces/ICurrencyCodeService";
import { CurrencyCodeDto } from "@/dtos/CurrencyCodeDto";

@injectable()
export default class CurrencyCodeService implements ICurrencyCodeService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(q?: string): Promise<AxiosResponse<Response<CurrencyCodeDto[]>>> {
    let result = this.httpService
      .call()
      .get<CurrencyCodeDto[], AxiosResponse<Response<CurrencyCodeDto[]>>>(
        `/CurrencyCode?q=${q || ""}`
      );

    return result;
  }

  convertToCurrency(amount: number, locales?: string, currencyCode?: string): string {

    let defaultLocales = "en-US";
    let defaultCurrencyCode = "USD";
    if (typeof window !== 'undefined'){
      defaultLocales = localStorage.getItem("locales") || "en-US";
      defaultCurrencyCode = localStorage.getItem("curCode") || "USD";
    }

    let currencyFormatter = new Intl.NumberFormat(locales || defaultLocales, {
      style: 'currency',
      currency: currencyCode || defaultCurrencyCode,
    });

    return currencyFormatter.format(amount);
  }

}
