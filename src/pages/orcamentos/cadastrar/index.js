import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  AddCircle,
  Article,
  CalendarToday,
  Category,
  CurrencyExchange,
  DateRange,
  Delete,
  Edit,
  LocationOn,
  Mail,
  Numbers,
  Person,
  ProductionQuantityLimits,
  Save,
  WhatsApp,
  Work,
} from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import ImprimirOrcamento from "../imprimir";

const CadastrarOrcamento = () => {
  const [numeroOrcamento, setNumeroOrcamento] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [enderecoCliente, setEnderecoCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [emailResponsavel, setEmailResponsavel] = useState("");
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoQuantidade, setProdutoQuantidade] = useState("");
  const [produtoPreco, setProdutoPreco] = useState("");
  const [produtoSubTotal, setProdutoSubTotal] = useState("");
  const [subTotalGeral, setSubTotalGeral] = useState("");
  const [desconto, setDesconto] = useState("");
  const [imposto, setImposto] = useState("");
  const [frete, setFrete] = useState("");
  const [observacoesProdutos, setObservacoesProdutos] = useState("");
  const [totalGeral, setTotalGeral] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [observacoesPagamento, setObservacoesPagamento] = useState("");

  const [cadastro, setCadastro] = useState(false);

  const ModalCadastro = () => {
    setCadastro(true);
  };

  const ModalFecha = () => {
    setCadastro(false);
  };

  const adicionarProduto = () => {
    if (!produtoNome.trim() || !produtoQuantidade || !produtoPreco) {
      alert("Por favor, preencha nome, quantidade e preço do produto");
      return;
    }

    const quantidade = parseFloat(produtoQuantidade);
    const preco = parseFloat(produtoPreco);
    const subTotalCalculado = quantidade * preco;

    const novoProduto = {
      id: Date.now(),
      nome: produtoNome,
      quantidade: quantidade,
      preco: preco,
      subTotal: produtoSubTotal
        ? parseFloat(produtoSubTotal)
        : subTotalCalculado,
    };

    setProdutos([...produtos, novoProduto]);

    const novoSubTotalGeral =
      produtos.reduce(
        (total, produto) =>
          total + (produto.subTotal || produto.quantidade * produto.preco),
        0
      ) + subTotalCalculado;

    setSubTotalGeral(novoSubTotalGeral.toString());

    const descontoVal = parseFloat(desconto) || 0;
    const impostoVal = parseFloat(imposto) || 0;
    const freteVal = parseFloat(frete) || 0;

    const totalCalculado =
      novoSubTotalGeral - descontoVal + impostoVal + freteVal;
    setTotalGeral(totalCalculado.toString());

    setProdutoNome("");
    setProdutoQuantidade("");
    setProdutoPreco("");
    setProdutoSubTotal("");
  };

  const removerProduto = (id) => {
    const produtoRemovido = produtos.find((produto) => produto.id === id);
    setProdutos(produtos.filter((produto) => produto.id !== id));

    if (produtoRemovido) {
      const novoSubTotalGeral =
        produtos.reduce(
          (total, produto) =>
            total + (produto.subTotal || produto.quantidade * produto.preco),
          0
        ) -
        (produtoRemovido.subTotal ||
          produtoRemovido.quantidade * produtoRemovido.preco);

      setSubTotalGeral(novoSubTotalGeral.toString());

      const descontoVal = parseFloat(desconto) || 0;
      const impostoVal = parseFloat(imposto) || 0;
      const freteVal = parseFloat(frete) || 0;

      const totalCalculado =
        novoSubTotalGeral - descontoVal + impostoVal + freteVal;
      setTotalGeral(totalCalculado.toString());
    }
  };

  const handleDescontoChange = (value) => {
    setDesconto(value);
    const subTotalVal = parseFloat(subTotalGeral) || 0;
    const descontoVal = parseFloat(value) || 0;
    const impostoVal = parseFloat(imposto) || 0;
    const freteVal = parseFloat(frete) || 0;

    const totalCalculado = subTotalVal - descontoVal + impostoVal + freteVal;
    setTotalGeral(totalCalculado.toString());
  };

  const handleImpostoChange = (value) => {
    setImposto(value);
    const subTotalVal = parseFloat(subTotalGeral) || 0;
    const descontoVal = parseFloat(desconto) || 0;
    const impostoVal = parseFloat(value) || 0;
    const freteVal = parseFloat(frete) || 0;

    const totalCalculado = subTotalVal - descontoVal + impostoVal + freteVal;
    setTotalGeral(totalCalculado.toString());
  };

  const handleFreteChange = (value) => {
    setFrete(value);
    const subTotalVal = parseFloat(subTotalGeral) || 0;
    const descontoVal = parseFloat(desconto) || 0;
    const impostoVal = parseFloat(imposto) || 0;
    const freteVal = parseFloat(value) || 0;

    const totalCalculado = subTotalVal - descontoVal + impostoVal + freteVal;
    setTotalGeral(totalCalculado.toString());
  };
  return (
    <div>
      <ButtonComponent
        startIcon={<AddCircle fontSize="small" />}
        title={"Cadastrar"}
        subtitle={"Cadastrar"}
        buttonSize="large"
        onClick={ModalCadastro}
      />
      <CentralModal
        tamanhoTitulo={"81%"}
        maxHeight={"90vh"}
        width={"1200px"}
        icon={<AddCircle fontSize="small" />}
        open={cadastro}
        onClose={ModalFecha}
        title="Cadastrar Orçamento"
      >
        <div className="overflow-y-auto overflow-x-hidden max-h-[700px]">
          <div className="flex items-start gap-2 w-full">
            <div className="mt-4 flex gap-3 flex-wrap w-[50%] items-start ">
              <div
                className="flex flex-col  w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2  text-black mb-2 pb-2">
                  <BookmarkAddedIcon style={{ color: "#a3cb39" }} /> Informações
                  Gerais
                </label>
                <div className="flex w-full items-center gap-2 flex-wrap">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nº Orçamento*"
                    value={numeroOrcamento}
                    onChange={(e) => setNumeroOrcamento(e.target.value)}
                    autoComplete="off"
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "25%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Numbers />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Data Emissão"
                    type="date"
                    value={dataEmissao}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
                    }}
                    onChange={(e) => setDataEmissao(e.target.value)}
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
                    type="date"
                    size="small"
                    label="Validade"
                    value={validade}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "37%" },
                    }}
                    onChange={(e) => setValidade(e.target.value)}
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
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Categoria"
                    select
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "49%" },
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Category />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div
                className="flex flex-col  w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2 mb-2  text-black pb-2">
                  <Person style={{ color: "#a3cb39" }} />
                  Dados do Cliente
                </label>
                <div className="flex w-full items-center gap-3 flex-wrap">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome Completo*"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
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
                    value={telefoneCliente}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
                    }}
                    onChange={(e) => setTelefoneCliente(e.target.value)}
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
                    label="Endereço"
                    value={enderecoCliente}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
                    }}
                    onChange={(e) => setEnderecoCliente(e.target.value)}
                    required
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
                    required
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

              <div
                className="flex flex-col  w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2  text-black mb-2 pb-2">
                  <Work style={{ color: "#a3cb39" }} />
                  Responsável
                </label>
                <div className="flex w-full items-center gap-3 flex-wrap">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome Completo*"
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
                    value={telefoneResponsavel}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
                    }}
                    onChange={(e) => setTelefoneResponsavel(e.target.value)}
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
                    required
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
            <div className="mt-4 flex gap-3 flex-wrap w-[48%] items-start ">
              <div
                className="flex flex-col  w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2  text-black mb-2 pb-2">
                  <ProductionQuantityLimits style={{ color: "#a3cb39" }} />{" "}
                  Produtos
                </label>
                <div className="flex w-full items-center gap-3 flex-wrap mb-3">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do Produto*"
                    value={produtoNome}
                    onChange={(e) => setProdutoNome(e.target.value)}
                    autoComplete="off"
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
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
                    label="Quantidade"
                    type="number"
                    value={produtoQuantidade}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "20%" },
                    }}
                    onChange={(e) => setProdutoQuantidade(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Numbers />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Preço Unitário"
                    type="number"
                    value={produtoPreco}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                    }}
                    onChange={(e) => setProdutoPreco(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Sub Total"
                    type="number"
                    value={produtoSubTotal}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "31%" },
                    }}
                    onChange={(e) => setProdutoSubTotal(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <IconButton
                    title="Adicionar Produto"
                    onClick={adicionarProduto}
                    sx={{
                      color: "#a3cb39",
                      border: "1px solid #a3cb39",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#a3cb39",
                        border: "1px solid #005a2a",
                      },
                    }}
                  >
                    <AddCircle fontSize={"small"} />
                  </IconButton>

                  {/* Lista de produtos adicionados */}
                  <div className="w-full ">
                    <label className="text-black text-xs font-bold mb-2 block">
                      Produtos Adicionados:
                    </label>

                    {produtos.length === 0 ? (
                      <p className="text-gray-500 text-sm ">
                        Nenhum produto adicionado ainda.
                      </p>
                    ) : (
                      <TableContainer
                        component={Paper}
                        sx={{
                          maxHeight: 200,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "12px" }}
                              >
                                Produto
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "12px" }}
                                align="right"
                              >
                                Qtd
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "12px" }}
                                align="right"
                              >
                                Preço Unit.
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "12px" }}
                                align="right"
                              >
                                SubTotal
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "12px" }}
                                align="center"
                              >
                                Ações
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {produtos.map((produto) => (
                              <TableRow key={produto.id}>
                                <TableCell sx={{ fontSize: "12px" }}>
                                  {produto.nome}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "12px" }}
                                  align="right"
                                >
                                  {produto.quantidade}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "12px" }}
                                  align="right"
                                >
                                  R$ {produto.preco.toFixed(2)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                  align="right"
                                >
                                  R${" "}
                                  {(
                                    produto.subTotal ||
                                    produto.quantidade * produto.preco
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: "#006b33",
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => removerProduto(produto.id)}
                                    sx={{
                                      color: "#ff4444",
                                      "&:hover": {
                                        backgroundColor: "#ffebee",
                                      },
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Sub Total"
                    type="number"
                    value={subTotalGeral}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "25%" },
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Desconto"
                    type="number"
                    value={desconto}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "23%" },
                    }}
                    onChange={(e) => handleDescontoChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Imposto"
                    type="number"
                    value={imposto}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "23%" },
                    }}
                    onChange={(e) => handleImpostoChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Frete"
                    type="number"
                    value={frete}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "22%" },
                    }}
                    onChange={(e) => handleFreteChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Observações"
                    value={observacoesProdutos}
                    onChange={(e) => setObservacoesProdutos(e.target.value)}
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
                  <div className="flex items-end justify-end w-full">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Total Geral"
                      type="number"
                      value={totalGeral}
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyExchange />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col  w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2  text-black mb-2 pb-2">
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
                      onChange={(e) => setTipoPagamento(e.target.value)}
                      autoComplete="off"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Article />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="dinheiro">Dinheiro</MenuItem>
                      <MenuItem value="cartao_credito">
                        Cartão de Crédito
                      </MenuItem>
                      <MenuItem value="cartao_debito">
                        Cartão de Débito
                      </MenuItem>
                      <MenuItem value="pix">PIX</MenuItem>
                      <MenuItem value="boleto">Boleto</MenuItem>
                      <MenuItem value="transferencia">
                        Transferência Bancária
                      </MenuItem>
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
            </div>
          </div>
          <div className="flex w-[99%] items-center gap-2 justify-center mt-2">
            <ImprimirOrcamento />
            <ButtonComponent
              startIcon={<Save fontSize="small" />}
              title={"Cadastrar"}
              subtitle={"Cadastrar"}
              buttonSize="large"
            />
          </div>
        </div>
      </CentralModal>
    </div>
  );
};

export default CadastrarOrcamento;
