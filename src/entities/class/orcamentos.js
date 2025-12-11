export const cadastrosOrcamentos = (orcamentos) => {
  return orcamentos.map((orcamento) => ({
    id: orcamento.id,
    cliente: orcamento.nome,
    valorTotal: orcamento.valorTotal,
    status: orcamento.status,
    categoria: orcamento.categoria,
    ativo: orcamento.ativo,
  }));
};
