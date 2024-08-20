export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  var k = 1000,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseInt((bytes / Math.pow(k, i)).toString()) + ' ' + sizes[i];
};
