export const cadastrosPropostas = (propostas) => {
  return propostas.map((proposta) => ({
    id: proposta.id,
    nome: proposta.nome,
    cliente: proposta.cliente?.nome || "-",
    status: proposta.statusProposta,
    categoria: proposta.categoria?.nome || "-",
    responsavel: proposta.responsavel?.nome || "-",
    createdAt: new Date(proposta.createdAt).toLocaleDateString("pt-BR"),
  }));
};
