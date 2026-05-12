import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const buscarClienteOrcamento = async (filtros = {}) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");

  try {
    if (
      (!filtros.cliente_nome || filtros.cliente_nome.trim() === "") &&
      (!filtros.numero_orcamento || filtros.numero_orcamento.trim() === "")
    ) {
      throw new Error("Nome do cliente ou número do orçamento é obrigatório");
    }

    const queryParams = new URLSearchParams();

    if (filtros.cliente_nome && filtros.cliente_nome.trim() !== "") {
      queryParams.append("cliente_nome", filtros.cliente_nome);
    }

    if (filtros.numero_orcamento && filtros.numero_orcamento.trim() !== "") {
      queryParams.append("numero_orcamento", filtros.numero_orcamento);
    }

    if (filtros.page) {
      queryParams.append("page", filtros.page);
    }

    if (filtros.limit) {
      queryParams.append("limit", filtros.limit);
    }

    const queryString = queryParams.toString();
    const url = `/orcamentos/cliente${queryString ? `?${queryString}` : ""}`;

    const response = await https.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.message === "Nome do cliente ou número do orçamento é obrigatório"
    ) {
      CustomToast({
        type: "warning",
        message: "Digite um nome ou número para buscar",
      });
      throw error;
    }

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
