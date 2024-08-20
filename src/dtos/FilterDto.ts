export default interface FilterDto {
  name: string;
  color?: string;
  data?:  FilterDto[];
  level?: {
    name: string;
  };
}