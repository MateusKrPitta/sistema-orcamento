import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const login = async (email, password) => {
  const https = httpsInstance();
  try {
    const response = await https.post("/login", {
      email: email,
      password: password,
    });

    return response.data;
  } catch (error) {
    let errorMessage = "Erro ao fazer login";

    if (error.response?.message) {
      CustomToast.show({
        type: "error",
        message: errorMessage,
      });
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }
};
