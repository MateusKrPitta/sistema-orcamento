import { Article, CalendarToday, CurrencyExchange } from "@mui/icons-material";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";

const FormasPagamentoOrcamento = ({
  tipoPagamento,
  setTipoPagamento,
  prazoEntrega,
  setPrazoEntrega,
  observacoesPagamento,
  setObservacoesPagamento,
  tipoPagamentoErro,
}) => {
  return (
    <div
      className="flex flex-col w-[50%] p-2"
      style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
    >
      <label className="text-sm font-bold flex items-center gap-2 text-black mb-2 pb-2">
        <CurrencyExchange style={{ color: "#a3cb39" }} />
        Forma de Pagamento
      </label>
      <div className="flex w-full items-center gap-3 flex-wrap">
        <FormControl
          sx={{
            width: { xs: "72%", sm: "50%", md: "40%", lg: "62%" },
          }}
          size="small"
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Tipo Pagamento*"
            select
            value={tipoPagamento}
            error={tipoPagamentoErro}
            helperText={tipoPagamentoErro ? "Campo obrigatório" : ""}
            onChange={(e) => setTipoPagamento(e.target.value)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Article />
                </InputAdornment>
              ),
            }}
            required
          >
            <MenuItem value="dinheiro">Dinheiro</MenuItem>
            <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
            <MenuItem value="cartao_debito">Cartão de Débito</MenuItem>
            <MenuItem value="pix">PIX</MenuItem>
          </TextField>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          type="date"
          label="Prazo de Entrega"
          value={prazoEntrega}
          sx={{
            width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
          }}
          onChange={(e) => setPrazoEntrega(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Observações"
          value={observacoesPagamento}
          onChange={(e) => setObservacoesPagamento(e.target.value)}
          multiline
          rows={3}
          sx={{
            width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Article />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FormasPagamentoOrcamento;
