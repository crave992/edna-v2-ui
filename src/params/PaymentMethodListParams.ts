import PaginationParams from "./PaginationParams";

export default interface PaymentMethodListParams extends PaginationParams {
    q: string;
}
