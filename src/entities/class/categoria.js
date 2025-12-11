export const cadastrosCategoria = (categorias) => {
  return categorias.map((categoria) => ({
    id: categoria.id,
    nome: categoria.nome,
    ativo: categoria.ativo,
  }));
};
