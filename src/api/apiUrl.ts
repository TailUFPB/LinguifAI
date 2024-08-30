const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const getApiUrl = (path: string) => `${apiBaseUrl}${path}`;

export default getApiUrl;
