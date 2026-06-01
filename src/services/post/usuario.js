import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const criarUsuario = async (nome, email, password, role) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");

  if (!token) {
    CustomToast({
      type: "warning",
      message: "Token não encontrado. Redirecionando para login...",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return { success: false, error: "Token não encontrado" };
  }

  try {
    const response = await https.post(
      "/users",
      {
        nome,
        email,
        password,
        role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.message) {
      CustomToast({
        type: "success",
        message: response.data.message,
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    }
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Erro desconhecido ao criar produto";

    if (
      message === "Token inválido ou expirado" ||
      message === "Credenciais inválidas"
    ) {
      CustomToast({
        type: "warning",
        message: "Seu token expirou, faça login novamente no sistema!",
      });
    } else {
      CustomToast({
        type: "error",
        message,
      });
    }

    return {
      success: false,
      error: message,
    };
  }
};
