import { Dispatch } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  AccessTokenResponse,
  ErrorReportBody,
} from "models/api/response.types";


const handleAxiosError = (
  error: AxiosError,
  cleanup?: () => void,
  details?: {
    private?: boolean;
    comment?: string;
    user?: AccessTokenResponse | null;
    organizationId?: number;
  },
): void => {
  // send error report to API
  const requestBody = error.response?.config?.data;
  let requestJson = requestBody;
  try {
    requestJson = JSON.stringify(JSON.parse(requestBody), null, 2);
  } catch (exception) {
    requestJson = requestBody;
  } finally {
    if (!details?.private) {
      axios.post(`/api/error/report`, {
        method: error.response?.config?.method,
        endpoint: `${error.response?.config?.baseURL}${error.response?.config?.url}`,
        request_json: requestJson,
        response_code: error.response?.status,
        response_json: JSON.stringify(error.response?.data, null, 2),
        comment: details?.comment,
        user_id: details?.user?.id,
        organization_id: details?.organizationId,
      } as ErrorReportBody);
    }
  }

  // if error with status 401 we need clear the user and move them to login route
  // 401 UNAUTHORIZED
  // 422 Signature verification failed the same as unauthorized
  const data = error.response?.data as unknown as any;
  if (
    error.response?.status === 401 ||
    (error.response?.status === 422 &&
      data?.msg === "Signature verification failed")
  ) {
    if (cleanup) {
      cleanup();
    }
  }
};

export default handleAxiosError;