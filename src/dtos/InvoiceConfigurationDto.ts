export default interface InvoiceConfigurationDto {
    id: number;
    startWith: string;
    incrementBy: number;
    invoiceOn: number;
    payBy: number;
    comments: string;
    createdOn: Date;
    updatedOn: Date;
    organizationId: number;
}