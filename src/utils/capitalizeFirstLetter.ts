export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const capitalizeWordFirstLetter = (text: string): string => {
  return text.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());;
}