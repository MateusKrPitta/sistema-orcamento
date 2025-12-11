export const cadastrosUsuarios = (usuarios) => {
  return usuarios.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    ativo: usuario.ativo,
  }));
};
