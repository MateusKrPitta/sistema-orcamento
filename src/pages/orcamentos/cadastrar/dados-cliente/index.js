import {
  Article,
  LocationOn,
  Mail,
  Person,
  WhatsApp,
} from "@mui/icons-material";
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { mascaraTelefone } from "../../../../utils/formatTelefone";
import { buscarClientes } from "../../../../services/get/cliente";

const DadosCliente = ({
  // Receber todas as props do componente pai
  nomeCliente,
  setNomeCliente,
  telefoneCliente,
  setTelefoneCliente,
  enderecoCliente,
  setEnderecoCliente,
  emailCliente,
  setEmailCliente,
  clienteExistente,
  setClienteExistente,
  clienteSelecionado,
  setClienteSelecionado,
  clienteId,
  setClienteId,
  clientesDisponiveis,
  setClientesDisponiveis,
  nomeClienteErro,
  telefoneClienteErro,
  telefoneClienteFormatado,
  setTelefoneClienteFormatado,
  loadingClientes,
}) => {
  const handleClienteSelecionado = (event, value) => {
    if (value) {
      setClienteSelecionado(value);
      setClienteId(value.id);
      setNomeCliente(value.nome);
      setTelefoneCliente(value.telefone || "");
      setEnderecoCliente(value.endereco || "");
      setEmailCliente(value.email || "");

      const telefoneFormatado = value.telefone
        ? mascaraTelefone(value.telefone)
        : "";
      setTelefoneClienteFormatado(telefoneFormatado);

      setClienteExistente(true);
    } else {
      setClienteExistente(false);
      setNomeCliente("");
      setTelefoneCliente("");
      setTelefoneClienteFormatado("");
      setEnderecoCliente("");
      setEmailCliente("");
      setClienteSelecionado(null);
      setClienteId(null);
    }
  };

  const handleTelefoneClienteChange = (valor) => {
    const valorFormatado = mascaraTelefone(valor);
    setTelefoneClienteFormatado(valorFormatado);
    const telefoneLimpo = valorFormatado.replace(/\D/g, "");
    setTelefoneCliente(telefoneLimpo);

    if (clienteExistente && valor !== clienteSelecionado?.telefone) {
      setClienteExistente(false);
      setClienteSelecionado(null);
      setClienteId(null);
    }
  };

  const handleNomeClienteChange = (valor) => {
    setNomeCliente(valor);

    if (clienteExistente && valor !== clienteSelecionado?.nome) {
      setClienteExistente(false);
      setClienteSelecionado(null);
      setClienteId(null);
    }
  };

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const response = await buscarClientes();
        if (response.success) {
          const clientesArray = response.data.data || response.data || [];
          setClientesDisponiveis(clientesArray);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };

    carregarClientes();
  }, []);
  return (
    <div className="w-[48%]">
      <div
        className="flex flex-col  w-[100%] p-2"
        style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
      >
        <label className="text-sm font-bold flex items-center gap-2 mb-2  text-black pb-2">
          <Person style={{ color: "#a3cb39" }} />
          Dados do Cliente
        </label>
        <div className="flex w-full items-center gap-3 flex-wrap">
          <Autocomplete
            size="small"
            options={clientesDisponiveis}
            getOptionLabel={(option) => option.nome}
            value={clienteSelecionado}
            onChange={handleClienteSelecionado}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecionar Cliente Existente"
                placeholder="Digite para buscar..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.nome}</span>
                  <span className="text-xs text-gray-500">
                    {option.telefone} {option.email && `• ${option.email}`}
                  </span>
                </div>
              </Box>
            )}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Nome Completo*"
            value={nomeCliente}
            error={nomeClienteErro}
            helperText={nomeClienteErro ? "Campo obrigatório" : ""}
            onChange={(e) => handleNomeClienteChange(e.target.value)}
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
            required
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Telefone/WhatsApp*"
            value={telefoneClienteFormatado}
            error={telefoneClienteErro}
            helperText={telefoneClienteErro ? "Telefone inválido" : ""}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
            }}
            onChange={(e) => handleTelefoneClienteChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsApp />
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Endereço"
            value={enderecoCliente}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
            }}
            onChange={(e) => setEnderecoCliente(e.target.value)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Email"
            value={emailCliente}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
            }}
            onChange={(e) => setEmailCliente(e.target.value)}
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

export default DadosCliente;
