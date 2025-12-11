import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Modifier,
} from "draft-js";
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
} from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import ImagemCabecalho from "../../../assets/png/cabecalho.png";
import ImagemRodape from "../../../assets/png/rodape.png";
import ImagemFundo from "../../../assets/png/logo-m.png";
import {
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
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
} from "@mui/material";
import html2pdf from "html2pdf.js";
import "./cadastrar.css";

const CadastroPropostaComercial = () => {
  const [cadastro, setCadastro] = useState(false);
  const [paginas, setPaginas] = useState([
    {
      id: 1,
      titulo: "Página 1",
      conteudo: EditorState.createEmpty(),
      editando: false,
      rawContent: null,
    },
  ]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("14px");
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);
  const [currentAlignment, setCurrentAlignment] = useState("left");
  const editorRef = useRef(null);
  const MAX_CHARACTERS_PER_PAGE = 3500;
  const [characterCount, setCharacterCount] = useState(0);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    if (paginas[paginaAtual]) {
      const contentState = paginas[paginaAtual].conteudo.getCurrentContent();
      const plainText = contentState.getPlainText();
      setCharacterCount(plainText.length);

      focusEditor();
      updateCurrentAlignment();
    }
  }, [paginaAtual]);

  const updateCurrentAlignment = () => {
    const editorState =
      paginas[paginaAtual]?.conteudo || EditorState.createEmpty();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (!selection.isCollapsed()) {
      setCurrentAlignment("left");
      return;
    }

    const blockKey = selection.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const alignment = block.getData().get("textAlign") || "left";
    setCurrentAlignment(alignment);
  };

  const convertEditorStateToHTML = (editorState) => {
    if (!editorState) return "";

    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    let html = "";
    let inList = false;
    let listType = "";

    blockMap.forEach((block) => {
      const textAlign = block.getData().get("textAlign") || "left";
      const blockType = block.getType();
      const text = block.getText();

      if (
        inList &&
        blockType !== "unordered-list-item" &&
        blockType !== "ordered-list-item"
      ) {
        html += listType === "unordered" ? "</ul>" : "</ol>";
        inList = false;
        listType = "";
      }

      const characterList = block.getCharacterList();
      let styledText = "";

      if (characterList && text.length > 0) {
        for (let i = 0; i < text.length; i++) {
          const char = characterList.get(i);
          if (!char) {
            styledText += text[i];
            continue;
          }

          const styles = char.getStyle();
          let charText = text[i];

          if (styles.has("UNDERLINE")) {
            charText = `<u>${charText}</u>`;
          }
          if (styles.has("ITALIC")) {
            charText = `<em>${charText}</em>`;
          }
          if (styles.has("BOLD")) {
            charText = `<strong>${charText}</strong>`;
          }

          styledText += charText;
        }
      } else {
        styledText = text;
      }

      if (styledText.trim() === "") {
        styledText = "<br>";
      }

      const styleAttr = `style="text-align: ${textAlign} !important; direction: ltr !important; margin: 4px 0 !important; padding: 0 !important; line-height: 1.4;"`;

      switch (blockType) {
        case "header-one":
          html += `<h1 ${styleAttr} style="font-size: 2em !important; font-weight: bold !important; margin: 12px 0 8px 0 !important;">${styledText}</h1>`;
          break;

        case "header-two":
          html += `<h2 ${styleAttr} style="font-size: 1.5em !important; font-weight: bold !important; margin: 10px 0 6px 0 !important;">${styledText}</h2>`;
          break;

        case "header-three":
          html += `<h3 ${styleAttr} style="font-size: 1.17em !important; font-weight: bold !important; margin: 8px 0 4px 0 !important;">${styledText}</h3>`;
          break;

        case "unordered-list-item":
          if (!inList) {
            html += `<ul style="text-align: ${textAlign} !important; margin: 8px 0 !important; padding-left: 24px !important; direction: ltr !important;">`;
            inList = true;
            listType = "unordered";
          }
          html += `<li style="text-align: ${textAlign} !important; direction: ltr !important; margin: 2px 0 !important; line-height: 1.4;">${styledText}</li>`;
          break;

        case "ordered-list-item":
          if (!inList) {
            html += `<ol style="text-align: ${textAlign} !important; margin: 8px 0 !important; padding-left: 24px !important; direction: ltr !important;">`;
            inList = true;
            listType = "ordered";
          }
          html += `<li style="text-align: ${textAlign} !important; direction: ltr !important; margin: 2px 0 !important; line-height: 1.4;">${styledText}</li>`;
          break;

        default:
          html += `<div ${styleAttr}>${styledText}</div>`;
          break;
      }
    });

    if (inList) {
      html += listType === "unordered" ? "</ul>" : "</ol>";
    }

    return html;
  };

  const salvarConteudoPagina = (editorState) => {
    const novasPaginas = [...paginas];
    novasPaginas[paginaAtual] = {
      ...novasPaginas[paginaAtual],
      conteudo: editorState,
      rawContent: convertToRaw(editorState.getCurrentContent()),
    };
    setPaginas(novasPaginas);
    updateCurrentAlignment();
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();

    if (plainText.length + chars.length > MAX_CHARACTERS_PER_PAGE) {
      alert(`Limite de ${MAX_CHARACTERS_PER_PAGE} caracteres atingido!`);
      return "handled";
    }
    return "not-handled";
  };

  const handleEditorChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const currentCount = plainText.length;

    if (currentCount > MAX_CHARACTERS_PER_PAGE) {
      return;
    }
    setCharacterCount(currentCount);
    salvarConteudoPagina(editorState);
  };

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
    const editorState =
      paginas[paginaAtual]?.conteudo || EditorState.createEmpty();
    const newState = RichUtils.toggleInlineStyle(editorState, style);
    handleEditorChange(newState);
  };

  const toggleBlockType = (blockType) => {
    const editorState =
      paginas[paginaAtual]?.conteudo || EditorState.createEmpty();
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    handleEditorChange(newState);
  };

  const aplicarAlinhamento = (align) => {
    const editorState =
      paginas[paginaAtual]?.conteudo || EditorState.createEmpty();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (selection.isCollapsed()) {
      const blockKey = selection.getStartKey();
      const block = contentState.getBlockForKey(blockKey);

      const blockData = block.getData().merge({ textAlign: align });
      const newContentState = Modifier.setBlockData(
        contentState,
        selection,
        blockData
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data"
      );

      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        newEditorState.getSelection()
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
          blockData
        );

        if (currentKey === endKey) break;
        currentKey = contentState.getKeyAfter(currentKey);
      }

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data"
      );

      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        selection
      );

      handleEditorChange(finalEditorState);
    }

    setCurrentAlignment(align);
  };

  const getCurrentInlineStyle = () => {
    const editorState =
      paginas[paginaAtual]?.conteudo || EditorState.createEmpty();
    return editorState.getCurrentInlineStyle();
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

  const ModalCadastro = () => {
    setCadastro(true);
  };

  const ModalFecha = () => {
    setCadastro(false);
  };

  const adicionarPagina = () => {
    const novaPagina = {
      id: Date.now(),
      titulo: `Página ${paginas.length + 1}`,
      conteudo: EditorState.createEmpty(),
      editando: false,
      rawContent: null,
    };
    setPaginas([...paginas, novaPagina]);
    setPaginaAtual(paginas.length);
    setCharacterCount(0);
  };

  const removerPagina = (index) => {
    if (paginas.length <= 1) {
      alert("Deve haver pelo menos uma página!");
      return;
    }

    const novasPaginas = paginas.filter((_, i) => i !== index);
    setPaginas(novasPaginas);

    if (paginaAtual >= novasPaginas.length) {
      setPaginaAtual(novasPaginas.length - 1);
    }
    setConfirmacaoExclusao(null);
  };

  const iniciarEdicaoTitulo = (index) => {
    const novasPaginas = [...paginas];
    novasPaginas[index] = { ...novasPaginas[index], editando: true };
    setPaginas(novasPaginas);
  };

  const salvarTitulo = (index, novoTitulo) => {
    const novasPaginas = [...paginas];
    novasPaginas[index] = {
      ...novasPaginas[index],
      titulo: novoTitulo || `Página ${index + 1}`,
      editando: false,
    };
    setPaginas(novasPaginas);
  };

  const cancelarEdicaoTitulo = (index) => {
    const novasPaginas = [...paginas];
    novasPaginas[index] = { ...novasPaginas[index], editando: false };
    setPaginas(novasPaginas);
  };

  const handleDownload = () => {
    const hasContent = paginas.some((pagina) => {
      const contentState = pagina.conteudo.getCurrentContent();
      return contentState.hasText() || contentState.getBlockMap().size > 1;
    });

    if (!hasContent) {
      alert("Adicione conteúdo antes de gerar o PDF!");
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
      padding: 15px 25px;
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
      const htmlContent = convertEditorStateToHTML(pagina.conteudo);
      conteudo.innerHTML = htmlContent || '<div style="height: 20px;"></div>';
      conteudo.style.cssText = `
      position: relative;
      z-index: 3;
      margin-top:70px;
      direction: ltr;
      text-align: left;
      line-height: 1.4 !important;
      font-family: ${fontFamily} !important;
      font-size: ${fontSize} !important;
      color: #000 !important;
      min-height: 50px;
    `;

      const rodape = document.createElement("div");
      rodape.innerHTML = `<img src="${ImagemRodape}" alt="Rodapé" style="width:12%; height: auto; margin-top: -100px;"  />`;
      rodape.style.cssText = `
      width: 100%;
      height: 40px;
      flex-shrink: 0;
      
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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
      filename: `proposta-comercial-${
        new Date().toISOString().split("T")[0]
      }.pdf`,
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
          console.log("PDF gerado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao gerar PDF:", error);
          alert("Erro ao gerar PDF. Por favor, tente novamente.");
        });
    }, 1000);
  };

  const renderizarPrevisualizacao = () => {
    return paginas.map((pagina, index) => {
      const htmlContent = convertEditorStateToHTML(pagina.conteudo);

      return (
        <div
          key={pagina.id}
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
          <div className="absolute top-0 left-0 w-full z-0 ">
            <img src={ImagemCabecalho} alt="Cabeçalho" className="w-full" />
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-full flex justify-center opacity-20">
            <img src={ImagemFundo} alt="Logo" className="w-[70%] max-w-xs" />
          </div>

          <div
            className="relative z-10 pt-20 pb-20 h-full mt-4"
            style={{ direction: "ltr" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: htmlContent,
              }}
              style={{
                fontFamily: fontFamily,
                fontSize: fontSize,
                direction: "ltr",
                id: `preview-content-${index}`,
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center z-0">
            <img src={ImagemRodape} alt="Rodapé" className="w-1/5 mb-2" />
          </div>

          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {index + 1}
          </div>

          <div className="absolute top-2 left-2 flex gap-1">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                iniciarEdicaoTitulo(index);
              }}
              className="bg-white hover:bg-gray-100"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmacaoExclusao(index);
              }}
              className="bg-white hover:bg-gray-100"
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
        </div>
      );
    });
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
        width={"1300px"}
        icon={<AddCircle fontSize="small" />}
        open={cadastro}
        onClose={ModalFecha}
        title="Cadastro Proposta Comercial"
      >
        <div
          className="flex flex-col gap-4 w-full"
          style={{ direction: "ltr" }}
        >
          <div className="flex justify-between items-center mb-4">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Nome"
              autoComplete="off"
              sx={{
                width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" },
                marginTop: "10px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Article />
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Páginas: {paginas.length}
              </h3>
              <Chip
                label={`Página ${paginaAtual + 1} de ${paginas.length}`}
                color="primary"
                variant="outlined"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={adicionarPagina}
              >
                Nova Página
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
              >
                Baixar PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {paginas.map((pagina, index) => (
              <div key={pagina.id} className="flex items-center gap-1">
                {pagina.editando ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      defaultValue={pagina.titulo}
                      onBlur={(e) => salvarTitulo(index, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          salvarTitulo(index, e.target.value);
                        }
                      }}
                      className="border rounded px-2 py-1 text-sm"
                      autoFocus
                      style={{ direction: "ltr" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        salvarTitulo(
                          index,
                          document.querySelector(`input[data-index="${index}"]`)
                            ?.value
                        )
                      }
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
                  <Chip
                    label={pagina.titulo}
                    color={index === paginaAtual ? "primary" : "default"}
                    onClick={() => setPaginaAtual(index)}
                    onDelete={() => iniciarEdicaoTitulo(index)}
                    deleteIcon={<Edit />}
                    variant={index === paginaAtual ? "filled" : "outlined"}
                  />
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

                  <ToggleButtonGroup size="small" exclusive sx={{ mr: 1 }}>
                    <ToggleButton
                      value="unordered"
                      onClick={() => toggleBlockType("unordered-list-item")}
                    >
                      <FormatListBulleted />
                    </ToggleButton>
                    <ToggleButton
                      value="ordered"
                      onClick={() => toggleBlockType("ordered-list-item")}
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
                      paginas[paginaAtual]?.conteudo ||
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
        </div>
      </CentralModal>

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
    </div>
  );
};

export default CadastroPropostaComercial;
