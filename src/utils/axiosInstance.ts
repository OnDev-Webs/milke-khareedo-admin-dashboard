import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!envUrl) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set. Please set it in your .env.local file.");
  }

  let cleanedUrl = envUrl.trim();

  try {
    cleanedUrl = decodeURIComponent(cleanedUrl);
  } catch (e) {
  }

  cleanedUrl = cleanedUrl
    .replace(/["']/g, '')
    .replace(/;/g, '')
    .trim()
    .replace(/\/$/, '');

  if (!cleanedUrl.match(/^https?:\/\//)) {
    throw new Error(`Invalid NEXT_PUBLIC_API_URL format: "${cleanedUrl}". It should start with http:// or https://`);
  }

  return cleanedUrl;
};

const BASE_URL = getBaseUrl();

if (BASE_URL.includes('"') || BASE_URL.includes("'") || BASE_URL.includes(';') || BASE_URL.includes('%22')) {
  throw new Error(`Invalid characters detected in BASE_URL: "${BASE_URL}". Please check your NEXT_PUBLIC_API_URL environment variable.`);
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.baseURL) {
      let cleanBaseUrl = config.baseURL;

      try {
        cleanBaseUrl = decodeURIComponent(cleanBaseUrl);
      } catch (e) {
      }

      cleanBaseUrl = cleanBaseUrl
        .replace(/["']/g, '')
        .replace(/;/g, '')
        .replace(/%22/g, '')
        .replace(/%3B/gi, '')
        .trim()
        .replace(/\/$/, '');

      config.baseURL = cleanBaseUrl;
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default axiosInstance;
