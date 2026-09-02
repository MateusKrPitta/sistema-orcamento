import React, { useEffect, useState } from "react";
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
  Autocomplete,
  CircularProgress,
  Box,
  Tooltip,
  Select,
  InputLabel,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import {
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
  AddCircle,
  SubdirectoryArrowRight,
  ListAlt,
  Business,
} from "@mui/icons-material";
import ModalLateral from "../../../components/modal-lateral";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { buscarProdutosAtivo } from "../../../services/get/produtos-ativos";
import { buscarCategoriasAtivos } from "../../../services/get/categoria-ativa";
import { buscarClientes } from "../../../services/get/cliente";
import { criarCliente } from "../../../services/post/cliente";
import { criarProduto } from "../../../services/post/produto";
import { editarOrcamento } from "../../../services/put/orcamento";
import {
  formatarValor,
  mascaraValorInput,
  parseValor,
} from "../../../utils/formatValor";
import { mascaraTelefone } from "../../../utils/formatTelefone";
import CustomToast from "../../../components/toast";
import ButtonComponent from "../../../components/button";

const EditarOrcamento = ({
  open,
  handleClose,
  dadosOrcamento,
  loading,
  error,
  onSuccess,
}) => {
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

  // Estados para produtos com hierarquia
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoQuantidade, setProdutoQuantidade] = useState("");
  const [produtoPreco, setProdutoPreco] = useState("");
  const [produtoPrecoFormatado, setProdutoPrecoFormatado] = useState("");
  const [produtoSubTotal, setProdutoSubTotal] = useState("");
  const [produtoSubTotalFormatado, setProdutoSubTotalFormatado] = useState("");
  const [tipoItem, setTipoItem] = useState("normal");
  const [itemPrincipalId, setItemPrincipalId] = useState("");

  const [subTotalGeral, setSubTotalGeral] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [imposto, setImposto] = useState(0);
  const [frete, setFrete] = useState(0);
  const [observacoesProdutos, setObservacoesProdutos] = useState("");
  const [totalGeral, setTotalGeral] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [numeroConta, setNumeroConta] = useState("");
  const [setor, setSetor] = useState("");

  const [descontoFormatado, setDescontoFormatado] = useState("");
  const [impostoFormatado, setImpostoFormatado] = useState("");
  const [freteFormatado, setFreteFormatado] = useState("");
  const [telefoneClienteFormatado, setTelefoneClienteFormatado] = useState("");
  const [telefoneResponsavelFormatado, setTelefoneResponsavelFormatado] =
    useState("");
  const [observacoesPagamento, setObservacoesPagamento] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [editandoProdutoId, setEditandoProdutoId] = useState(null);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [clienteExistente, setClienteExistente] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingCadastroCliente, setLoadingCadastroCliente] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [cadastrandoProduto, setCadastrandoProduto] = useState(false);
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false);
  const [dataEmissaoErro, setDataEmissaoErro] = useState(false);
  const [validadeErro, setValidadeErro] = useState(false);
  const [nomeClienteErro, setNomeClienteErro] = useState(false);
  const [telefoneClienteErro, setTelefoneClienteErro] = useState(false);
  const [tipoPagamentoErro, setTipoPagamentoErro] = useState(false);
  const [inputCliente, setInputCliente] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputProduto, setInputProduto] = useState("");
  const [loadingClientesSearch, setLoadingClientesSearch] = useState(false);
  const [loadingCategoriasSearch, setLoadingCategoriasSearch] = useState(false);
  const [loadingProdutosSearch, setLoadingProdutosSearch] = useState(false);

  const carregarProdutos = async (search = "") => {
    setLoadingProdutosSearch(true);
    try {
      const response = await buscarProdutosAtivo(search);
      if (response.success) {
        setProdutosDisponiveis(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoadingProdutosSearch(false);
    }
  };

  const carregarClientes = async (search = "") => {
    setLoadingClientesSearch(true);
    try {
      const response = await buscarClientes(search);
      if (response.success) {
        const clientesArray = response.data.data || response.data || [];
        setClientesDisponiveis(clientesArray);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoadingClientesSearch(false);
    }
  };

  const carregarCategorias = async (search = "") => {
    setLoadingCategoriasSearch(true);
    try {
      const response = await buscarCategoriasAtivos(search);
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoadingCategoriasSearch(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      carregarClientes(inputCliente);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputCliente, open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      carregarCategorias(inputCategoria);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputCategoria, open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      carregarProdutos(inputProduto);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputProduto, open]);

  useEffect(() => {
    if (dadosOrcamento && open) {
      inicializarDados();
    }
  }, [dadosOrcamento, open]);

  useEffect(() => {
    if (statusSelecionado === "em_andamento" && validade) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = validade.split('-');
      if (ano && mes && dia) {
        const dataValidade = new Date(ano, mes - 1, dia);
        if (dataValidade < hoje) {
          setStatusSelecionado("pendente_ligacao");
          CustomToast({
            type: "info",
            message: "O status foi alterado para Pendente pois a validade foi ultrapassada.",
          });
        }
      }
    }
  }, [validade, statusSelecionado]);

  const inicializarDados = () => {
    if (!dadosOrcamento) return;

    setNumeroOrcamento(dadosOrcamento.numero?.toString() || "");
    setDataEmissao(formatDateForInput(dadosOrcamento.data_emissao) || "");
    setValidade(formatDateForInput(dadosOrcamento.validade) || "");
    setStatusSelecionado(dadosOrcamento.status || "");
    setCategoriaSelecionada(dadosOrcamento.categoria || null);

    // Dados do cliente
    setNomeCliente(dadosOrcamento.cliente?.nome || "");
    const telefoneCliente = dadosOrcamento.cliente?.telefone || "";
    const telefoneClienteFormatado = mascaraTelefone(telefoneCliente);
    setTelefoneClienteFormatado(telefoneClienteFormatado);
    setTelefoneCliente(telefoneClienteFormatado.replace(/\D/g, ""));
    setEnderecoCliente(dadosOrcamento.cliente?.endereco || "");
    setEmailCliente(dadosOrcamento.cliente?.email || "");

    // Responsável
    setNomeResponsavel(dadosOrcamento.responsavel?.nome || "");
    const telefoneResponsavel = dadosOrcamento.responsavel?.telefone || "";
    const telefoneResponsavelFormatado = mascaraTelefone(telefoneResponsavel);
    setTelefoneResponsavelFormatado(telefoneResponsavelFormatado);
    setTelefoneResponsavel(telefoneResponsavelFormatado.replace(/\D/g, ""));
    setEmailResponsavel(dadosOrcamento.responsavel?.email || "");

    // PROCESSAR PRODUTOS COM A NOVA ESTRUTURA
    const produtosFormatados = [];

    // Processar itens principais e seus subitens
    if (
      dadosOrcamento.itens_principais &&
      Array.isArray(dadosOrcamento.itens_principais)
    ) {
      dadosOrcamento.itens_principais.forEach((principal) => {
        // Adicionar item principal
        produtosFormatados.push({
          id: principal.id || Date.now() + Math.random(),
          nome: principal.produto_nome || "",
          quantidade: principal.quantidade || 0,
          preco: principal.preco_unitario || 0,
          subTotal: principal.subtotal || 0,
          produto_id: principal.produto?.id || principal.produto_id || 0,
          tipo: "principal",
          principalId: null,
          observacoes: principal.observacoes || "",
        });

        // Adicionar subitens deste principal
        if (principal.subitens && Array.isArray(principal.subitens)) {
          principal.subitens.forEach((sub) => {
            produtosFormatados.push({
              id: sub.id || Date.now() + Math.random(),
              nome: sub.produto_nome || "",
              quantidade: sub.quantidade || 0,
              preco: sub.preco_unitario || 0,
              subTotal: sub.subtotal || 0,
              produto_id: sub.produto?.id || sub.produto_id || 0,
              tipo: "subitem",
              principalId: principal.id,
              observacoes: sub.observacoes || "",
            });
          });
        }
      });
    }

    // Processar itens avulsos
    if (
      dadosOrcamento.itens_avulsos &&
      Array.isArray(dadosOrcamento.itens_avulsos)
    ) {
      dadosOrcamento.itens_avulsos.forEach((item) => {
        produtosFormatados.push({
          id: item.id || Date.now() + Math.random(),
          nome: item.produto_nome || "",
          quantidade: item.quantidade || 0,
          preco: item.preco_unitario || 0,
          subTotal: item.subtotal || 0,
          produto_id: item.produto?.id || item.produto_id || 0,
          tipo: "normal",
          principalId: null,
          observacoes: item.observacoes || "",
        });
      });
    }

    setProdutos(produtosFormatados);

    // Calcular totais
    const subtotalCalculado = produtosFormatados.reduce((total, produto) => {
      return total + (produto.subTotal || produto.quantidade * produto.preco);
    }, 0);

    const descontoVal = parseFloat(dadosOrcamento.totais?.desconto) || 0;
    const impostoVal = parseFloat(dadosOrcamento.totais?.imposto) || 0;
    const freteVal = parseFloat(dadosOrcamento.totais?.frete) || 0;

    setSubTotalGeral(subtotalCalculado);
    setDesconto(descontoVal);
    setImposto(impostoVal);
    setFrete(freteVal);

    setDescontoFormatado(formatarValor(descontoVal));
    setImpostoFormatado(formatarValor(impostoVal));
    setFreteFormatado(formatarValor(freteVal));

    setObservacoesProdutos(dadosOrcamento.observacoes || "");
    setTipoPagamento(dadosOrcamento.forma_pagamento?.tipo || "");
    setPrazoEntrega(
      formatDateForInput(dadosOrcamento.forma_pagamento?.prazo_entrega) || "",
    );
    setObservacoesPagamento(dadosOrcamento.forma_pagamento?.observacoes || "");
    setDataPagamento(
      formatDateForInput(dadosOrcamento.forma_pagamento?.data_pagamento) || "",
    );
    setNumeroConta(dadosOrcamento.forma_pagamento?.numero_conta || "");
    setSetor(dadosOrcamento.setor || "");

    if (dadosOrcamento.cliente?.id) {
      setClienteId(dadosOrcamento.cliente.id);
      setClienteSelecionado(dadosOrcamento.cliente);
      setClienteExistente(true);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  const validarFormulario = () => {
    return (
      dataEmissao &&
      validade &&
      nomeCliente.trim() &&
      telefoneCliente.replace(/\D/g, "").length >= 10 &&
      tipoPagamento &&
      produtos.length > 0
    );
  };

  const validarCampo = (campo, valor) => {
    switch (campo) {
      case "dataEmissao":
        setDataEmissaoErro(!valor);
        break;
      case "validade":
        setValidadeErro(!valor);
        break;
      case "nomeCliente":
        setNomeClienteErro(!valor.trim());
        break;
      case "telefoneCliente":
        const telefoneLimpo = valor.replace(/\D/g, "");
        setTelefoneClienteErro(telefoneLimpo.length < 10);
        break;
      case "tipoPagamento":
        setTipoPagamentoErro(!valor);
        break;
    }
  };

  const cadastrarClientePrimeiro = async () => {
    if (clienteSelecionado && clienteSelecionado.id) {
      return clienteSelecionado.id;
    }

    if (!nomeCliente || !telefoneCliente) {
      CustomToast({
        type: "warning",
        message: "Nome e telefone do cliente são obrigatórios",
      });
      return null;
    }

    setLoadingCadastroCliente(true);
    try {
      const resultado = await criarCliente(
        nomeCliente,
        telefoneCliente,
        emailCliente || null,
        enderecoCliente || null,
      );

      if (resultado.success) {
        const clienteCriado = resultado.data.data;
        setClienteId(clienteCriado.id);
        CustomToast({
          type: "success",
          message: `Cliente "${nomeCliente}" cadastrado com sucesso!`,
        });
        await carregarClientes();
        return clienteCriado.id;
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      CustomToast({ type: "error", message: "Erro ao cadastrar cliente" });
    } finally {
      setLoadingCadastroCliente(false);
    }
    return null;
  };

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
      CustomToast({
        type: "warning",
        message: "Quantidade é obrigatória",
      });
      return;
    }

    // Só valida preço se NÃO for subitem
    if (tipoItem !== "subitem") {
      if (!produtoPrecoFormatado) {
        CustomToast({
          type: "warning",
          message: "Preço é obrigatório",
        });
        return;
      }
    }

    if (tipoItem === "subitem" && !itemPrincipalId) {
      CustomToast({
        type: "warning",
        message: "Selecione o item principal para este subitem",
      });
      return;
    }

    const quantidade = parseFloat(produtoQuantidade);
    // Se for subitem, preço = 0, senão pega o valor digitado
    const preco =
      tipoItem === "subitem" ? 0 : parseValor(produtoPrecoFormatado) || 0;
    const subTotalCalculado = quantidade * preco;
    const nomeProdutoFormatado = produtoNome.trim();

    // Verificar se produto já existe
    const produtoExistente = produtosDisponiveis.find(
      (p) => p.nome.toLowerCase() === nomeProdutoFormatado.toLowerCase(),
    );

    let produtoIdParaOrcamento = produtoExistente?.id || 0;

    // Se produto não existe, cadastrar
    if (!produtoExistente) {
      setCadastrandoProduto(true);
      try {
        const resultado = await criarProduto(nomeProdutoFormatado);
        if (resultado.success) {
          const produtoNovo = resultado.data?.data;
          produtoIdParaOrcamento = produtoNovo?.id || 0;

          setProdutosDisponiveis((prev) => {
            if (!prev.some((p) => p.id === produtoNovo.id)) {
              return [
                ...prev,
                { id: produtoNovo.id, nome: nomeProdutoFormatado },
              ];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
      } finally {
        setCadastrandoProduto(false);
      }
    }

    const novoProduto = {
      id: editandoProdutoId || Date.now() + Math.random(),
      nome: nomeProdutoFormatado,
      quantidade,
      preco,
      subTotal: subTotalCalculado,
      produto_id: produtoIdParaOrcamento,
      tipo: tipoItem,
      principalId: tipoItem === "subitem" ? itemPrincipalId : null,
      observacoes: "",
    };

    if (editandoProdutoId) {
      setProdutos(
        produtos.map((p) => (p.id === editandoProdutoId ? novoProduto : p)),
      );
      setEditandoProdutoId(null);
      setProdutoEmEdicao(null);
    } else {
      setProdutos((prev) => [...prev, novoProduto]);
    }

    // Limpar campos
    setProdutoNome("");
    setInputProduto("");
    setProdutoQuantidade("");
    setProdutoPrecoFormatado("");
    setProdutoSubTotalFormatado("");
    setTipoItem("normal");
    setItemPrincipalId("");
  };

  const editarProduto = (produto) => {
    setProdutoEmEdicao(produto);
    setEditandoProdutoId(produto.id);
    setProdutoNome(produto.nome);
    setProdutoQuantidade(produto.quantidade.toString());
    setProdutoPrecoFormatado(formatarValor(produto.preco));
    setProdutoSubTotalFormatado(formatarValor(produto.subTotal));
    setTipoItem(produto.tipo || "normal");
    setItemPrincipalId(produto.principalId || "");
  };

  const cancelarEdicao = () => {
    setEditandoProdutoId(null);
    setProdutoEmEdicao(null);
    setProdutoNome("");
    setInputProduto("");
    setProdutoQuantidade("");
    setProdutoPrecoFormatado("");
    setProdutoSubTotalFormatado("");
    setTipoItem("normal");
    setItemPrincipalId("");
  };

  const removerProduto = (id) => {
    const produto = produtos.find((p) => p.id === id);
    if (produto?.tipo === "principal") {
      // Remove principal e seus subitens
      setProdutos(produtos.filter((p) => p.id !== id && p.principalId !== id));
    } else {
      setProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const handleTelefoneClienteChange = (valor) => {
    const valorFormatado = mascaraTelefone(valor);
    setTelefoneClienteFormatado(valorFormatado);
    const telefoneLimpo = valorFormatado.replace(/\D/g, "");
    setTelefoneCliente(telefoneLimpo);
    validarCampo("telefoneCliente", telefoneLimpo);

    if (clienteExistente && valor !== clienteSelecionado?.telefone) {
      setClienteExistente(false);
      setClienteSelecionado(null);
      setClienteId(null);
    }
  };

  const handleNomeClienteChange = (valor) => {
    setNomeCliente(valor);
    validarCampo("nomeCliente", valor);

    if (clienteExistente && valor !== clienteSelecionado?.nome) {
      setClienteExistente(false);
      setClienteSelecionado(null);
      setClienteId(null);
    }
  };

  const handleTelefoneResponsavelChange = (valor) => {
    const valorFormatado = mascaraTelefone(valor);
    setTelefoneResponsavelFormatado(valorFormatado);
    setTelefoneResponsavel(valorFormatado.replace(/\D/g, ""));
  };

  const handleDescontoChange = (value) => {
    const valorFormatado = mascaraValorInput(value);
    setDescontoFormatado(valorFormatado);
    const valorNumerico = parseValor(valorFormatado);
    setDesconto(valorNumerico);
  };

  const handleImpostoChange = (value) => {
    const valorFormatado = mascaraValorInput(value);
    setImpostoFormatado(valorFormatado);
    const valorNumerico = parseValor(valorFormatado);
    setImposto(valorNumerico);
  };

  const handleFreteChange = (value) => {
    const valorFormatado = mascaraValorInput(value);
    setFreteFormatado(valorFormatado);
    const valorNumerico = parseValor(valorFormatado);
    setFrete(valorNumerico);
  };

  const handlePrecoChange = (value) => {
    const valorFormatado = mascaraValorInput(value);
    setProdutoPrecoFormatado(valorFormatado);
  };


  const handleClienteSelecionado = (event, value) => {
    if (value) {
      setClienteSelecionado(value);
      setClienteId(value.id);
      setNomeCliente(value.nome);
      setTelefoneCliente(value.telefone || "");
      setEnderecoCliente(value.endereco || "");
      setEmailCliente(value.email || "");
      setTelefoneClienteFormatado(mascaraTelefone(value.telefone || ""));
      setClienteExistente(true);
      validarCampo("nomeCliente", value.nome);
      validarCampo("telefoneCliente", value.telefone || "");
    } else {
      setClienteExistente(false);
      setNomeCliente("");
      setTelefoneCliente("");
      setTelefoneClienteFormatado("");
      validarCampo("nomeCliente", "");
      validarCampo("telefoneCliente", "");
    }
  };

  const handleProdutoSelecionado = (event, value) => {
    if (value) {
      setProdutoNome(typeof value === "string" ? value : value.nome);
    } else {
      setProdutoNome("");
    }
  };

  useEffect(() => {
    if (produtoQuantidade && produtoPrecoFormatado) {
      const quantidade = parseFloat(produtoQuantidade);
      const preco = parseValor(produtoPrecoFormatado);
      const subTotalCalculado = quantidade * preco;
      setProdutoSubTotal(subTotalCalculado);
      setProdutoSubTotalFormatado(formatarValor(subTotalCalculado));
    } else {
      setProdutoSubTotal(0);
      setProdutoSubTotalFormatado("");
    }
  }, [produtoQuantidade, produtoPrecoFormatado]);

  useEffect(() => {
    const novoSubTotal = produtos.reduce((total, produto) => {
      return total + (produto.subTotal || 0);
    }, 0);
    setSubTotalGeral(novoSubTotal);

    const descontoVal = parseValor(descontoFormatado) || 0;
    const impostoVal = parseValor(impostoFormatado) || 0;
    const freteVal = parseValor(freteFormatado) || 0;

    const totalCalculado = novoSubTotal - descontoVal + impostoVal + freteVal;
    setTotalGeral(totalCalculado);
  }, [produtos, descontoFormatado, impostoFormatado, freteFormatado]);

  const salvarEdicao = async () => {
    if (!validarFormulario()) {
      CustomToast({
        type: "warning",
        message: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const clienteIdParaOrcamento = await cadastrarClientePrimeiro();
    if (!clienteIdParaOrcamento) return;

    // SEPARAR ITENS PARA A NOVA ESTRUTURA
    const itensPrincipais = [];
    const itensAvulsos = [];

    produtos.forEach((prod) => {
      if (prod.tipo === "principal") {
        // Encontrar subitens deste principal
        const subitens = produtos
          .filter((p) => p.tipo === "subitem" && p.principalId === prod.id)
          .map((sub) => ({
            produto_id: sub.produto_id || null,
            produto_nome: sub.nome,
            quantidade: sub.quantidade,
            preco_unitario: sub.preco,
            subtotal: sub.subTotal,
            observacoes: sub.observacoes || null,
          }));

        itensPrincipais.push({
          id: prod.id,
          produto_id: prod.produto_id || null,
          produto_nome: prod.nome,
          quantidade: prod.quantidade,
          preco_unitario: prod.preco,
          subtotal: prod.subTotal,
          observacoes: prod.observacoes || null,
          subitens: subitens.length > 0 ? subitens : undefined,
        });
      } else if (prod.tipo === "normal") {
        itensAvulsos.push({
          produto_id: prod.produto_id || null,
          produto_nome: prod.nome,
          quantidade: prod.quantidade,
          preco_unitario: prod.preco,
          subtotal: prod.subTotal,
          observacoes: prod.observacoes || null,
        });
      }
    });

    const dadosOrcamentoAtualizado = {
      cliente_id: clienteIdParaOrcamento,
      categoria_id: categoriaSelecionada?.id || null,
      responsavel_nome: nomeResponsavel || "",
      responsavel_telefone: telefoneResponsavel || "",
      responsavel_email: emailResponsavel || "",
      validade: validade ? `${validade}T23:59:59` : "",
      observacoes: observacoesProdutos || "",
      forma_pagamento_tipo: tipoPagamento,
      prazo_entrega: prazoEntrega ? `${prazoEntrega}T18:00:00` : "",
      forma_pagamento_observacoes: observacoesPagamento || "",
      data_pagamento: dataPagamento ? `${dataPagamento}T12:00:00` : "",
      numero_conta: numeroConta || "",
      setor: setor || "",
      desconto: parseFloat(desconto) || 0,
      imposto: parseFloat(imposto) || 0,
      frete: parseFloat(frete) || 0,
      status: statusSelecionado || "pendente_ligacao",

      // NOVA ESTRUTURA
      itens_principais: itensPrincipais,
      itens_avulsos: itensAvulsos,
    };

    console.log(
      "📦 ENVIANDO PARA O BACKEND:",
      JSON.stringify(dadosOrcamentoAtualizado, null, 2),
    );

    setSalvandoOrcamento(true);
    try {
      const resultado = await editarOrcamento(
        dadosOrcamento.id,
        dadosOrcamentoAtualizado,
      );

      if (resultado.success) {
        CustomToast({
          type: "success",
          message: "Orçamento atualizado com sucesso!",
        });
        if (onSuccess) onSuccess();
        handleClose();
      } else {
        CustomToast({
          type: "error",
          message: resultado.message || "Erro ao atualizar orçamento",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      CustomToast({ type: "error", message: "Erro ao atualizar orçamento" });
    } finally {
      setSalvandoOrcamento(false);
    }
  };

  // Computed properties para UI
  const itensPrincipais = produtos.filter((p) => p.tipo === "principal");
  const itensNormais = produtos.filter((p) => p.tipo === "normal");

  const getSubItens = (principalId) => {
    return produtos.filter((p) => p.principalId === principalId);
  };

  const botaoHabilitado =
    validarFormulario() &&
    !loadingCadastroCliente &&
    !cadastrandoProduto &&
    !salvandoOrcamento;

  return (
    <ModalLateral
      open={open}
      tamanhoIcone={"4%"}
      width={"1200px"}
      handleClose={handleClose}
      tituloModal="Editar Orçamento"
      icon={<Edit />}
      tamanhoTitulo="70%"
      conteudo={
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">
              Erro ao carregar dados do orçamento
            </div>
          ) : (
            <div className="flex items-start gap-2 w-full flex-wrap">
              {/* Informações Gerais */}
              <div className=" flex gap-3 flex-wrap w-[50%] items-start">
                <div
                  className="flex flex-col w-full p-2"
                  style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
                >
                  <label className="text-sm font-bold flex items-center gap-2 text-black mb-2 pb-2">
                    <BookmarkAddedIcon style={{ color: "#a3cb39" }} />{" "}
                    Informações Gerais
                  </label>
                  <div className="flex w-full items-center gap-2 flex-wrap">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Número Orçamento"
                      value={numeroOrcamento}
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Article />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Setor"
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
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
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                      }}
                      onChange={(e) => {
                        setDataEmissao(e.target.value);
                        validarCampo("dataEmissao", e.target.value);
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
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                      }}
                      onChange={(e) => {
                        setValidade(e.target.value);
                        validarCampo("validade", e.target.value);
                      }}
                      required
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
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
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
                      <MenuItem value="em_orcamento">Em Orçamento</MenuItem>
                      <MenuItem value="producao">Produção</MenuItem>
                      <MenuItem value="entregue">Entregue</MenuItem>
                    </TextField>
                    <Autocomplete
                      size="small"
                      options={categorias}
                      loading={loadingCategoriasSearch || loadingCategorias}
                      getOptionLabel={(option) => option.nome || ""}
                      value={categoriaSelecionada}
                      onInputChange={(e, val) => setInputCategoria(val)}
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
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "32%" },
                      }}
                    />
                  </div>
                </div>

                {/* Dados do Cliente */}
                <div
                  className="flex flex-col w-full p-2"
                  style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
                >
                  <label className="text-sm font-bold flex items-center gap-2 mb-2 text-black pb-2">
                    <Person style={{ color: "#a3cb39" }} />
                    Dados do Cliente
                  </label>
                  <div className="flex w-full items-center gap-3 flex-wrap">
                    <Autocomplete
                      size="small"
                      options={clientesDisponiveis}
                      loading={loadingClientesSearch || loadingClientes}
                      getOptionLabel={(option) => option.nome || ""}
                      value={clienteSelecionado}
                      onInputChange={(e, val) => setInputCliente(val)}
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
                              {option.telefone}{" "}
                              {option.email && `• ${option.email}`}
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
                      helperText={
                        telefoneClienteErro ? "Telefone inválido" : ""
                      }
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "35%" },
                      }}
                      onChange={(e) =>
                        handleTelefoneClienteChange(e.target.value)
                      }
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

              {/* Responsável e Forma de Pagamento */}
              <div className=" flex gap-3 flex-wrap w-[49%] items-start">
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
                      onChange={(e) =>
                        handleTelefoneResponsavelChange(e.target.value)
                      }
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

                <div
                  className="flex flex-col w-full p-2"
                  style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
                >
                  <label className="text-sm font-bold flex items-center gap-2 text-black mb-2 pb-2">
                    <CurrencyExchange style={{ color: "#a3cb39" }} />
                    Forma de Pagamento
                  </label>
                  <div className="flex w-full items-center gap-3 flex-wrap">
                    <FormControl
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "48%" },
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
                        helperText={
                          tipoPagamentoErro ? "Campo obrigatório" : ""
                        }
                        onChange={(e) => {
                          setTipoPagamento(e.target.value);
                          validarCampo("tipoPagamento", e.target.value);
                        }}
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
                        <MenuItem value="cartao_credito">
                          Cartão de Crédito
                        </MenuItem>
                        <MenuItem value="cartao_debito">
                          Cartão de Débito
                        </MenuItem>
                        <MenuItem value="pix">PIX</MenuItem>
                        <MenuItem value="transferencia">Transferência</MenuItem>
                        <MenuItem value="deposito_bancario">
                          Depósito Bancário
                        </MenuItem>
                      </TextField>
                    </FormControl>

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="date"
                      label="Data Pagamento"
                      value={dataPagamento}
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "48%" },
                      }}
                      onChange={(e) => setDataPagamento(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {tipoPagamento === "deposito_bancario" && (
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Número da Conta"
                        value={numeroConta}
                        sx={{
                          width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
                        }}
                        onChange={(e) => setNumeroConta(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Article />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="date"
                      label="Prazo de Entrega"
                      value={prazoEntrega}
                      sx={{
                        width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
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

              {/* Produtos */}
              <div
                className="flex flex-col w-full p-2"
                style={{ border: "1px solid #a3cb39", borderRadius: "10px" }}
              >
                <label className="text-sm font-bold flex items-center gap-2 text-black mb-2 pb-2">
                  <ProductionQuantityLimits style={{ color: "#a3cb39" }} />{" "}
                  Produtos
                </label>

                {/* Seletor de tipo de item */}
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

                {/* Campos do produto */}
                <div className="flex w-full items-center gap-3 flex-wrap mb-3">
                  <Autocomplete
                    size="small"
                    options={produtosDisponiveis}
                    loading={loadingProdutosSearch || loadingProdutos}
                    getOptionLabel={(option) => (typeof option === "string" ? option : option.nome || "")}
                    value={produtoNome ? { nome: produtoNome } : null}
                    inputValue={inputProduto}
                    onChange={handleProdutoSelecionado}
                    freeSolo
                    onInputChange={(event, newInputValue) => {
                      setProdutoNome(newInputValue);
                      setInputProduto(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nome do Produto*"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Article />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "25%" },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Quantidade*"
                    type="number"
                    value={produtoQuantidade}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "15%" },
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
                    required
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Preço Unitário*"
                    value={produtoPrecoFormatado}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "20%" },
                    }}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    disabled={tipoItem === "subitem"} // ← ADICIONE ESTA LINHA
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchange />
                        </InputAdornment>
                      ),
                    }}
                    required={tipoItem !== "subitem"} // ← OPCIONAL: tira o required visual
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Sub Total"
                    value={produtoSubTotalFormatado}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "20%" },
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
                  <Tooltip
                    title={
                      cadastrandoProduto
                        ? "Cadastrando produto..."
                        : editandoProdutoId
                          ? "Atualizar Produto"
                          : "Adicionar Produto"
                    }
                  >
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
                        ) : editandoProdutoId ? (
                          <Save fontSize="small" />
                        ) : (
                          <AddCircle fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                  {editandoProdutoId && (
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
                </div>

                {/* Lista de produtos */}
                <div className="w-full mt-3">
                  {produtos.length === 0 ? (
                    <Paper
                      sx={{ p: 3, textAlign: "center", bgcolor: "#fff9c4" }}
                    >
                      <Typography color="textSecondary">
                        Adicione pelo menos um produto para continuar
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper
                      variant="outlined"
                      sx={{ borderRadius: 2, overflow: "hidden" }}
                    >
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <SubdirectoryArrowRight
                                    sx={{ color: "#757575" }}
                                  />
                                  <Typography fontWeight="bold">
                                    📌 {item.nome}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Chip
                                    label={`Qtd: ${item.quantidade}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Typography variant="body2">
                                    R$ {formatarValor(item.preco)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                  >
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
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      ↳
                                    </Typography>
                                    <Typography variant="body2">
                                      {subItem.nome}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
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
                                        onClick={() =>
                                          removerProduto(subItem.id)
                                        }
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

                      {/* Itens Normais (Avulsos) */}
                      {itensNormais.length > 0 && (
                        <>
                          <Box sx={{ bgcolor: "#e0e0e0", p: 1.5 }}>
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
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography>•</Typography>
                                <Typography>{item.nome}</Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
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
                  )}
                </div>

                {/* Totais */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Subtotal"
                      value={`R$ ${formatarValor(subTotalGeral)}`}
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
                      onChange={(e) => handleDescontoChange(e.target.value)}
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
                      onChange={(e) => handleImpostoChange(e.target.value)}
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
                      onChange={(e) => handleFreteChange(e.target.value)}
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
                      value={`R$ ${formatarValor(totalGeral)}`}
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
              </div>

              {/* Botão Salvar */}
              <div className="flex w-[100%] items-center gap-2 justify-end mt-4">
                <ButtonComponent
                  startIcon={
                    salvandoOrcamento ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Save fontSize="small" />
                    )
                  }
                  title={salvandoOrcamento ? "Salvando..." : "Salvar"}
                  subtitle={salvandoOrcamento ? "Salvando..." : "Salvar"}
                  onClick={salvarEdicao}
                  buttonSize="large"
                  disabled={!botaoHabilitado}
                />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};

export default EditarOrcamento;
