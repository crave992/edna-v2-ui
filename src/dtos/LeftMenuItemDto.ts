import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";

export default interface LeftMenuItemDto {
    id: number | string;
    title: string;
    url: string;
    tooltip: string;
    icon: IconDefinition;
    role: string,
    children?: LeftMenuItemDto[]
}
