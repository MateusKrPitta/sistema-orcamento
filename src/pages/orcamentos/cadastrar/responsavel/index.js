import { Article, Mail, WhatsApp, Work } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { mascaraTelefone } from "../../../../utils/formatTelefone";

const ResponsavelOrcamento = ({
  nomeResponsavel,
  setNomeResponsavel,
  telefoneResponsavel,
  setTelefoneResponsavel,
  emailResponsavel,
  setEmailResponsavel,
  telefoneResponsavelFormatado,
  setTelefoneResponsavelFormatado,
}) => {
  const handleTelefoneResponsavelChange = (valor) => {
    const valorFormatado = mascaraTelefone(valor);
    setTelefoneResponsavelFormatado(valorFormatado);
    setTelefoneResponsavel(valorFormatado.replace(/\D/g, ""));
  };

  return (
    <div className="flex gap-3 flex-wrap w-[48%] items-start">
      <div
        className="flex flex-col w-full p-2"
        style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
      >
        <label className="text-sm font-bold flex items-center gap-2 text-black mb-2 pb-2">
          <Work style={{ color: "#a3cb39" }} />
          Solicitante
        </label>
        <div className="flex w-full items-center gap-3 flex-wrap">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Nome Completo"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
            autoComplete="off"
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "62%" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Article />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Telefone/WhatsApp"
            value={telefoneResponsavelFormatado}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
            }}
            onChange={(e) => handleTelefoneResponsavelChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Email"
            value={emailResponsavel}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
            }}
            onChange={(e) => setEmailResponsavel(e.target.value)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsavelOrcamento;
