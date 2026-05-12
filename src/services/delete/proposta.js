import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const deletarPropostaId = async (id) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");

  try {
    const response = await https.delete(`/propostas-comerciais/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      message:
        response.data?.message || "Proposta comercial excluída com sucesso",
    };
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

      const customError = new Error(message);
      customError.success = false;
      customError.data = error.response.data;
      throw customError;
    } else {
      CustomToast({
        type: "error",
        message: "Erro ao conectar ao servidor. Tente novamente.",
      });

      const connectionError = new Error("Erro ao conectar ao servidor. Tente novamente.");
      connectionError.success = false;
      throw connectionError;
    }
  }
};
