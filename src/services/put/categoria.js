import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const atualizarCategoria = async (id, nome) => {
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
    const response = await https.put(
      `/categorias/${id}`,
      { nome },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      CustomToast({
        type: "success",
        message: "Categoria atualizada com sucesso!",
      });

      return {
        success: true,
        data: response.data,
      };
    } else {
      CustomToast({
        type: "error",
        message: "Erro ao atualizar categoria",
      });
      return {
        success: false,
        error: "Erro ao atualizar categoria",
      };
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

    return {
      success: false,
      error: message,
    };
  }
};
