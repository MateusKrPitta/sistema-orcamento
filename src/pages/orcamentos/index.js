import React, { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import DvrIcon from "@mui/icons-material/Dvr";
import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  Article,
  Category,
  CleaningServices,
  DateRange,
  FilterAlt,
  Person,
  Search,
} from "@mui/icons-material";
import Imagem01 from "../../assets/png/quantidade.png";
import Imagem02 from "../../assets/png/moeda.png";
import Imagem03 from "../../assets/png/alerta.png";
import Imagem04 from "../../assets/png/perto.png";
import CadastrarOrcamento from "./cadastrar";
import TableComponent from "../../components/table";
import { headerOrcamento } from "../../entities/headers/header-orcamento";
import { cadastrosOrcamentos } from "../../entities/class/orcamentos";
import EditarOrcamento from "./editar";
import CentralModal from "../../components/modal-central";
import ButtonComponent from "../../components/button";
import { buscarClienteOrcamento } from "../../services/get/nome-cliente-orcamento";
import { buscarOrcamentos } from "../../services/get/orcamentos";
import { buscarInformacoesOrcamento } from "../../services/get/informacoes-orcamentos";
import { buscarOrcamentoEspecifico } from "../../services/get/orcamento-especifico-orcamento";
import { deletarOrcamentoEspecifico } from "../../services/delete";
import ImprimirOrcamento from "./imprimir";
import { buscarClientes } from "../../services/get/cliente";
import { buscarCartegoria } from "../../services/get/categoria";
import { buscarRelatorioOrcamentos } from "../../services/get/filtro-orcamento";

const Orcamentos = () => {
  const [editar, setEditar] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingEstatisticas, setLoadingEstatisticas] = useState(true);
  const [buscaOrcamento, setBuscaOrcamento] = useState("");
  const [orcamentoParaImprimir, setOrcamentoParaImprimir] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [informacoes, setInformacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [limitePorPagina, setLimitePorPagina] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [imprimirModal, setImprimirModal] = useState(false);
  const [loadingImprimir, setLoadingImprimir] = useState(false);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [loadingEdicao, setLoadingEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total_ativos: 0,
    valor_total: 0,
    por_status: {
      pendente_ligacao: 0,
      em_andamento: 0,
      venda_concluida: 0,
      cancelado: 0,
    },
    total_geral: 0,
  });

  const [inicializado, setInicializado] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    data_inicio: "",
    data_fim: "",
    cliente_id: "",
    categoria_id: "",
    status: "",
  });
  const [aplicandoFiltro, setAplicandoFiltro] = useState(false);

  const handlePageChange = useCallback((newPage) => {
    setPaginaAtual(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newLimit) => {
    setLimitePorPagina(newLimit);
    setPaginaAtual(0);
  }, []);

  const debounceRef = useRef(null);

  const ListaOrcamentos = useCallback(
    async (page = paginaAtual + 1, limit = limitePorPagina, filtros = {}) => {
      setLoadingBusca(true);
      try {
        const response = await buscarOrcamentos(page, limit, filtros);

        let orcamentosData = [];
        let metaData = {};

        if (response.data && Array.isArray(response.data)) {
          orcamentosData = response.data;
          metaData = response.meta || {};
        } else if (response.data && response.data.orcamentos) {
          orcamentosData = response.data.orcamentos;
          metaData = response.data.meta || {};
        } else {
          orcamentosData = response.data || [];
          metaData = response.meta || {};
        }

        setOrcamentos(orcamentosData);
        setTotalRegistros(metaData.total || 0);
        setTotalPaginas(metaData.last_page || 1);

        const currentPageFromAPI = metaData.currentPage || 1;
        setPaginaAtual(currentPageFromAPI - 1);
      } catch (error) {
        console.error("Erro inesperado ao buscar orçamentos:", error);
      } finally {
        setLoadingBusca(false);
      }
    },
    [paginaAtual, limitePorPagina],
  );

  const determinarTipoBusca = (valor) => {
    const valorLimpo = valor.trim();
    const apenasNumeros = /^\d+$/.test(valorLimpo);

    if (apenasNumeros) {
      return {
        tipo: "numero",
        valor: valorLimpo,
      };
    } else {
      return {
        tipo: "nome",
        valor: valorLimpo,
      };
    }
  };

  const buscarPorClienteOuNumero = useCallback(
    async (valorBusca, page = paginaAtual + 1, limit = limitePorPagina) => {
      if (!valorBusca || valorBusca.trim() === "") {
        ListaOrcamentos(page, limit);
        return;
      }

      setLoadingBusca(true);
      try {
        const tipoBusca = determinarTipoBusca(valorBusca);
        let filtros = {};

        if (tipoBusca.tipo === "numero") {
          filtros = {
            numero_orcamento: tipoBusca.valor,
            page: page,
            limit: limit,
          };
        } else {
          filtros = {
            cliente_nome: tipoBusca.valor,
            page: page,
            limit: limit,
          };
        }

        const response = await buscarClienteOrcamento(filtros);

        let orcamentosData = [];
        let metaData = {};

        if (response.data && Array.isArray(response.data)) {
          orcamentosData = response.data;
          metaData = response.meta || {};
        } else if (response.data && response.data.orcamentos) {
          orcamentosData = response.data.orcamentos;
          metaData = response.data.meta || {};
        } else {
          orcamentosData = response.data || [];
          metaData = response.meta || {};
        }

        setOrcamentos(orcamentosData);
        setTotalRegistros(metaData.total || 0);
        setTotalPaginas(metaData.last_page || 1);
        const currentPageFromAPI = metaData.currentPage || page;
        setPaginaAtual(currentPageFromAPI - 1);
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
        ListaOrcamentos(page, limit);
      } finally {
        setLoadingBusca(false);
      }
    },
    [paginaAtual, limitePorPagina, ListaOrcamentos],
  );

  const aplicarFiltros = async () => {
    setAplicandoFiltro(true);
    setLoadingBusca(true);

    try {
      const filtrosParaAPI = {
        ...filtrosAplicados,
        page: paginaAtual + 1,
        limit: limitePorPagina,
      };

      Object.keys(filtrosParaAPI).forEach((key) => {
        if (filtrosParaAPI[key] === "") {
          delete filtrosParaAPI[key];
        }
      });

      const response = await buscarRelatorioOrcamentos(filtrosParaAPI);

      const orcamentosData = response.data?.orcamentos || [];
      const metaData = response.data?.meta || {};

      setOrcamentos(orcamentosData);
      setTotalRegistros(metaData.total || 0);
      setTotalPaginas(metaData.last_page || 1);

      const currentPageFromAPI = metaData.currentPage || 1;
      setPaginaAtual(currentPageFromAPI - 1);

      setFiltro(false);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      ListaOrcamentos(paginaAtual + 1, limitePorPagina);
    } finally {
      setAplicandoFiltro(false);
      setLoadingBusca(false);
    }
  };

  const limparFiltros = () => {
    setFiltrosAplicados({
      data_inicio: "",
      data_fim: "",
      cliente_id: "",
      categoria_id: "",
      status: "",
    });

    setPaginaAtual(0);
    ListaOrcamentos(1, limitePorPagina);
    setFiltro(false);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltrosAplicados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleImprimirOrcamento = async (id) => {
    if (!id) {
      console.error("ID não fornecido para impressão");
      return;
    }

    setLoadingImprimir(true);
    try {
      const response = await buscarOrcamentoEspecifico(id);
      let dadosOrcamento = null;

      if (response && response.success && response.data) {
        dadosOrcamento = response.data;
      } else if (response && response.data) {
        dadosOrcamento = response.data;
      } else {
        dadosOrcamento = response;
      }

      if (dadosOrcamento) {
        setOrcamentoParaImprimir(dadosOrcamento);
        setImprimirModal(true);
      } else {
        console.error("Nenhum dado de orçamento encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar orçamento para impressão:", error);
    } finally {
      setLoadingImprimir(false);
    }
  };

  const handleFecharImprimirModal = () => {
    setImprimirModal(false);
    setOrcamentoParaImprimir(null);
  };

  const handleEditarOrcamento = async (id) => {
    setLoadingEdicao(true);
    setErroEdicao(null);
    setOrcamentoSelecionado(null);

    try {
      const response = await buscarOrcamentoEspecifico(id);

      if (response && response.success && response.data) {
        setOrcamentoSelecionado(response.data);
      } else if (response && response.data) {
        setOrcamentoSelecionado(response.data);
      } else {
        setOrcamentoSelecionado(response);
      }

      setEditar(true);
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
    } finally {
      setLoadingEdicao(false);
    }
  };

  const ModalFiltro = async () => {
    try {
      setFiltro(true);
      await Promise.all([buscarClientesFiltro(), buscarCategoriasFiltro()]);
    } catch (error) {
      console.error("Erro ao carregar dados do filtro:", error);
    }
  };

  const ModalFiltroFecha = () => {
    setFiltro(false);
  };

  const handleDeletarOrcamento = async (id) => {
    if (!id) {
      console.error("ID não fornecido para exclusão");
      return;
    }

    setDeletingIds((prev) => [...prev, id]);

    try {
      await deletarOrcamentoEspecifico(id);

      setOrcamentos((prev) => prev.filter((orcamento) => orcamento.id !== id));
      setTotalRegistros((prev) => prev - 1);
      ListaProdutos();
      if (buscaOrcamento && buscaOrcamento.trim() !== "") {
        buscarPorClienteOuNumero(
          buscaOrcamento,
          paginaAtual + 1,
          limitePorPagina,
        );
      } else {
        ListaOrcamentos(paginaAtual + 1, limitePorPagina);
      }
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
    }
  };

  const ModalEditarFecha = () => {
    setEditar(false);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    setBuscaOrcamento(valor);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!valor || valor.trim() === "") {
      setPaginaAtual(0);
      ListaOrcamentos(1, limitePorPagina);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setPaginaAtual(0);
      buscarPorClienteOuNumero(valor, 1, limitePorPagina);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const ListaProdutos = async () => {
    setLoadingEstatisticas(true);
    try {
      const response = await buscarInformacoesOrcamento();

      if (response && response.data) {
        setEstatisticas(response.data);
      } else {
        console.warn("Resposta da API não contém dados:", response);
      }

      setInformacoes(response?.data ? [response.data] : []);
    } catch (error) {
      console.error("Erro ao buscar estatísticas de orçamentos:", error);
      setInformacoes([]);
    } finally {
      setLoadingEstatisticas(false);
    }
  };

  const atualizarListaOrcamentos = useCallback(() => {
    if (buscaOrcamento && buscaOrcamento.trim() !== "") {
      buscarPorClienteOuNumero(
        buscaOrcamento,
        paginaAtual + 1,
        limitePorPagina,
      );
    } else if (Object.values(filtrosAplicados).some((valor) => valor !== "")) {
      aplicarFiltros();
    } else {
      ListaOrcamentos(paginaAtual + 1, limitePorPagina);
    }

    ListaProdutos();
  }, [
    buscaOrcamento,
    paginaAtual,
    limitePorPagina,
    filtrosAplicados,
    buscarPorClienteOuNumero,
    ListaOrcamentos,
  ]);

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const formatarNumero = (numero) => {
    return numero?.toLocaleString("pt-BR") || "0";
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      if (inicializado || carregandoDados) return;

      setCarregandoDados(true);
      try {
        await ListaProdutos();
        await ListaOrcamentos(1, limitePorPagina);
        setInicializado(true);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarDadosIniciais();
  }, [inicializado, carregandoDados, limitePorPagina]);

  useEffect(() => {
    if (!inicializado) return;

    const carregarDadosPaginacao = async () => {
      if (buscaOrcamento && buscaOrcamento.trim() !== "") {
        buscarPorClienteOuNumero(
          buscaOrcamento,
          paginaAtual + 1,
          limitePorPagina,
        );
      } else {
        const temFiltros = Object.values(filtrosAplicados).some(
          (valor) => valor !== "",
        );

        if (temFiltros) {
          await aplicarFiltros();
        } else {
          ListaOrcamentos(paginaAtual + 1, limitePorPagina);
        }
      }
    };

    carregarDadosPaginacao();
  }, [
    paginaAtual,
    limitePorPagina,
    buscaOrcamento,
    inicializado,
    buscarPorClienteOuNumero,
    ListaOrcamentos,
  ]);

  const buscarClientesFiltro = async () => {
    try {
      const response = await buscarClientes();
      setClientes(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar clientes para filtro:", error);
      setClientes([]);
    }
  };

  const buscarCategoriasFiltro = async () => {
    try {
      const response = await buscarCartegoria();
      setCategorias(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar categorias para filtro:", error);
      setCategorias([]);
    }
  };

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
              <DvrIcon />
              Orçamentos
            </h1>
            <div className="items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start">
              <div className="w-[100%] itens-center gap-4 mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[100%]">
                <div className="flex w-full gap-2 items-center">
                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[17%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem01}
                      alt="Quantidade"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Total</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarNumero(estatisticas.total_ativos)
                        )}
                      </label>
                    </div>
                  </div>

                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[30%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img style={{ width: "13%" }} src={Imagem02} alt="Total" />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Valor Total</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarValor(estatisticas.valor_total)
                        )}
                      </label>
                    </div>
                  </div>

                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[17%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem03}
                      alt="Pendente"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Pendentes</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarNumero(
                            estatisticas.por_status?.pendente_ligacao || 0,
                          )
                        )}
                      </label>
                    </div>
                  </div>

                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[17%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem04}
                      alt="Cancelado"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Cancelados</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarNumero(
                            estatisticas.por_status?.cancelado || 0,
                          )
                        )}
                      </label>
                    </div>
                  </div>

                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[17%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem03}
                      alt="Em Andamento"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Em Andamento</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarNumero(
                            estatisticas.por_status?.em_andamento || 0,
                          )
                        )}
                      </label>
                    </div>
                  </div>

                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[17%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem01}
                      alt="Concluídos"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Concluídos</label>
                      <label className="text-lg font-extrabold">
                        {loadingEstatisticas ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          formatarNumero(
                            estatisticas.por_status?.venda_concluida || 0,
                          )
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start mt-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Buscar por nome ou número"
                    placeholder="Digite nome do cliente ou número do orçamento"
                    value={buscaOrcamento}
                    onChange={handleBuscaChange}
                    autoComplete="off"
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      endAdornment: loadingBusca ? (
                        <InputAdornment position="end">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <CadastrarOrcamento onSuccess={atualizarListaOrcamentos} />
                  <IconButton
                    title="Filtrar"
                    className="view-button"
                    onClick={ModalFiltro}
                    sx={{
                      color: "#a3cb39",
                      border: "1px solid black",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#a3cb39",
                        border: "1px solid blakc",
                      },
                    }}
                  >
                    <FilterAlt fontSize={"small"} />
                  </IconButton>
                </div>

                <div className="w-full flex-1 mt-2">
                  <TableComponent
                    showPagination={true}
                    headers={headerOrcamento}
                    rows={cadastrosOrcamentos(orcamentos)}
                    actionCalls={{
                      edit: (rowData) => handleEditarOrcamento(rowData.id),
                      print: (rowData) => handleImprimirOrcamento(rowData.id),
                      delete: (rowData) => handleDeletarOrcamento(rowData.id),
                    }}
                    paginaAtual={paginaAtual}
                    limitePorPagina={limitePorPagina}
                    totalRegistros={totalRegistros}
                    onMudarPagina={handlePageChange}
                    onMudarLimitePorPagina={handleRowsPerPageChange}
                  />
                  {!loadingBusca &&
                    buscaOrcamento &&
                    orcamentos.length === 0 && (
                      <div className="w-full flex items-center justify-center mt-2 text-sm text-yellow-600">
                        Nenhum orçamento encontrado para "{buscaOrcamento}"
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <ImprimirOrcamento
          open={imprimirModal}
          onClose={handleFecharImprimirModal}
          dadosOrcamento={orcamentoParaImprimir}
        />

        <EditarOrcamento
          open={editar}
          handleClose={ModalEditarFecha}
          dadosOrcamento={orcamentoSelecionado}
          loading={loadingEdicao}
          error={erroEdicao}
        />

        <CentralModal
          tamanhoTitulo={"81%"}
          maxHeight={"90vh"}
          width={"500px"}
          icon={<FilterAlt fontSize="small" />}
          open={filtro}
          onClose={ModalFiltroFecha}
          title="Filtrar Orçamentos"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[400px] px-2 pb-2">
            <div className="mt-4 flex gap-4 flex-wrap">
              {/* Data Início */}
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Início"
                autoComplete="off"
                type="date"
                value={filtrosAplicados.data_inicio}
                onChange={(e) =>
                  handleFiltroChange("data_inicio", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "48%", lg: "48%" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a3cb39",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a3cb39",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Data Fim */}
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Fim"
                autoComplete="off"
                type="date"
                value={filtrosAplicados.data_fim}
                onChange={(e) => handleFiltroChange("data_fim", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "48%", lg: "48%" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a3cb39",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a3cb39",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Cliente - Com MenuItem */}
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Cliente"
                select
                autoComplete="off"
                value={filtrosAplicados.cliente_id}
                onChange={(e) =>
                  handleFiltroChange("cliente_id", e.target.value)
                }
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a3cb39",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a3cb39",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Todos os clientes</em>
                </MenuItem>
                {clientes.map((cliente) => (
                  <MenuItem
                    key={cliente.id}
                    value={cliente.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(163, 203, 57, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(163, 203, 57, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(163, 203, 57, 0.3)",
                        },
                      },
                    }}
                  >
                    {cliente.nome}
                  </MenuItem>
                ))}
              </TextField>

              {/* Categoria - Com MenuItem */}
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Categoria"
                select
                autoComplete="off"
                value={filtrosAplicados.categoria_id}
                onChange={(e) =>
                  handleFiltroChange("categoria_id", e.target.value)
                }
                sx={{
                  width: { xs: "100%", sm: "48%", md: "48%", lg: "48%" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a3cb39",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a3cb39",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Todas as categorias</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem
                    key={categoria.id}
                    value={categoria.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(163, 203, 57, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(163, 203, 57, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(163, 203, 57, 0.3)",
                        },
                      },
                    }}
                  >
                    {categoria.nome}
                  </MenuItem>
                ))}
              </TextField>

              {/* Status - Com MenuItem */}
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Status"
                select
                autoComplete="off"
                value={filtrosAplicados.status}
                onChange={(e) => handleFiltroChange("status", e.target.value)}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "48%", lg: "48%" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a3cb39",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#a3cb39",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Article fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Todos os status</em>
                </MenuItem>
                <MenuItem
                  value="pendente_ligacao"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(163, 203, 57, 0.1)",
                    },
                  }}
                >
                  Pendente Ligação
                </MenuItem>
                <MenuItem
                  value="em_andamento"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(163, 203, 57, 0.1)",
                    },
                  }}
                >
                  Em Andamento
                </MenuItem>
                <MenuItem
                  value="venda_concluida"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(163, 203, 57, 0.1)",
                    },
                  }}
                >
                  Venda Concluída
                </MenuItem>
                <MenuItem
                  value="cancelado"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(163, 203, 57, 0.1)",
                    },
                  }}
                >
                  Cancelado
                </MenuItem>
              </TextField>

              {/* Botões */}
              <div className="w-full mt-2 flex items-center gap-3 justify-end pt-2 border-t border-gray-200">
                <ButtonComponent
                  title={"Limpar Filtro"}
                  subtitle={"Limpar Filtro"}
                  startIcon={<CleaningServices />}
                  onClick={limparFiltros}
                  disabled={aplicandoFiltro}
                  variant="outlined"
                  sx={{
                    borderColor: "#a3cb39",
                    color: "#a3cb39",
                    "&:hover": {
                      backgroundColor: "#a3cb39",
                      color: "#fff",
                      borderColor: "#a3cb39",
                    },
                    "&.Mui-disabled": {
                      borderColor: "#e0e0e0",
                      color: "#bdbdbd",
                    },
                  }}
                />
                <ButtonComponent
                  title={"Aplicar Filtro"}
                  subtitle={"Aplicar Filtro"}
                  startIcon={aplicandoFiltro ? null : <Search />}
                  onClick={aplicarFiltros}
                  disabled={aplicandoFiltro}
                  sx={{
                    backgroundColor: "#a3cb39",
                    "&:hover": {
                      backgroundColor: "#8ab62e",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  {aplicandoFiltro ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Aplicando...
                    </div>
                  ) : (
                    "Aplicar Filtro"
                  )}
                </ButtonComponent>
              </div>
            </div>
          </div>
        </CentralModal>
      </div>
    </div>
  );
};

export default Orcamentos;
