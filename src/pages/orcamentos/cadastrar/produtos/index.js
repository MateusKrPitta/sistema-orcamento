import {
  AddCircle,
  Article,
  CurrencyExchange,
  Delete,
  Numbers,
  ProductionQuantityLimits,
  Save,
  SubdirectoryArrowRight,
  Category,
  ListAlt,
  Edit,
} from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Stack,
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  formatarValor,
  mascaraValorInput,
  parseValor,
} from "../../../../utils/formatValor";
import CustomToast from "../../../../components/toast";
import { criarProduto } from "../../../../services/post/produto";
import { buscarProdutosAtivo } from "../../../../services/get/produtos-ativos";

const ProdutosOrcamento = ({
  produtos,
  setProdutos,
  subTotalGeral,
  setSubTotalGeral,
  desconto,
  setDesconto,
  imposto,
  setImposto,
  frete,
  setFrete,
  observacoesProdutos,
  setObservacoesProdutos,
  totalGeral,
  setTotalGeral,
  descontoFormatado,
  setDescontoFormatado,
  impostoFormatado,
  setImpostoFormatado,
  freteFormatado,
  setFreteFormatado,
  loadingProdutos,
  setCadastrandoProduto,
  cadastrandoProduto,
}) => {
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoQuantidade, setProdutoQuantidade] = useState("");
  const [produtoPrecoFormatado, setProdutoPrecoFormatado] = useState("");
  const [produtoSubTotalFormatado, setProdutoSubTotalFormatado] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [tipoItem, setTipoItem] = useState("normal");
  const [itemPrincipalId, setItemPrincipalId] = useState("");
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const carregarProdutos = async (search = "") => {
    setLoading(true);
    try {
      const response = await buscarProdutosAtivo(search);
      if (response.success) {
        setProdutosDisponiveis(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarProdutos(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  // Calcular subtotal do produto atual
  useEffect(() => {
    if (produtoQuantidade && produtoPrecoFormatado) {
      const qtd = parseFloat(produtoQuantidade) || 0;
      const preco = parseValor(produtoPrecoFormatado) || 0;
      setProdutoSubTotalFormatado(formatarValor(qtd * preco));
    }
  }, [produtoQuantidade, produtoPrecoFormatado]);

  // Calcular totais gerais
  useEffect(() => {
    const subTotal = produtos.reduce((acc, p) => acc + (p.subTotal || 0), 0);
    setSubTotalGeral(subTotal);

    const desc = parseValor(descontoFormatado) || 0;
    const imp = parseValor(impostoFormatado) || 0;
    const fret = parseValor(freteFormatado) || 0;

    setTotalGeral(subTotal - desc + imp + fret);
  }, [produtos, descontoFormatado, impostoFormatado, freteFormatado]);

  const adicionarProduto = async () => {
    // Validação baseada no tipo
    if (!produtoNome.trim()) {
      CustomToast({
        type: "warning",
        message: "Nome do produto é obrigatório",
      });
      return;
    }

    if (!produtoQuantidade) {
      CustomToast({ type: "warning", message: "Quantidade é obrigatória" });
      return;
    }

    // Só valida preço se NÃO for subitem
    if (tipoItem !== "subitem") {
      if (!produtoPrecoFormatado) {
        CustomToast({ type: "warning", message: "Preço é obrigatório" });
        return;
      }
    }

    if (tipoItem === "subitem" && !itemPrincipalId) {
      CustomToast({ type: "warning", message: "Selecione o item principal" });
      return;
    }

    const quantidade = parseFloat(produtoQuantidade);
    const preco =
      tipoItem === "subitem" ? 0 : parseValor(produtoPrecoFormatado) || 0;
    const subTotal = quantidade * preco;

    const existe = produtosDisponiveis.some(
      (p) => p.nome.toLowerCase() === produtoNome.trim().toLowerCase(),
    );

    let produtoId = 0;
    if (!existe) {
      setCadastrandoProduto(true);
      const result = await criarProduto(produtoNome.trim());
      if (result.success) {
        produtoId = result.data?.data?.id || 0;
        const response = await buscarProdutosAtivo();
        if (response.success) setProdutosDisponiveis(response.data);
      }
      setCadastrandoProduto(false);
    }

    const novoProduto = {
      id: editandoId || Date.now(),
      nome: produtoNome,
      quantidade,
      preco,
      subTotal,
      produto_id: produtoId,
      tipo: tipoItem,
      principalId: tipoItem === "subitem" ? itemPrincipalId : null,
    };

    if (editandoId) {
      setProdutos(produtos.map((p) => (p.id === editandoId ? novoProduto : p)));
      setEditandoId(null);
    } else {
      setProdutos([...produtos, novoProduto]);
    }

    setProdutoNome("");
    setInputValue("");
    setProdutoQuantidade("");
    setProdutoPrecoFormatado("");
    setProdutoSubTotalFormatado("");
    setTipoItem("normal");
    setItemPrincipalId("");
  };

  const editarProduto = (produto) => {
    setEditandoId(produto.id);
    setProdutoNome(produto.nome);
    setProdutoQuantidade(produto.quantidade.toString());
    setProdutoPrecoFormatado(formatarValor(produto.preco));
    setProdutoSubTotalFormatado(formatarValor(produto.subTotal));
    setTipoItem(produto.tipo || "normal");
    setItemPrincipalId(produto.principalId || "");
  };

  const removerProduto = (id) => {
    const produto = produtos.find((p) => p.id === id);
    if (produto?.tipo === "principal") {
      setProdutos(produtos.filter((p) => p.id !== id && p.principalId !== id));
    } else {
      setProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setProdutoNome("");
    setInputValue("");
    setProdutoQuantidade("");
    setProdutoPrecoFormatado("");
    setProdutoSubTotalFormatado("");
    setTipoItem("normal");
    setItemPrincipalId("");
  };

  const itensPrincipais = produtos.filter((p) => p.tipo === "principal");
  const itensNormais = produtos.filter((p) => p.tipo === "normal");

  const getSubItens = (principalId) => {
    return produtos.filter((p) => p.principalId === principalId);
  };

  const renderItemList = () => {
    if (produtos.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#fff9c4" }}>
          <Typography color="textSecondary">
            Adicione pelo menos um produto para continuar
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Itens Principais */}
        {itensPrincipais.length > 0 && (
          <>
            <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
              <Chip
                icon={<Category />}
                label="PRODUTOS PRINCIPAIS"
                size="small"
                sx={{ fontWeight: "bold", bgcolor: "white" }}
              />
            </Box>
            {itensPrincipais.map((item) => (
              <Box key={item.id}>
                {/* Item Principal */}
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    p: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SubdirectoryArrowRight sx={{ color: "#757575" }} />
                    <Typography fontWeight="bold">📌 {item.nome}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={`Qtd: ${item.quantidade}`}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2">
                      R$ {formatarValor(item.preco)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      R$ {formatarValor(item.subTotal)}
                    </Typography>

                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => editarProduto(item)}
                        sx={{ color: "#a3cb39" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => removerProduto(item.id)}
                        sx={{ color: "#ff4444" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Subitens */}
                {getSubItens(item.id).map((subItem) => (
                  <Box
                    key={subItem.id}
                    sx={{
                      p: 1.5,
                      pl: 4,
                      borderBottom: "1px solid #e0e0e0",
                      bgcolor: "#fafafa",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        ↳
                      </Typography>
                      <Typography variant="body2">{subItem.nome}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={`Qtd: ${subItem.quantidade}`}
                        size="small"
                        variant="outlined"
                      />
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => editarProduto(subItem)}
                          sx={{ color: "#a3cb39" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removerProduto(subItem.id)}
                          sx={{ color: "#ff4444" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}

        {/* Itens Normais */}
        {itensNormais.length > 0 && (
          <>
            <Box
              sx={{
                bgcolor: "#e0e0e0",
                p: 1.5,
                mt: itensPrincipais.length > 0 ? 0 : 0,
              }}
            >
              <Chip
                icon={<ListAlt />}
                label="PRODUTOS AVULSOS"
                size="small"
                sx={{ fontWeight: "bold", bgcolor: "white" }}
              />
            </Box>
            {itensNormais.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>•</Typography>
                  <Typography>{item.nome}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`Qtd: ${item.quantidade}`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="body2">
                    R$ {formatarValor(item.preco)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    R$ {formatarValor(item.subTotal)}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => editarProduto(item)}
                      sx={{ color: "#a3cb39" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removerProduto(item.id)}
                      sx={{ color: "#ff4444" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Paper>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #a3cb39",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
      >
        <ProductionQuantityLimits sx={{ color: "#a3cb39" }} />
        Produtos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo do Item</InputLabel>
            <Select
              value={tipoItem}
              label="Tipo do Item"
              onChange={(e) => {
                setTipoItem(e.target.value);
                if (e.target.value === "principal") {
                  setProdutoQuantidade("1");
                }
                setItemPrincipalId("");
              }}
            >
              <MenuItem value="normal">Item Normal (avulso)</MenuItem>
              <MenuItem value="principal">
                Item Principal (com subitens)
              </MenuItem>
              <MenuItem value="subitem">Subitem (vinculado)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {tipoItem === "subitem" && itensPrincipais.length > 0 && (
          <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Vincular ao Item Principal</InputLabel>
              <Select
                value={itemPrincipalId}
                label="Vincular ao Item Principal"
                onChange={(e) => setItemPrincipalId(e.target.value)}
              >
                {itensPrincipais.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
      >
        <Autocomplete
          size="small"
          options={produtosDisponiveis}
          loading={loading || loadingProdutos}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.nome || "")}
          value={produtoNome ? { nome: produtoNome } : null}
          inputValue={inputValue}
          onChange={(e, v) => {
            if (typeof v === "string") {
              setProdutoNome(v);
            } else if (v && v.nome) {
              setProdutoNome(v.nome);
            } else {
              setProdutoNome("");
            }
          }}
          freeSolo
          onInputChange={(e, val) => {
            setProdutoNome(val);
            setInputValue(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Produto*"
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Article fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <TextField
          size="small"
          label="Quantidade*"
          type="number"
          value={produtoQuantidade}
          onChange={(e) => setProdutoQuantidade(e.target.value)}
          sx={{ width: 120 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Numbers fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          label="Preço*"
          value={produtoPrecoFormatado}
          onChange={(e) =>
            setProdutoPrecoFormatado(mascaraValorInput(e.target.value))
          }
          disabled={tipoItem === "subitem"} // ← Desabilita para subitens
          sx={{ width: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyExchange fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          label="Subtotal"
          value={produtoSubTotalFormatado}
          sx={{ width: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyExchange fontSize="small" />
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={editandoId ? "Atualizar" : "Adicionar"}>
            <span>
              <IconButton
                onClick={adicionarProduto}
                disabled={cadastrandoProduto}
                sx={{
                  color: "#a3cb39",
                  border: "1px solid #a3cb39",
                  "&:hover": {
                    bgcolor: "#a3cb39",
                    color: "white",
                  },
                }}
              >
                {cadastrandoProduto ? (
                  <CircularProgress size={20} />
                ) : editandoId ? (
                  <Save fontSize="small" />
                ) : (
                  <AddCircle fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>

          {editandoId && (
            <Tooltip title="Cancelar">
              <IconButton
                onClick={cancelarEdicao}
                sx={{
                  color: "#ff4444",
                  border: "1px solid #ff4444",
                  "&:hover": {
                    bgcolor: "#ff4444",
                    color: "white",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>{renderItemList()}</Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Subtotal"
            value={formatarValor(subTotalGeral)}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyExchange fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Desconto"
            value={descontoFormatado}
            onChange={(e) =>
              setDescontoFormatado(mascaraValorInput(e.target.value))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyExchange fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Imposto"
            value={impostoFormatado}
            onChange={(e) =>
              setImpostoFormatado(mascaraValorInput(e.target.value))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyExchange fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Frete"
            value={freteFormatado}
            onChange={(e) =>
              setFreteFormatado(mascaraValorInput(e.target.value))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyExchange fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            size="small"
            label="Total Geral"
            value={formatarValor(totalGeral)}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyExchange fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        size="small"
        label="Observações"
        value={observacoesProdutos}
        onChange={(e) => setObservacoesProdutos(e.target.value)}
        multiline
        rows={2}
        sx={{ mt: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Article fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default ProdutosOrcamento;
