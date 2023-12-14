import { AxiosError, type AxiosResponse } from "axios";

export function perttyAxios<D>(
  axios: Promise<AxiosResponse<D>>
): Promise<{ code: number; data: D }> {
  return new Promise((resolve) => {
    axios
      .then((resp) => {
        resolve({
          code: resp.status,
          data: resp.data,
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          return resolve({
            code: err.response?.status || 500,
            data: err.response?.data,
          });
        }
        console.error("ERROR!", err);
        // eslint-disable-next-line prefer-promise-reject-errors
        resolve({
          code: 0,
          // @ts-ignore
          data: null
        });
      });
  });
}
