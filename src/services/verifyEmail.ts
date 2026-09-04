import api from "../api/axios";

export const verifyEmail = async (token: string) => {
  const response = await api.post("/auth/verify-email", {
    token,
  });

  return response.data;
};

export const resendVerificationEmail = async (email: string) => {
  const response = await api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
};
