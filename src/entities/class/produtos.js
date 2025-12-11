export const cadastrosProdutos = (produtos) => {
  return produtos.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    ativo: produto.ativo,
  }));
};
