import { api } from "@/lib/apiClient";
import { UpdateUserProfilePayload, UserProfileResponseData } from "@/types";

const getUserProfile = async (): Promise<
  UserProfileResponseData | undefined
> => {
  const response = await api.get<UserProfileResponseData>("/user/profile");
  return response.data.data;
};

const updateUserProfile = async (
  payload: UpdateUserProfilePayload
): Promise<UserProfileResponseData | undefined> => {
  const response = await api.patch<UserProfileResponseData>(
    "/user/update",
    payload
  );
  return response.data.data;
};

const userService = {
  getUserProfile,
  updateUserProfile,
};

export default userService;
