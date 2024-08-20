export interface EmailSettingDto {
    id: number;
    provider: string | null;
    userName: string | null;
    password: string | null;
    host: string | null;
    port: number;
    enableSsl: boolean;
}