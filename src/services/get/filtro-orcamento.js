import CustomToast from "../../components/toast";
import httpsInstance from "../url";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const buscarRelatorioOrcamentos = async (filtros = {}) => {
  const https = httpsInstance();
  const token = getCookie("auth_token");
  try {
    const params = new URLSearchParams();

    if (filtros.search) params.append("search", filtros.search);
    if (filtros.status) params.append("status", filtros.status);
    if (filtros.categoria_id)
      params.append("categoria_id", filtros.categoria_id);
    if (filtros.cliente_id) params.append("cliente_id", filtros.cliente_id);
    if (filtros.data_inicio) params.append("data_inicio", filtros.data_inicio);
    if (filtros.data_fim) params.append("data_fim", filtros.data_fim);
    if (filtros.cliente_nome)
      params.append("cliente_nome", filtros.cliente_nome);
    if (filtros.responsavel_nome)
      params.append("responsavel_nome", filtros.responsavel_nome);

    params.append("page", filtros.page || 1);
    params.append("limit", filtros.limit || 10);

    const queryString = params.toString();
    const url = queryString
      ? `/orcamentos/relatorio?${queryString}`
      : `/orcamentos/relatorio`;

    const response = await https.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
