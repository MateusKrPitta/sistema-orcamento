export const formatarValor = (valor) => {
  if (valor === null || valor === undefined || valor === "") return "";

  const numero =
    typeof valor === "string"
      ? parseFloat(valor.replace(/[^\d,]/g, "").replace(",", "."))
      : Number(valor);

  if (isNaN(numero)) return "";

  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseValor = (valorString) => {
  if (!valorString) return 0;
  const valorNumerico = valorString.replace(/[^\d,]/g, "").replace(",", ".");
  const numero = parseFloat(valorNumerico);
  return isNaN(numero) ? 0 : numero;
};

export const mascaraValorInput = (valor) => {
  let valorNumerico = valor.replace(/\D/g, "");

  if (!valorNumerico) return "";

  valorNumerico = valorNumerico.replace(/^0+/, "");

  if (valorNumerico === "") return "";

  const temCentavos = valorNumerico.length >= 3;

  if (temCentavos) {
    const reais = valorNumerico.slice(0, -2) || "0";
    const centavos = valorNumerico.slice(-2);

    const reaisSemZeros = reais.replace(/^0+/, "");
    const reaisFormatados = reaisSemZeros
      ? reaisSemZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";

    return `${reaisFormatados},${centavos}`;
  } else {
    const centavos = valorNumerico.padStart(2, "0");
    return `0,${centavos}`;
  }
};
