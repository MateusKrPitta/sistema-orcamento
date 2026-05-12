export const mascaraTelefone = (valor) => {
  const numeros = valor.replace(/\D/g, "");

  if (!numeros) return "";

  if (numeros.length <= 2) {
    return numeros;
  } else if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  } else if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(
      6,
      10
    )}`;
  } else {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
      7,
      11
    )}`;
  }
};
