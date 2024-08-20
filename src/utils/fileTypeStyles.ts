export interface FileType {
  fileType: string;
}

export const getFileTypeStyles = (file: FileType): { backgroundColor: string; displayText: string } => {
  let backgroundColor: string;
  let displayText: string;

  switch (file.fileType) {
    case 'pdf':
      backgroundColor = 'tw-bg-error';
      displayText = 'PDF';
      break;
    case 'pptx':
    case 'ppt':
      backgroundColor = 'tw-bg-warning';
      displayText = 'PPT';
      break;
    case 'doc':
    case 'docx':
      backgroundColor = 'tw-bg-[#155EEF]';
      displayText = 'DOC';
      break;
    case 'txt':
      backgroundColor = 'tw-bg-[#475467]';
      displayText = 'TXT';
      break;
    default:
      backgroundColor = 'tw-bg-brand';
      displayText = file.fileType;
      break;
  }

  return { backgroundColor, displayText };
};
