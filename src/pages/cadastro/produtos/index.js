import React, { useCallback, useEffect, useState, useRef } from "react";
import Navbar from "../../../components/navbars/header";
import MenuMobile from "../../../components/menu-mobile";
import HeaderPerfil from "../../../components/navbars/perfil";
import { motion } from "framer-motion";
import HeaderCadastro from "../../../components/navbars/cadastro";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import {
  AddCircle,
  Edit,
  Person,
  ProductionQuantityLimits,
  Save,
  Search,
  Clear,
} from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import TableComponent from "../../../components/table";
import ModalLateral from "../../../components/modal-lateral";
import { cadastrosProdutos } from "../../../entities/class/produtos";
import { criarProduto } from "../../../services/post/produto";
import { buscarProdutos } from "../../../services/get/produtos";
import { headerProduto } from "../../../entities/headers/header-produto";
import { atualizarProduto } from "../../../services/put/produto";
import { buscarNomeProdutos } from "../../../services/get/nome-produto";
import { debounce } from "lodash";
import { InativarProduto } from "../../../services/path/inativa-produto";
import { AtivarProduto } from "../../../services/path/ativa-produto";

const Produtos = () => {
  const [editar, setEditar] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [nome, setNome] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [limitePorPagina, setLimitePorPagina] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [termoBusca, setTermoBusca] = useState("");
  const [ativoFiltro, setAtivoFiltro] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  const debouncedSearchRef = useRef(
    debounce((searchTerm) => {
      if (searchTerm.trim() !== "") {
        setPaginaAtual(0);
        setFiltroAplicado(true);
        executarBuscaComTermo(searchTerm, 1, limitePorPagina);
      } else {
        setFiltroAplicado(false);
        setPaginaAtual(0);
        ListaProdutos(1, limitePorPagina);
      }
    }, 500)
  );

  const ModalCadastro = () => {
    setCadastro(true);
  };

  const ModalFecha = () => {
    setCadastro(false);
  };

  const ModalEditar = (produto) => {
    setProdutoEditando(produto);
    setNome(produto.nome);
    setEditar(true);
  };

  const ModalEditarFecha = () => {
    setEditar(false);
    setNome("");
    setProdutoEditando(null);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const executarBuscaComTermo = async (searchTerm, page, limit) => {
    setLoadingBusca(true);
    try {
      const response = await buscarNomeProdutos(
        searchTerm,
        page,
        limit,
        ativoFiltro
      );
      setProdutos(response.data || []);
      setTotalRegistros(response.meta?.total || 0);
      setTotalPaginas(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Erro inesperado ao buscar produtos:", error);
    } finally {
      setLoadingBusca(false);
    }
  };

  const BuscarProdutosComFiltros = async (
    page = paginaAtual + 1,
    limit = limitePorPagina
  ) => {
    setLoadingBusca(true);
    setFiltroAplicado(true);

    try {
      const response = await buscarNomeProdutos(
        termoBusca,
        page,
        limit,
        ativoFiltro
      );

      setProdutos(response.data || []);
      setTotalRegistros(response.meta?.total || 0);
      setTotalPaginas(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Erro inesperado ao buscar produtos:", error);
    } finally {
      setLoadingBusca(false);
    }
  };

  const ListaProdutos = async (
    page = paginaAtual + 1,
    limit = limitePorPagina
  ) => {
    setLoadingBusca(true);
    try {
      const response = await buscarProdutos(page, limit);
      setProdutos(response.data || []);
      setTotalRegistros(response.meta?.total || 0);
      setTotalPaginas(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Erro inesperado ao buscar produtos:", error);
    } finally {
      setLoadingBusca(false);
    }
  };

  const CadastrarProdutos = async () => {
    setLoading(true);
    try {
      const resultado = await criarProduto(nome);

      if (resultado && resultado.message) {
        ListaProdutos();
        setNome("");
        ModalFecha();
      } else {
        console.error("Erro ao cadastrar categoria:", resultado?.error);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);

    if (filtroAplicado) {
      BuscarProdutosComFiltros(novaPagina + 1, limitePorPagina);
    } else {
      ListaProdutos(novaPagina + 1, limitePorPagina);
    }
  };

  const handleMudarLimitePorPagina = (novoLimite, novaPagina) => {
    setLimitePorPagina(novoLimite);
    setPaginaAtual(novaPagina);

    if (filtroAplicado) {
      BuscarProdutosComFiltros(novaPagina + 1, novoLimite);
    } else {
      ListaProdutos(novaPagina + 1, novoLimite);
    }
  };

  const EditarCategoria = async () => {
    setLoading(true);
    try {
      const resultado = await atualizarProduto(produtoEditando.id, nome);

      if (resultado && resultado.success) {
        if (filtroAplicado) {
          BuscarProdutosComFiltros(paginaAtual + 1, limitePorPagina);
        } else {
          ListaProdutos(paginaAtual + 1, limitePorPagina);
        }
        ModalEditarFecha();
        setProdutoEditando(null);
        setNome("");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setTermoBusca("");
    setFiltroAplicado(false);
    setPaginaAtual(0);
    ListaProdutos(1, limitePorPagina);
  };

  useEffect(() => {
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, []);

  const toggleStatusProduto = async (produto) => {
    setLoadingToggle(true);
    try {
      let resultado;

      if (produto.ativo) {
        resultado = await InativarProduto(produto.id, false);
      } else {
        resultado = await AtivarProduto(produto.id, true);
      }

      if (resultado && resultado.success) {
        await ListaProdutos();
      } else {
        console.error("Erro ao alternar status:", resultado?.error);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoadingToggle(false);
    }
  };

  useEffect(() => {
    ListaProdutos();
  }, []);

  return (
    <div className="w-full flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col w-full ml-0 lg:ml-[200px]">
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <MenuMobile />
          <HeaderPerfil />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="w-full p-4"
        >
          <div className="flex flex-col justify-between items-start mb-6 lg:mb-8 mt-4 lg:mt-2">
            <h1 className="text-primary font-bold text-xl flex gap-2 items-center">
              <ProductionQuantityLimits />
              Produtos
            </h1>
            <div className="items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start">
              <div className="w-[100%] md:w-[60%] lg:w-[14%]">
                <HeaderCadastro />
              </div>
              <div className="w-[100%] items-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
                <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Buscar produto"
                    autoComplete="off"
                    value={termoBusca}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTermoBusca(value);
                      debouncedSearchRef.current(value);
                    }}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      endAdornment: termoBusca && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={limparBusca}
                            edge="end"
                          >
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <ButtonComponent
                    startIcon={<AddCircle fontSize="small" />}
                    title={"Cadastrar"}
                    subtitle={"Cadastrar"}
                    buttonSize="large"
                    onClick={ModalCadastro}
                  />
                </div>
                <div className="w-full flex-1 mt-2 ">
                  <TableComponent
                    showPagination={true}
                    headers={headerProduto}
                    rows={cadastrosProdutos(produtos)}
                    actionCalls={{
                      edit: ModalEditar,
                      toggleStatus: (row) => toggleStatusProduto(row),
                    }}
                    paginaAtual={paginaAtual}
                    limitePorPagina={limitePorPagina}
                    totalRegistros={totalRegistros}
                    onMudarPagina={handleMudarPagina}
                    onMudarLimitePorPagina={handleMudarLimitePorPagina}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <CentralModal
          tamanhoTitulo={"81%"}
          maxHeight={"90vh"}
          top={"20%"}
          left={"28%"}
          width={"400px"}
          icon={<AddCircle fontSize="small" />}
          open={cadastro}
          onClose={ModalFecha}
          title="Cadastrar Produtos"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className="mt-4 flex gap-3 flex-wrap">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Nome*"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" } }}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ProductionQuantityLimits />
                    </InputAdornment>
                  ),
                }}
              />

              <div className="w-[100%] mt-2 flex items-end justify-end">
                <ButtonComponent
                  title={"Cadastrar"}
                  loading={loading}
                  disabled={!nome.trim()}
                  subtitle={"Cadastrar"}
                  onClick={CadastrarProdutos}
                  startIcon={<Save />}
                />
              </div>
            </div>
          </div>
        </CentralModal>

        <ModalLateral
          open={editar}
          handleClose={ModalEditarFecha}
          tituloModal="Editar Produtos"
          icon={<Edit />}
          tamanhoTitulo="70%"
          conteudo={
            <div className="w-full">
              <div className="mt-4 w-full flex gap-3 items-center flex-wrap">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Nome Completo*"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  sx={{
                    width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" },
                  }}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="w-[100%] mt-2 flex items-end justify-end">
                  <ButtonComponent
                    title={"Salvar"}
                    loading={loading}
                    disabled={!nome.trim()}
                    subtitle={"Cadastrar"}
                    onClick={EditarCategoria}
                    startIcon={<Save />}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Produtos;
