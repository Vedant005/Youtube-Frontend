import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

type SubscriberCallback = (accessToken: string) => void;
let subscribers: SubscriberCallback[] = [];
let isRefreshing = false;

const onRefreshed = (accessToken: string): void => {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse | null>((resolve) => {
          subscribers.push((accessToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post<{ accessToken: string }>(
          "/users/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        onRefreshed(newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        window.dispatchEvent(new Event("forceLogout"));

        const refreshErrorData = (refreshError as AxiosError)?.response?.data;
        if (
          refreshErrorData &&
          typeof refreshErrorData === "object" &&
          "message" in refreshErrorData &&
          refreshErrorData.message === "TokenExpired"
        ) {
          return Promise.resolve(null);
        }

        return new Promise<null>((resolve) => {
          window.dispatchEvent(new Event("forceLogout"));
          resolve(null);
        });
      }
    }

    if (
      error.response?.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      error.response.data.message === "TokenExpired"
    ) {
      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
