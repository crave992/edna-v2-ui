export default interface EmailSettingModel {
    id: number,
    provider: string;
    userName: string;
    password: string;
    host: string;
    port: number;
    enableSsl: boolean;
}