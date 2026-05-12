import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const deletarOrcamentoEspecifico = async (id) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");

  try {
    const response = await https.delete(`/orcamentos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    CustomToast({
      type: "success",
      message: response.data?.message || "Orçamento excluído com sucesso!",
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      const message =
        data?.error?.message || data?.message || "Ocorreu um erro inesperado.";

      if (
        message === "Token inválido ou expirado" ||
        message === "Credenciais inválidas"
      ) {
        CustomToast({
          type: "warning",
          message: "Seu token expirou, faça login novamente no sistema!",
        });

        window.AuthService.logout();
      } else {
        CustomToast({ type: "error", message });
      }
    } else {
      CustomToast({
        type: "error",
        message: "Erro ao conectar ao servidor. Tente novamente.",
      });
    }

    throw error;
  }
};
