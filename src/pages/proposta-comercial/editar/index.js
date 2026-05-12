import React, { useState, useRef, useEffect, useCallback } from "react";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";
import {
  AddCircle,
  Delete,
  Edit,
  Save,
  Cancel,
  Download,
  Add,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
  Article,
  Person,
  Category,
  WhatsApp,
  LocationCity,
  Email,
} from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import ImagemCabecalho from "../../../assets/png/cabecalho.png";
import ImagemRodape from "../../../assets/png/rodape.png";
import ImagemFundo from "../../../assets/png/logo-m.png";
import {
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  AppBar,
  Toolbar,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  LinearProgress,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import html2pdf from "html2pdf.js";
import "./editar.css";
import { buscarCartegoria } from "../../../services/get/categoria";
import { buscarClientes } from "../../../services/get/cliente";

import htmlToEditorState from "../../../utils/htmlToEditorState";
import editorStateToHtml from "../../../utils/editorStateToHtml";
import conteudoPredefinido from "../../../utils/conteudoPredefinido";

import CustomToast from "../../../components/toast";
import { criarCliente } from "../../../services/post/cliente";
import { buscarPropostaId } from "../../../services/get/proposta-id";
import { atualizarProposta } from "../../../services/put/proposta";

const EditarPropostaComercial = ({
  propostaId,
  modoEdicao = false,
  onClose,
  open,
  onSaveSuccess,
}) => {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState("pendente");
  const [observacoes, setObservacoes] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [modoCadastroCliente, setModoCadastroCliente] = useState(false);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [paginas, setPaginas] = useState(() => []);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16px");
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);
  const [currentAlignment, setCurrentAlignment] = useState("left");
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(false);
  const editorRef = useRef(null);
  const MAX_CHARACTERS_PER_PAGE = 3500;
  const [characterCount, setCharacterCount] = useState(0);

  const statusOptions = [
    { value: "pendente", label: "Pendente" },
    { value: "aprovado", label: "Aprovado" },
    { value: "cancelado", label: "Cancelado" },
  ];

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    if (open) {
      if (modoEdicao && propostaId) {
        carregarTodosDados();
      } else {
        carregarClientes();
        buscarCategorias();
        setPaginas(() =>
          conteudoPredefinido.map((pagina) => ({
            ...pagina,
            editorState: htmlToEditorState(pagina.html),
            editando: false,
          })),
        );
        limparFormulario();
      }
    }
  }, [open]);

  useEffect(() => {
    if (paginas.length > 0 && paginaAtual < paginas.length) {
      const editorState = paginas[paginaAtual]?.editorState;
      if (editorState) {
        const contentState = editorState.getCurrentContent();
        const plainText = contentState.getPlainText();
        setCharacterCount(plainText.length);

        const selection = editorState.getSelection();
        if (selection.isCollapsed()) {
          const blockKey = selection.getStartKey();
          const block = contentState.getBlockForKey(blockKey);
          const alignment = block.getData().get("textAlign") || "left";
          setCurrentAlignment(alignment);
        }
      }
    }
  }, [paginaAtual, paginas]);

  useEffect(() => {
    if (paginas.length > 0) {
      focusEditor();
    }
  }, [paginas.length]);

  const carregarTodosDados = async () => {
    setLoadingDados(true);
    try {
      await Promise.all([carregarClientes(), buscarCategorias()]);

      await carregarDadosProposta();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      CustomToast({
        type: "error",
        message: "Erro ao carregar dados. Tente novamente.",
      });
    } finally {
      setLoadingDados(false);
    }
  };

  const carregarDadosProposta = useCallback(async () => {
    if (!propostaId) return;

    try {
      const response = await buscarPropostaId(propostaId);

      if (response.data) {
        const proposta = response.data;

        setNome(proposta.nome || "");
        setCliente(proposta.clienteId?.toString() || "");
        setCategoria(proposta.categoriaId?.toString() || "");
        setStatus(proposta.statusProposta || "pendente");
        setObservacoes(proposta.observacoes || "");

        if (proposta.cliente) {
          setNomeCliente(proposta.cliente.nome || "");
          setTelefone(proposta.cliente.telefone || "");
          setEmailCliente(proposta.cliente.email || "");
          setEndereco(proposta.cliente.endereco || "");
        }

        if (proposta.paginas && proposta.paginas.length > 0) {
          const novasPaginas = proposta.paginas.map((pagina, index) => ({
            id: index,
            titulo: pagina.titulo || `Página ${index + 1}`,
            html: pagina.conteudo || "<div><br></div>",
            editorState: htmlToEditorState(
              pagina.conteudo || "<div><br></div>",
            ),
            editando: false,
          }));
          setPaginas(novasPaginas);
        } else {
          const paginasPadrao = conteudoPredefinido.map((pagina) => ({
            ...pagina,
            editorState: htmlToEditorState(pagina.html),
            editando: false,
          }));
          setPaginas(paginasPadrao);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar proposta:", error);
      CustomToast({
        type: "error",
        message: "Erro ao carregar dados da proposta",
      });
    }
  }, [propostaId]);
  const carregarClientes = async () => {
    try {
      const response = await buscarClientes();
      if (response.success) {
        const clientesArray = response.data.data || response.data || [];
        setClientesDisponiveis(clientesArray);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      CustomToast({
        type: "error",
        message: "Erro ao carregar clientes. Por favor, tente novamente.",
      });
    }
  };

  const buscarCategorias = async () => {
    try {
      const response = await buscarCartegoria();
      if (response.success) {
        const categoriasArray = response.data.data || response.data || [];
        setCategorias(categoriasArray);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    if (cliente && clientesDisponiveis.length > 0) {
      const clienteSelecionado = clientesDisponiveis.find(
        (c) => c.id.toString() === cliente.toString(),
      );
      if (clienteSelecionado) {
        setNomeCliente(clienteSelecionado.nome || "");
        setTelefone(clienteSelecionado.telefone || "");
        setEmailCliente(clienteSelecionado.email || "");
        setEndereco(clienteSelecionado.endereco || "");
      }
    } else if (!cliente) {
      setNomeCliente("");
      setTelefone("");
      setEmailCliente("");
      setEndereco("");
    }
  }, [cliente, clientesDisponiveis]);

  const salvarConteudoPagina = useCallback(
    (editorState) => {
      setPaginas((prevPaginas) => {
        const novasPaginas = [...prevPaginas];
        if (novasPaginas[paginaAtual]) {
          novasPaginas[paginaAtual] = {
            ...novasPaginas[paginaAtual],
            editorState: editorState,
            html: editorStateToHtml(editorState),
          };
        }
        return novasPaginas;
      });
    },
    [paginaAtual],
  );

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();

    if (plainText.length + chars.length > MAX_CHARACTERS_PER_PAGE) {
      CustomToast({
        type: "warning",
        message: `Limite de ${MAX_CHARACTERS_PER_PAGE} caracteres atingido!`,
      });
      return "handled";
    }
    return "not-handled";
  };

  const handleEditorChange = useCallback(
    (editorState) => {
      const contentState = editorState.getCurrentContent();
      const plainText = contentState.getPlainText();
      const currentCount = plainText.length;

      if (currentCount > MAX_CHARACTERS_PER_PAGE) {
        return;
      }

      setCharacterCount(currentCount);

      salvarConteudoPagina(editorState);

      const selection = editorState.getSelection();
      if (selection.isCollapsed()) {
        const blockKey = selection.getStartKey();
        const block = contentState.getBlockForKey(blockKey);
        const alignment = block.getData().get("textAlign") || "left";
        setCurrentAlignment(alignment);
      }
    },
    [salvarConteudoPagina, MAX_CHARACTERS_PER_PAGE],
  );

  const handleKeyCommand = (command, editorState) => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();

    if (
      plainText.length >= MAX_CHARACTERS_PER_PAGE &&
      (command === "backspace" ||
        command === "delete" ||
        command.includes("delete") ||
        command.includes("backspace"))
    ) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        handleEditorChange(newState);
        return "handled";
      }
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      const newContentState = newState.getCurrentContent();
      const newPlainText = newContentState.getPlainText();

      if (newPlainText.length <= MAX_CHARACTERS_PER_PAGE) {
        handleEditorChange(newState);
        return "handled";
      } else {
        return "handled";
      }
    }

    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    if (!paginas[paginaAtual]?.editorState) return;

    const editorState = paginas[paginaAtual].editorState;
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    handleEditorChange(newState);
  };

  const toggleBlockType = (blockType) => {
    if (!paginas[paginaAtual]?.editorState) return;

    const editorState = paginas[paginaAtual].editorState;
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    handleEditorChange(newState);
  };

  const getCurrentBlockType = () => {
    if (!paginas[paginaAtual]?.editorState) return "unstyled";

    const editorState = paginas[paginaAtual].editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());
    return block.getType();
  };

  const getCurrentInlineStyle = () => {
    if (!paginas[paginaAtual]?.editorState) return new Set();

    const editorState = paginas[paginaAtual].editorState;
    return editorState.getCurrentInlineStyle();
  };

  const aplicarAlinhamento = (align) => {
    if (!paginas[paginaAtual]?.editorState) return;

    const editorState = paginas[paginaAtual].editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (selection.isCollapsed()) {
      const blockKey = selection.getStartKey();
      const block = contentState.getBlockForKey(blockKey);

      const blockData = block.getData().merge({ textAlign: align });
      const newContentState = Modifier.setBlockData(
        contentState,
        selection,
        blockData,
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data",
      );

      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        newEditorState.getSelection(),
      );

      handleEditorChange(finalEditorState);
    } else {
      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      let newContentState = contentState;
      let currentKey = startKey;

      while (currentKey) {
        const block = contentState.getBlockForKey(currentKey);
        const blockSelection = selection.merge({
          anchorKey: currentKey,
          focusKey: currentKey,
          anchorOffset: 0,
          focusOffset: block.getLength(),
        });

        const blockData = block.getData().merge({ textAlign: align });
        newContentState = Modifier.setBlockData(
          newContentState,
          blockSelection,
          blockData,
        );

        if (currentKey === endKey) break;
        currentKey = contentState.getKeyAfter(currentKey);
      }

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data",
      );

      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        selection,
      );

      handleEditorChange(finalEditorState);
    }

    setCurrentAlignment(align);
  };

  const blockStyleFn = (contentBlock) => {
    const blockData = contentBlock.getData();
    const textAlign = blockData.get("textAlign") || "left";

    if (textAlign === "center") {
      return "block-align-center";
    } else if (textAlign === "right") {
      return "block-align-right";
    } else if (textAlign === "justify") {
      return "block-align-justify";
    }
    return "block-align-left";
  };

  const blockRendererFn = (contentBlock) => {
    const blockData = contentBlock.getData();
    const textAlign = blockData.get("textAlign");

    if (textAlign) {
      return {
        props: {
          style: { textAlign, direction: "ltr" },
        },
      };
    }
    return null;
  };

  const handleFechar = () => {
    limparFormulario();
    if (onClose) {
      onClose();
    }
  };

  const limparFormulario = () => {
    setNome("");
    setCliente("");
    setCategoria("");
    setStatus("pendente");
    setObservacoes("");
    setTelefone("");
    setNomeCliente("");
    setEmailCliente("");
    setEndereco("");
    setModoCadastroCliente(false);
    setPaginaAtual(0);
    if (!modoEdicao) {
      setPaginas(() =>
        conteudoPredefinido.map((pagina) => ({
          ...pagina,
          editorState: htmlToEditorState(pagina.html),
          editando: false,
        })),
      );
    }
  };

  const cadastrarNovoCliente = async () => {
    if (!nomeCliente || !telefone || !emailCliente || !endereco) {
      CustomToast({
        type: "warning",
        message: "Por favor, preencha todos os campos do cliente!",
      });
      return;
    }

    try {
      const response = await criarCliente(
        nomeCliente,
        telefone,
        emailCliente,
        endereco,
      );

      if (response.success) {
        CustomToast({
          type: "success",
          message: "Cliente cadastrado com sucesso!",
        });

        await carregarClientes();

        const clienteRecente = response.data || response;
        if (clienteRecente && clienteRecente.id) {
          setCliente(clienteRecente.id.toString());

          if (clienteRecente.nome) setNomeCliente(clienteRecente.nome);
          if (clienteRecente.telefone) setTelefone(clienteRecente.telefone);
          if (clienteRecente.email) setEmailCliente(clienteRecente.email);
          if (clienteRecente.endereco) setEndereco(clienteRecente.endereco);
        }

        setModoCadastroCliente(false);
      } else {
        CustomToast({
          type: "error",
          message: `Erro ao cadastrar cliente: ${response.error || "Erro desconhecido"}`,
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      CustomToast({
        type: "error",
        message: "Erro ao cadastrar cliente. Por favor, tente novamente.",
      });
    }
  };

  const handleSalvarProposta = async () => {
    if (!nome || !cliente || !categoria) {
      CustomToast({
        type: "warning",
        message: "Por favor, preencha todos os campos obrigatórios!",
      });
      return;
    }

    setLoading(true);
    try {
      const paginasFormatadas = paginas.map((pagina) => ({
        titulo: pagina.titulo || `Página ${paginas.indexOf(pagina) + 1}`,
        conteudo: editorStateToHtml(pagina.editorState),
      }));

      const dadosProposta = {
        nome,
        clienteId: parseInt(cliente),
        categoriaId: parseInt(categoria),
        statusProposta: status,
        observacoes,
        paginas: paginasFormatadas,
      };

      let response;

      if (modoEdicao && propostaId) {
        response = await atualizarProposta(propostaId, dadosProposta);

        if (response && (response.success === true || response.message)) {
          CustomToast({
            type: "success",
            message: response.message || "Proposta atualizada com sucesso!",
          });

          if (onSaveSuccess) {
            onSaveSuccess();
          }

          handleFechar();
        } else {
          const errorMessage =
            response?.error ||
            response?.data?.error?.message ||
            response?.message ||
            "Erro ao salvar proposta";

          CustomToast({
            type: "error",
            message: errorMessage,
          });
        }
      } else {
        CustomToast({
          type: "info",
          message: "Funcionalidade de criação ainda não implementada",
        });
        return;
      }
    } catch (error) {
      console.error("Erro completo ao salvar proposta:", error);

      let errorMessage = "Erro ao salvar proposta. Por favor, tente novamente.";

      if (error.response) {
        const serverError = error.response.data;

        errorMessage =
          serverError?.error?.message ||
          serverError?.message ||
          "Erro no servidor ao salvar proposta";
      } else if (error.request) {
        errorMessage =
          "Erro de conexão. Verifique sua internet e tente novamente.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      CustomToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarPagina = () => {
    const novaPagina = {
      id: Date.now(),
      titulo: `Página ${paginas.length + 1}`,
      html: "<div><br></div>",
      editorState: EditorState.createEmpty(),
      editando: false,
    };
    setPaginas([...paginas, novaPagina]);
    setPaginaAtual(paginas.length);
    setCharacterCount(0);
  };

  const removerPagina = (index) => {
    if (paginas.length <= 1) {
      CustomToast({
        type: "warning",
        message: "Deve haver pelo menos uma página!",
      });
      return;
    }

    const novasPaginas = paginas.filter((_, i) => i !== index);
    setPaginas(novasPaginas);

    if (paginaAtual >= novasPaginas.length) {
      setPaginaAtual(novasPaginas.length - 1);
    }
    setConfirmacaoExclusao(null);
  };

  const salvarTitulo = (index, novoTitulo) => {
    const novasPaginas = [...paginas];
    if (novasPaginas[index]) {
      novasPaginas[index] = {
        ...novasPaginas[index],
        titulo: novoTitulo || `Página ${index + 1}`,
        editando: false,
      };
      setPaginas(novasPaginas);
    }
  };

  const cancelarEdicaoTitulo = (index) => {
    const novasPaginas = [...paginas];
    if (novasPaginas[index]) {
      novasPaginas[index] = { ...novasPaginas[index], editando: false };
      setPaginas(novasPaginas);
    }
  };

  const handleDownload = () => {
    const hasContent = paginas.some((pagina) => {
      const contentState = pagina.editorState?.getCurrentContent();
      return (
        contentState?.hasText() ||
        (pagina.html && pagina.html.trim() !== "<div><br></div>")
      );
    });

    if (!hasContent) {
      CustomToast({
        type: "warning",
        message: "Adicione conteúdo antes de gerar o PDF!",
      });
      return;
    }

    const container = document.createElement("div");
    container.style.cssText = `
      font-family: ${fontFamily};
      font-size: ${fontSize};
      line-height: 1.4 !important;
      direction: ltr;
      text-align: left;
      margin: 0;
      padding: 0;
      width: 210mm;
    `;

    paginas.forEach((pagina, index) => {
      const paginaDiv = document.createElement("div");
      paginaDiv.className = "pagina-a4-pdf";
      paginaDiv.style.cssText = `
        width: 210mm !important;
        height: 297mm !important;
        background: white;
        position: relative;
        margin: 0 auto;
        page-break-inside: avoid;
        page-break-after: ${index < paginas.length - 1 ? "always" : "avoid"};
        direction: ltr;
        text-align: left;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      `;

      const cabecalho = document.createElement("div");
      cabecalho.innerHTML = `<img src="${ImagemCabecalho}" alt="Cabeçalho" style="width:100%; height: auto;" />`;
      cabecalho.style.cssText = `
        width: 100%;
        height: 60px;
        flex-shrink: 0;
        margin: 0;
        padding: 0;
      `;

      const conteudoContainer = document.createElement("div");
      conteudoContainer.style.cssText = `
        flex: 1;
        position: relative;
        margin: 0;
        padding: 15px 60px !important;
        min-height: calc(297mm - 100px);
        overflow: visible;
        z-index: 2;
      `;

      const fundo = document.createElement("div");
      fundo.innerHTML = `<img src="${ImagemFundo}" alt="Logo" style="width:50%; max-width:200px; opacity:0.15; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />`;
      fundo.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
      `;

      const conteudo = document.createElement("div");
      conteudo.innerHTML = pagina.html || '<div style="height: 20px;"></div>';
      conteudo.style.cssText = `
        position: relative;
        z-index: 3;
        margin-top: 100px !important;
        direction: ltr;
        text-align: left;
        line-height: 1.4 !important;
        font-family: ${fontFamily} !important;
        font-size: ${fontSize} !important;
        color: #000 !important;
        min-height: 50px;
        padding: 0 20px !important;
      `;

      const rodape = document.createElement("div");
      rodape.innerHTML = `<img src="${ImagemRodape}" alt="Rodapé" style="width:12%; height: auto; margin-top: -100px;" />`;
      rodape.style.cssText = `
        width: 100%;
        height: 40px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justifyContent: center;
        padding: 0;
      `;

      conteudoContainer.appendChild(fundo);
      conteudoContainer.appendChild(conteudo);

      paginaDiv.appendChild(cabecalho);
      paginaDiv.appendChild(conteudoContainer);
      paginaDiv.appendChild(rodape);
      container.appendChild(paginaDiv);
    });

    const options = {
      margin: [0, 0, 0, 0],
      filename: `proposta-comercial-${new Date().toISOString().split("T")[0]}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        windowWidth: 794,
        windowHeight: 1123,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
        hotfixes: ["px_scaling"],
      },
    };

    setTimeout(() => {
      html2pdf()
        .set(options)
        .from(container)
        .save()
        .then(() => {
          CustomToast({
            type: "success",
            message: "PDF gerado com sucesso!",
          });
        })
        .catch((error) => {
          console.error("Erro ao gerar PDF:", error);
          CustomToast({
            type: "error",
            message: "Erro ao gerar PDF. Por favor, tente novamente.",
          });
        });
    }, 1000);
  };

  const renderizarPrevisualizacao = () => {
    if (paginas.length === 0) {
      return <div className="text-center py-8">Carregando páginas...</div>;
    }

    return paginas.map((pagina, index) => (
      <div
        key={pagina.id || index}
        className={`pagina-a4 relative mb-8 ${
          index === paginaAtual ? "border-2 border-blue-500" : ""
        }`}
        onClick={() => setPaginaAtual(index)}
        style={{
          cursor: "pointer",
          opacity: index === paginaAtual ? 1 : 0.8,
          direction: "ltr",
        }}
      >
        <div className="absolute top-0 left-0 w-full z-0">
          <img src={ImagemCabecalho} alt="Cabeçalho" className="w-full" />
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-full flex justify-center opacity-20">
          <img src={ImagemFundo} alt="Logo" className="w-[70%] max-w-xs" />
        </div>

        <div
          className="relative z-10 pt-20 pb-20 h-full mt-4"
          style={{ direction: "ltr", padding: "0 40px" }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: pagina.html || "<div><br></div>",
            }}
            style={{
              fontFamily: fontFamily,
              fontSize: fontSize,
              direction: "ltr",
              id: `preview-content-${index}`,
              marginTop: "100px",
            }}
          />
        </div>
      </div>
    ));
  };

  if (loadingDados && modoEdicao) {
    return (
      <CentralModal
        tamanhoTitulo={"81%"}
        maxHeight={"90vh"}
        width={"1300px"}
        icon={<AddCircle fontSize="small" />}
        open={open}
        onClose={handleFechar}
        title="Carregando Proposta..."
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      </CentralModal>
    );
  }

  return (
    <CentralModal
      tamanhoTitulo={"81%"}
      maxHeight={"90vh"}
      width={"1300px"}
      icon={<AddCircle fontSize="small" />}
      open={open}
      onClose={handleFechar}
      title={
        modoEdicao ? "Editar Proposta Comercial" : "Cadastro Proposta Comercial"
      }
    >
      <div className="flex flex-col gap-4 w-full" style={{ direction: "ltr" }}>
        <div className="flex items-center flex-wrap gap-3 mb-4 mt-2">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Nome da Proposta"
            autoComplete="off"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            sx={{
              width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
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
            label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            select
            sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "15%" } }}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">
              <em>Selecione uma categoria</em>
            </MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id.toString()}>
                {" "}
                {/* Use toString() aqui também */}
                {cat.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            select
            sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "15%" } }}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Article />
                </InputAdornment>
              ),
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <div className="flex items-center flex-wrap gap-3 w-[100%]">
            <div className="flex items-center justify-between w-full">
              <label className="flex items-center gap-2 font-bold">
                <Person fontSize="small" style={{ color: "#a3cb39" }} />{" "}
                Informações do Cliente
              </label>

              {!modoCadastroCliente && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setModoCadastroCliente(true)}
                  sx={{ ml: 2 }}
                >
                  Novo Cliente
                </Button>
              )}
            </div>

            {modoCadastroCliente ? (
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                }}
              >
                <label className="flex items-center gap-2 font-bold">
                  <Person fontSize="small" style={{ color: "#a3cb39" }} />
                  Cadastrar Novo Cliente
                </label>

                <div className="flex flex-wrap gap-3 w-full">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Nome do Cliente *"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    autoComplete="off"
                    sx={{
                      width: { xs: "100%", sm: "48%", md: "30%", lg: "30%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="E-mail *"
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    autoComplete="off"
                    sx={{
                      width: { xs: "100%", sm: "48%", md: "30%", lg: "30%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    label="WhatsApp/Telefone *"
                    autoComplete="off"
                    sx={{
                      width: { xs: "100%", sm: "48%", md: "30%", lg: "30%" },
                    }}
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
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    size="small"
                    label="Endereço *"
                    autoComplete="off"
                    sx={{
                      width: { xs: "100%", sm: "48%", md: "30%", lg: "30%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <div className="flex gap-2 w-full mt-2">
                    <Button
                      variant="contained"
                      onClick={cadastrarNovoCliente}
                      color="primary"
                      startIcon={<Save />}
                    >
                      Salvar Cliente
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        setModoCadastroCliente(false);
                        setNomeCliente("");
                        setEmailCliente("");
                        setTelefone("");
                        setEndereco("");
                      }}
                      color="secondary"
                      startIcon={<Cancel />}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Box>
            ) : (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Cliente *"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  autoComplete="off"
                  select
                  sx={{
                    width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um cliente</em>
                  </MenuItem>
                  {clientesDisponiveis.map((cli) => (
                    <MenuItem key={cli.id} value={cli.id.toString()}>
                      {" "}
                      {/* Use toString() */}
                      {cli.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Nome do Cliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  autoComplete="off"
                  disabled
                  sx={{
                    width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="E-mail"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  autoComplete="off"
                  disabled
                  sx={{
                    width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  label="WhatsApp/Telefone"
                  autoComplete="off"
                  disabled
                  sx={{
                    width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                  }}
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
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  size="small"
                  label="Endereço"
                  autoComplete="off"
                  disabled
                  sx={{
                    width: { xs: "72%", sm: "50%", md: "40%", lg: "30%" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </div>

          {/* Campo de observações */}
          <div className="flex items-center flex-wrap gap-3 w-[100%] mt-4">
            <label className="flex items-center w-full gap-2 font-bold">
              <Article fontSize="small" style={{ color: "#a3cb39" }} />{" "}
              Observações
            </label>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={3}
              label="Observações"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              autoComplete="off"
              sx={{
                width: "100%",
              }}
              placeholder="Digite observações adicionais sobre a proposta..."
            />
          </div>
        </div>

        {/* Botão para adicionar página */}
        <div className="flex justify-end mb-4">
          <ButtonComponent
            startIcon={<AddCircle fontSize="small" />}
            title={"Adicionar Página"}
            subtitle={"Adicionar Página"}
            buttonSize="large"
            onClick={adicionarPagina}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {paginas.map((pagina, index) => (
            <div key={pagina.id || index} className="flex items-center gap-1">
              {pagina.editando ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    defaultValue={pagina.titulo}
                    onBlur={(e) => {
                      salvarTitulo(index, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        salvarTitulo(index, e.target.value);
                      }
                      if (e.key === "Escape") {
                        cancelarEdicaoTitulo(index);
                      }
                    }}
                    className="border rounded px-2 py-1 text-sm w-32"
                    autoFocus
                    style={{ direction: "ltr" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const input = document.querySelector(
                        `input[data-index="${index}"]`,
                      );
                      if (input) {
                        salvarTitulo(index, input.value);
                      }
                    }}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => cancelarEdicaoTitulo(index)}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Chip
                    label={pagina.titulo}
                    color={index === paginaAtual ? "primary" : "default"}
                    onClick={() => {
                      const paginasComEdicao = paginas.map((p, i) =>
                        i !== index && p.editando
                          ? { ...p, editando: false }
                          : p,
                      );
                      if (paginas.some((p, i) => i !== index && p.editando)) {
                        setPaginas(paginasComEdicao);
                      }
                      setPaginaAtual(index);
                    }}
                    variant={index === paginaAtual ? "filled" : "outlined"}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const novasPaginas = paginas.map((p, i) =>
                        i !== index ? { ...p, editando: false } : p,
                      );
                      novasPaginas[index] = {
                        ...novasPaginas[index],
                        editando: true,
                      };
                      setPaginas(novasPaginas);
                    }}
                    title="Editar título"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setConfirmacaoExclusao(index)}
                    title="Excluir página"
                    disabled={paginas.length <= 1}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-start w-full gap-3">
          <div className="border rounded-lg p-4 w-[48%] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Editor -{" "}
                {paginas[paginaAtual]?.titulo || `Página ${paginaAtual + 1}`}
              </h3>
            </div>

            <AppBar
              position="static"
              color="default"
              elevation={1}
              sx={{ mb: 2, direction: "ltr" }}
            >
              <Toolbar variant="dense">
                <ToggleButtonGroup size="small" exclusive sx={{ mr: 1 }}>
                  <ToggleButton
                    value="bold"
                    selected={getCurrentInlineStyle().has("BOLD")}
                    onClick={() => toggleInlineStyle("BOLD")}
                  >
                    <FormatBold />
                  </ToggleButton>
                  <ToggleButton
                    value="italic"
                    selected={getCurrentInlineStyle().has("ITALIC")}
                    onClick={() => toggleInlineStyle("ITALIC")}
                  >
                    <FormatItalic />
                  </ToggleButton>
                  <ToggleButton
                    value="underline"
                    selected={getCurrentInlineStyle().has("UNDERLINE")}
                    onClick={() => toggleInlineStyle("UNDERLINE")}
                  >
                    <FormatUnderlined />
                  </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                  size="small"
                  exclusive
                  sx={{ mr: 1 }}
                  value={currentAlignment}
                >
                  <ToggleButton
                    value="left"
                    selected={currentAlignment === "left"}
                    onClick={() => aplicarAlinhamento("left")}
                  >
                    <FormatAlignLeft />
                  </ToggleButton>
                  <ToggleButton
                    value="center"
                    selected={currentAlignment === "center"}
                    onClick={() => aplicarAlinhamento("center")}
                  >
                    <FormatAlignCenter />
                  </ToggleButton>
                  <ToggleButton
                    value="right"
                    selected={currentAlignment === "right"}
                    onClick={() => aplicarAlinhamento("right")}
                  >
                    <FormatAlignRight />
                  </ToggleButton>
                  <ToggleButton
                    value="justify"
                    selected={currentAlignment === "justify"}
                    onClick={() => aplicarAlinhamento("justify")}
                  >
                    <FormatAlignJustify />
                  </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                  size="small"
                  exclusive
                  sx={{ mr: 1 }}
                  value={getCurrentBlockType()}
                >
                  <ToggleButton
                    value="unordered-list-item"
                    selected={getCurrentBlockType() === "unordered-list-item"}
                    onClick={() => {
                      const currentType = getCurrentBlockType();
                      if (currentType === "unordered-list-item") {
                        toggleBlockType("unstyled");
                      } else {
                        toggleBlockType("unordered-list-item");
                      }
                    }}
                  >
                    <FormatListBulleted />
                  </ToggleButton>
                  <ToggleButton
                    value="ordered-list-item"
                    selected={getCurrentBlockType() === "ordered-list-item"}
                    onClick={() => {
                      const currentType = getCurrentBlockType();
                      if (currentType === "ordered-list-item") {
                        toggleBlockType("unstyled");
                      } else {
                        toggleBlockType("ordered-list-item");
                      }
                    }}
                  >
                    <FormatListNumbered />
                  </ToggleButton>
                </ToggleButtonGroup>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: "16px",
                  }}
                >
                  <Chip
                    label={`${characterCount}/${MAX_CHARACTERS_PER_PAGE}`}
                    color={
                      characterCount >= MAX_CHARACTERS_PER_PAGE
                        ? "error"
                        : characterCount >= MAX_CHARACTERS_PER_PAGE * 0.8
                          ? "warning"
                          : "default"
                    }
                    variant="outlined"
                    size="small"
                  />
                </div>
              </Toolbar>
            </AppBar>

            <Paper
              elevation={2}
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                direction: "ltr",
                cursor: "text",
              }}
              onClick={focusEditor}
            >
              <div
                style={{
                  padding: "16px",
                  height: "500px",
                  overflow: "auto",
                  fontFamily: fontFamily,
                  fontSize: fontSize,
                  direction: "ltr",
                }}
              >
                <Editor
                  ref={editorRef}
                  editorState={
                    paginas[paginaAtual]?.editorState ||
                    EditorState.createEmpty()
                  }
                  onChange={handleEditorChange}
                  handleKeyCommand={handleKeyCommand}
                  handleBeforeInput={handleBeforeInput}
                  placeholder="Comece a digitar aqui..."
                  spellCheck={true}
                  stripPastedStyles={false}
                  blockStyleFn={blockStyleFn}
                  blockRendererFn={blockRendererFn}
                />
              </div>
            </Paper>

            <div style={{ marginTop: "16px" }}>
              <LinearProgress
                variant="determinate"
                value={(characterCount / MAX_CHARACTERS_PER_PAGE) * 100}
                color={
                  characterCount >= MAX_CHARACTERS_PER_PAGE
                    ? "error"
                    : characterCount >= MAX_CHARACTERS_PER_PAGE * 0.8
                      ? "warning"
                      : "primary"
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginTop: "4px",
                  color:
                    characterCount >= MAX_CHARACTERS_PER_PAGE
                      ? "red"
                      : "inherit",
                }}
              >
                <span>Caracteres: {characterCount}</span>
                <span>Limite: {MAX_CHARACTERS_PER_PAGE}</span>
              </div>

              {characterCount >= MAX_CHARACTERS_PER_PAGE && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Limite de {MAX_CHARACTERS_PER_PAGE} caracteres atingido!
                  Exclua algum texto para continuar editando.
                </Alert>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 w-[50%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pré-visualização</h3>
            </div>

            <div className="preview-container">
              <div className="paginas-container flex items-center justify-center w-full flex-col ">
                {renderizarPrevisualizacao()}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação no final do modal */}
        <div className="flex justify-end gap-3 mt-6">
          <ButtonComponent
            startIcon={<Download fontSize="small" />}
            title={"Gerar PDF"}
            subtitle={"Gerar PDF"}
            buttonSize="large"
            onClick={handleDownload}
          />
          <ButtonComponent
            startIcon={<Save fontSize="small" />}
            title={modoEdicao ? "Salvar Alterações" : "Cadastrar"}
            subtitle={modoEdicao ? "Salvar Alterações" : "Cadastrar"}
            buttonSize="large"
            onClick={handleSalvarProposta}
            loading={loading}
          />
        </div>
      </div>

      <Dialog
        open={confirmacaoExclusao !== null}
        onClose={() => setConfirmacaoExclusao(null)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir a página "
          {paginas[confirmacaoExclusao]?.titulo}"?
          {paginas.length <= 1 && (
            <p className="text-red-500 mt-2">
              Não é possível excluir a última página!
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmacaoExclusao(null)}>Cancelar</Button>
          <Button
            onClick={() => removerPagina(confirmacaoExclusao)}
            color="error"
            disabled={paginas.length <= 1}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </CentralModal>
  );
};

export default EditarPropostaComercial;
