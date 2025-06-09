import api from "../services/api";

export const firebaseSyncUser = async (name: string, idToken: string) => {
  const response = await api.post(
    "/v1/users/firebase-sync",
    { name },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      withCredentials: false,
    }
  );
  return response.data;
};
