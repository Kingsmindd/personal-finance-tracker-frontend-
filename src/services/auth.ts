import api from "../api/axios";

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};
