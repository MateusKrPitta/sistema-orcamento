import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const criarProposta = async (dados) => {
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
    const dadosParaEnviar = {
      nome: dados.nome,
      clienteId: dados.clienteId,
      categoriaId: dados.categoriaId || null,
      statusProposta: dados.statusProposta || "pendente",
      observacoes: dados.observacoes || "",
    };

    if (
      dados.paginas &&
      Array.isArray(dados.paginas) &&
      dados.paginas.length > 0
    ) {
      dadosParaEnviar.paginas = dados.paginas;
    }

    const response = await https.post(
      "/propostas-comerciais",
      dadosParaEnviar,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
    let message = "Erro desconhecido ao criar proposta";

    if (error.response) {
      const data = error.response.data;

      if (data?.error?.message) {
        message = data.error.message;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.errors) {
        const validationErrors = Object.values(data.errors).flat();
        message = validationErrors.join(", ");
      } else if (typeof data === "string") {
        message = data;
      }

      console.error("Erro da API:", {
        status: error.response.status,
        data: error.response.data,
        message: message,
      });
    } else if (error.message) {
      message = error.message;
    }

    if (
      message === "Token inválido ou expirado" ||
      message === "Credenciais inválidas" ||
      message.includes("token")
    ) {
      CustomToast({
        type: "warning",
        message: "Seu token expirou, faça login novamente no sistema!",
      });
      window.AuthService.logout();
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
