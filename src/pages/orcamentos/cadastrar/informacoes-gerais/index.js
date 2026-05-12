import {
  Article,
  BookmarkAdd,
  CalendarToday,
  Category,
  DateRange,
} from "@mui/icons-material";
import {
  Autocomplete,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { buscarCategoriasAtivos } from "../../../../services/get/categoria-ativa";

const InformacoesGerais = ({
  dataEmissao,
  setDataEmissao,
  validade,
  setValidade,
  statusSelecionado,
  setStatusSelecionado,
  categorias,
  setCategoriaSelecionada,
  categoriaSelecionada,
  dataEmissaoErro,
  validadeErro,
  loadingCategorias,
  setCategorias,
}) => {
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await buscarCategoriasAtivos();
        if (response.success) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    carregarCategorias();
  }, []); // ✅ Array vazio - executa apenas uma vez

  return (
    <div className="w-[50%]">
      <div
        className="flex flex-col  w-[100%] p-2"
        style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
      >
        <label className="text-sm font-bold flex items-center gap-2  text-black mb-2 pb-2">
          <BookmarkAdd style={{ color: "#a3cb39" }} /> Informações Gerais
        </label>
        <div className="flex w-full items-center gap-2 flex-wrap">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Data Emissão*"
            type="date"
            value={dataEmissao}
            error={dataEmissaoErro}
            helperText={dataEmissaoErro ? "Campo obrigatório" : ""}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
            }}
            onChange={(e) => {
              setDataEmissao(e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            size="small"
            label="Validade*"
            value={validade}
            error={validadeErro}
            helperText={validadeErro ? "Campo obrigatório" : ""}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "37%" },
            }}
            onChange={(e) => {
              setValidade(e.target.value);
            }}
            required
            autoComplete="off"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Status"
            select
            value={statusSelecionado}
            onChange={(e) => setStatusSelecionado(e.target.value)}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "49%" },
            }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Article />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="pendente_ligacao">Pendente Ligação</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
            <MenuItem value="venda_concluida">Venda Concluída</MenuItem>
            <MenuItem value="em_andamento">Em Andamento</MenuItem>
          </TextField>
          <Autocomplete
            size="small"
            options={categorias}
            loading={loadingCategorias}
            getOptionLabel={(option) => option.nome}
            value={categoriaSelecionada}
            onChange={(event, newValue) => {
              setCategoriaSelecionada(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categoria"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Category />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "49%" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InformacoesGerais;
