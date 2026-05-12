import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const AtivarCategoria = async (id, ativo) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  try {
    const response = await https.patch(
      `/categorias/${id}/ativar`,
      {
        ativo: ativo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const action = ativo ? "ativada" : "inativada";
      CustomToast({
        type: "success",
        message: `Ação ${action} com sucesso!`,
      });
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      data: response.data,
    };
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Erro ao atualizar status do agendamento";

    if (
      message === "Token inválido ou expirado" ||
      message === "Credenciais inválidas"
    ) {
      CustomToast({
        type: "warning",
        message: "Seu token expirou, faça login novamente no sistema!",
      });

      sessionStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } else {
      CustomToast({ type: "error", message });
    }

    return {
      success: false,
      error: message,
      statusCode:
        error.response?.data?.error?.status_code || error.response?.status,
    };
  }
};
