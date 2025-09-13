import { api } from "@/lib/apiClient";
import {
  RegisterPayload,
  RegisterResponseData,
  LoginPayload,
  LoginResponseData,
  VerifyOtpPayload,
  RefreshTokenPayload,
} from "@/types";

const register = async (
  userData: RegisterPayload
): Promise<RegisterResponseData | undefined> => {
  const response = await api.post<RegisterResponseData>(
    "/auth/register",
    userData
  );
  return response.data.data;
};

const verifyOtp = async (
  payload: VerifyOtpPayload,
  tempToken: string
): Promise<LoginResponseData | undefined> => {
  const response = await api.post<LoginResponseData>(
    "/auth/verifyOTP",
    payload,
    { headers: { Authorization: `Bearer ${tempToken}` } }
  );
  return response.data.data;
};

const login = async (
  credentials: LoginPayload
): Promise<LoginResponseData | undefined> => {
  const response = await api.post<LoginResponseData>(
    "/auth/login",
    credentials
  );
  return response.data.data;
};

const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<LoginResponseData | undefined> => {
  const response = await api.post<LoginResponseData>("/auth/refresh", payload);
  return response.data.data;
};

const authService = {
  register,
  verifyOtp,
  login,
  refreshToken,
};

export default authService;
