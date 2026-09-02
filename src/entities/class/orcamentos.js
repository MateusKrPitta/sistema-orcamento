export const cadastrosOrcamentos = (orcamentos) => {
  return orcamentos.map((orcamento) => ({
    id: orcamento.id,
    cliente:
      orcamento.cliente?.nome ||
      orcamento.cliente_nome ||
      "Cliente não informado",
    setor: orcamento.setor || "Não informado",
    valor_total: formatarValor(orcamento.valor_total),
    status: formatarStatus(orcamento.status),
    categoria: orcamento.categoria,
    numero_orcamento: orcamento.numero,
    data_emissao: formatarData(orcamento.data_emissao),
    responsavel: orcamento.responsavel?.nome || orcamento.responsavel || "-",
  }));
};

const formatarValor = (valor) => {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numero || 0);
};

const formatarStatus = (status) => {
  const statusMap = {
    pendente_ligacao: "Pendente Ligação",
    em_andamento: "Em Andamento",
    venda_concluida: "Venda Concluída",
    cancelado: "Cancelado",
    em_orcamento: "Em Orçamento",
    producao: "Produção",
    entregue: "Entregue",
  };
  return statusMap[status] || status;
};

const formatarData = (dataString) => {
  if (!dataString) return "";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};
