import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import {
  Article,
  Category,
  CleaningServices,
  DateRange,
  FilterAlt,
  Person,
  Search,
} from "@mui/icons-material";
import TableComponent from "../../components/table";
import ButtonComponent from "../../components/button";
import CentralModal from "../../components/modal-central";
import CadastroPropostaComercial from "./cadastrar";
import EditarPropostaComercial from "./editar";
import CustomToast from "../../components/toast";

import {
  IconButton,
  InputAdornment,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Autocomplete,
} from "@mui/material";
import { buscarPropostas } from "../../services/get/proposta-comercial";
import { deletarPropostaId } from "../../services/delete/proposta";
import { headerProposta } from "../../entities/headers/headers-proposta";
import { cadastrosPropostas } from "../../entities/class/proposta";
import { duplicarProposta } from "../../services/post/proposta-comercias";
import { buscarClientes } from "../../services/get/cliente";
import { buscarUsuarios } from "../../services/get/usuarios";
import { buscarCartegoria } from "../../services/get/categoria";

const PropostaComercial = () => {
  const [editar, setEditar] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propostaEditando, setPropostaEditando] = useState(null);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [propostas, setPropostas] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
  });

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [limitePorPagina, setLimitePorPagina] = useState(10);

  const [filtros, setFiltros] = useState({
    status: "",
    cliente_id: "",
    categoria_id: "",
    user_id: "",
    data_inicio: "",
    data_fim: "",
    search: "",
  });

  const [inicializado, setInicializado] = useState(false);

  const [loadingFiltros, setLoadingFiltros] = useState({
    clientes: false,
    responsaveis: false,
    categorias: false,
  });

  const [inputCliente, setInputCliente] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputResponsavel, setInputResponsavel] = useState("");

  const carregarClientes = async (search = "") => {
    setLoadingFiltros((prev) => ({ ...prev, clientes: true }));
    try {
      const response = await buscarClientes(search);
      if (response.success) {
        const clientesArray = response.data.data || response.data || [];
        setClientesDisponiveis(clientesArray);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoadingFiltros((prev) => ({ ...prev, clientes: false }));
    }
  };

  const carregarResponsaveis = async (search = "") => {
    setLoadingFiltros((prev) => ({ ...prev, responsaveis: true }));
    try {
      const response = await buscarUsuarios(search);
      if (response.success) {
        const responsavelArray = response.data.data || response.data || [];
        setResponsaveis(responsavelArray);
      }
    } catch (error) {
      console.error("Erro ao carregar responsáveis:", error);
    } finally {
      setLoadingFiltros((prev) => ({ ...prev, responsaveis: false }));
    }
  };

  const buscarCategorias = async (search = "") => {
    setLoadingFiltros((prev) => ({ ...prev, categorias: true }));
    try {
      const response = await buscarCartegoria(search);
      if (response.success) {
        setCategorias(response.data);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar categorias:", error);
    } finally {
      setLoadingFiltros((prev) => ({ ...prev, categorias: false }));
    }
  };

  useEffect(() => {
    if (!filtro) return;
    const timer = setTimeout(() => {
      carregarClientes(inputCliente);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputCliente, filtro]);

  useEffect(() => {
    if (!filtro) return;
    const timer = setTimeout(() => {
      buscarCategorias(inputCategoria);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputCategoria, filtro]);

  useEffect(() => {
    if (!filtro) return;
    const timer = setTimeout(() => {
      carregarResponsaveis(inputResponsavel);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputResponsavel, filtro]);


  const carregarPropostas = useCallback(
    async (pagina = 1, limite = 10) => {
      setLoading(true);
      try {
        const paramsFiltros = { ...filtros };
        Object.keys(paramsFiltros).forEach((key) => {
          if (!paramsFiltros[key]) {
            delete paramsFiltros[key];
          }
        });

        const response = await buscarPropostas(pagina, limite, paramsFiltros);

        if (response.data) {
          setPropostas(response.data.data);
          setMeta(response.data.meta);
          setPaginaAtual(response.data.meta.currentPage - 1);
          setLimitePorPagina(response.data.meta.perPage);
        }
      } catch (error) {
        console.error("Erro ao carregar propostas:", error);
        CustomToast({
          type: "error",
          message: "Erro ao carregar propostas. Tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    },
    [filtros]
  );

  useEffect(() => {
    setInicializado(true);
  }, []);

  useEffect(() => {
    if (!inicializado) return;

    const delayDebounceFn = setTimeout(() => {
      carregarPropostas(paginaAtual + 1, limitePorPagina);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filtros, paginaAtual, limitePorPagina, inicializado, carregarPropostas]);


  useEffect(() => {
    if (filtro) {
      carregarClientes("");
      carregarResponsaveis("");
      buscarCategorias("");
    }
  }, [filtro]);

  const aplicarFiltros = () => {
    setFiltro(false);
    setPaginaAtual(0);
  };

  const limparFiltros = () => {
    setFiltros({
      status: "",
      cliente_id: "",
      categoria_id: "",
      user_id: "",
      data_inicio: "",
      data_fim: "",
      search: "",
    });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  const handleMudarLimitePorPagina = (novoLimite, novaPagina) => {
    setLimitePorPagina(novoLimite);
    setPaginaAtual(0);
  };

  const handleDuplicar = async (row) => {
    if (!row.id) {
      CustomToast({
        type: "error",
        message: "Proposta não encontrada para duplicação.",
      });
      return;
    }

    try {
      const response = await duplicarProposta(row.id);

      if (response.success) {
        carregarPropostas(1, limitePorPagina);

        if (response.data && response.data.id) {
          CustomToast({
            type: "success",
            message: `Proposta duplicada com sucesso! ID: ${response.data.id}`,
          });
        }
      } else {
        console.error("Erro ao duplicar proposta:", response.error);
      }
    } catch (error) {
      console.error("Erro inesperado ao duplicar proposta:", error);
      CustomToast({
        type: "error",
        message: "Erro inesperado ao duplicar proposta.",
      });
    }
  };

  const ModalFiltro = () => setFiltro(true);
  const ModalFiltroFecha = () => setFiltro(false);

  const handleEditar = (row) => {
    if (row.id) {
      setPropostaEditando(row.id);
      setEditar(true);
    } else {
      console.error("Proposta não tem ID:", row);
      CustomToast({
        type: "error",
        message: "Proposta não encontrada para edição.",
      });
    }
  };

  const handleDeletar = async (row) => {
    try {
      await deletarPropostaId(row.id);
      carregarPropostas(1, limitePorPagina);
    } catch (error) {
      console.error("Erro ao deletar proposta:", error);
    }
  };

  const handleFecharEdicao = () => {
    setEditar(false);
    setPropostaEditando(null);
    carregarPropostas(1, limitePorPagina);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const renderSelectClientes = () => (
    <Autocomplete
      fullWidth
      size="small"
      options={clientesDisponiveis}
      loading={loadingFiltros.clientes}
      getOptionLabel={(option) => option.nome || ""}
      value={clientesDisponiveis.find(c => c.id === filtros.cliente_id) || null}
      onInputChange={(e, val) => setInputCliente(val)}
      onChange={(e, val) => handleFiltroChange("cliente_id", val?.id || "")}
      sx={{
        width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cliente"
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
    />
  );

  const renderSelectResponsaveis = () => (
    <Autocomplete
      fullWidth
      size="small"
      options={responsaveis}
      loading={loadingFiltros.responsaveis}
      getOptionLabel={(option) => option.nome || ""}
      value={responsaveis.find(r => r.id === filtros.user_id) || null}
      onInputChange={(e, val) => setInputResponsavel(val)}
      onChange={(e, val) => handleFiltroChange("user_id", val?.id || "")}
      sx={{
        width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Responsável"
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
    />
  );

  const renderSelectCategorias = () => (
    <Autocomplete
      fullWidth
      size="small"
      options={categorias}
      loading={loadingFiltros.categorias}
      getOptionLabel={(option) => option.nome || ""}
      value={categorias.find(c => c.id === filtros.categoria_id) || null}
      onInputChange={(e, val) => setInputCategoria(val)}
      onChange={(e, val) => handleFiltroChange("categoria_id", val?.id || "")}
      sx={{
        width: { xs: "72%", sm: "50%", md: "40%", lg: "48%" },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categoria"
          placeholder="Digite para buscar..."
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
    />
  );

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
              <Article />
              Proposta Comercial
            </h1>
            <div className="items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start">
              <div className="w-[100%] itens-center gap-4 mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[90%]">
                <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start mt-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Buscar proposta"
                    value={filtros.search}
                    onChange={(e) =>
                      handleFiltroChange("search", e.target.value)
                    }
                    placeholder="Digite para pesquisar..."
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
                      endAdornment: loading && (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CadastroPropostaComercial
                    onPropostaCriada={carregarPropostas}
                  />
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
                        border: "1px solid black",
                      },
                    }}
                  >
                    <FilterAlt fontSize={"small"} />
                  </IconButton>
                </div>

                <div className="w-full flex-1 ">
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height={200}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableComponent
                      showPagination={true}
                      headers={headerProposta}
                      rows={cadastrosPropostas(propostas)}
                      actionCalls={{
                        edit: handleEditar,
                        duplicate: handleDuplicar,
                        delete: handleDeletar,
                      }}
                      paginaAtual={paginaAtual}
                      limitePorPagina={limitePorPagina}
                      totalRegistros={meta.total}
                      onMudarPagina={handleMudarPagina}
                      onMudarLimitePorPagina={handleMudarLimitePorPagina}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal de Filtros */}
        <CentralModal
          tamanhoTitulo={"81%"}
          maxHeight={"90vh"}
          width={"450px"}
          icon={<FilterAlt fontSize="small" />}
          open={filtro}
          onClose={ModalFiltroFecha}
          title="Filtro"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className="mt-4 flex gap-3 flex-wrap">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Data Início"
                value={filtros.data_inicio}
                onChange={(e) =>
                  handleFiltroChange("data_inicio", e.target.value)
                }
                autoComplete="off"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "48%" },
                }}
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
                label="Data Fim"
                value={filtros.data_fim}
                onChange={(e) => handleFiltroChange("data_fim", e.target.value)}
                autoComplete="off"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "49%" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Select de Clientes */}
              {renderSelectClientes()}

              {/* Select de Responsáveis */}
              {renderSelectResponsaveis()}

              {/* Select de Categorias */}
              {renderSelectCategorias()}

              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Status"
                value={filtros.status}
                onChange={(e) => handleFiltroChange("status", e.target.value)}
                autoComplete="off"
                select
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "49%" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Article />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
                <MenuItem value="aprovado">Aprovado</MenuItem>
              </TextField>

              <div className="w-[100%] mt-2 flex items-end gap-3 justify-end">
                <ButtonComponent
                  title={"Limpar Filtro"}
                  subtitle={"Limpar Filtro"}
                  startIcon={<CleaningServices />}
                  onClick={limparFiltros}
                />
                <ButtonComponent
                  title={"Pesquisar"}
                  subtitle={"Pesquisar"}
                  startIcon={<Search />}
                  onClick={aplicarFiltros}
                />
              </div>
            </div>
          </div>
        </CentralModal>

        <EditarPropostaComercial
          propostaId={propostaEditando}
          modoEdicao={true}
          open={editar}
          onClose={handleFecharEdicao}
          onSave={() => {
            carregarPropostas(1, limitePorPagina);
          }}
        />
      </div>
    </div>
  );
};

export default PropostaComercial;
