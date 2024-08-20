export default interface CustomLessonExtensionDto {
  id: number;
  areaId: number | undefined;
  topicId: number | undefined;
  title: string;
  description: string;
  materials: string;
}
