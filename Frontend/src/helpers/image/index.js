export const imageURL = (url) => {
  const baseUrl = process.env.VUE_APP_SAUNA_URL;
  let time = new Date().getTime();
  if (!url) return null;
  if (!url.includes('https://') && !url.includes('http://')) {
    return `${baseUrl}/${url}`;
  } else {
    return url;
  }
}