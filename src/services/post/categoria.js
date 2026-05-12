import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const criarCategoria = async (nome) => {
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
      "/categorias",
      {
        nome,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      CustomToast({
        type: "success",
        message: "Categoria criada com sucesso!",
      });

      return {
        success: true,
        data: response.data,
      };
    } else {
      CustomToast({
        type: "error",
        message: "Erro ao criar categoria",
      });
    }
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Erro desconhecido";

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
  }
};
