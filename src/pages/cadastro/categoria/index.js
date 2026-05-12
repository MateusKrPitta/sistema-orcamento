import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/header";
import MenuMobile from "../../../components/menu-mobile";
import HeaderPerfil from "../../../components/navbars/perfil";
import { motion } from "framer-motion";
import HeaderCadastro from "../../../components/navbars/cadastro";
import { InputAdornment, TextField } from "@mui/material";
import { AddCircle, Category, Edit, Save, Search } from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import TableComponent from "../../../components/table";
import ModalLateral from "../../../components/modal-lateral";
import { cadastrosCategoria } from "../../../entities/class/categoria";
import { headerCategoria } from "../../../entities/headers/header-categoria";
import { criarCategoria } from "../../../services/post/categoria";
import { buscarCartegoria } from "../../../services/get/categoria";
import { atualizarCategoria } from "../../../services/put/categoria";
import { AtivarCategoria } from "../../../services/path/ativa-categoria";
import { InativarCategoria } from "../../../services/path/inativa-categoria";

const Categoria = () => {
  const [editar, setEditar] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [nome, setNome] = useState("");
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const buscarCategorias = async () => {
    setLoadingBusca(true);
    try {
      const response = await buscarCartegoria();
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro inesperado ao buscar categorias:", error);
    } finally {
      setLoadingBusca(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const ModalCadastro = () => {
    setCadastro(true);
    setCategoriaEditando(null);
    setNome("");
  };

  const ModalFecha = () => {
    setCadastro(false);
    setNome("");
  };

  const ModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setNome(categoria.nome);
    setEditar(true);
  };

  const ModalEditarFecha = () => {
    setEditar(false);
    setNome("");
    setCategoriaEditando(null);
  };

  const CadastrarCategoria = async () => {
    setLoading(true);
    try {
      const resultado = await criarCategoria(nome);

      if (resultado && resultado.success) {
        buscarCategorias();
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

  const EditarCategoria = async () => {
    setLoading(true);
    try {
      const resultado = await atualizarCategoria(categoriaEditando.id, nome);

      if (resultado && resultado.success) {
        buscarCategorias();
        ModalEditarFecha();
        setCategoriaEditando(null);
        setNome("");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusCategoria = async (categoria) => {
    setLoadingToggle(true);
    try {
      let resultado;

      if (categoria.ativo) {
        resultado = await InativarCategoria(categoria.id, false);
      } else {
        resultado = await AtivarCategoria(categoria.id, true);
      }

      if (resultado && resultado.success) {
        await buscarCategorias();
      } else {
        console.error("Erro ao alternar status:", resultado?.error);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setLoadingToggle(false);
    }
  };

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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
              <Category />
              Categoria
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
                    label="Buscar categoria"
                    autoComplete="off"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    sx={{
                      width: { xs: "72%", sm: "50%", md: "40%", lg: "40%" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
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

                <div className="w-full flex-1 mt-2">
                  {busca && categoriasFiltradas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <label className="text-sm mt-9">
                        Categoria não encontrada para:{" "}
                        <strong>"{busca}"</strong>
                      </label>
                    </div>
                  ) : categorias.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma categoria cadastrada</p>
                    </div>
                  ) : (
                    <TableComponent
                      showPagination={false}
                      headers={headerCategoria}
                      rows={cadastrosCategoria(categoriasFiltradas)}
                      actionCalls={{
                        edit: (row) => ModalEditar(row),
                        toggleStatus: (row) => toggleStatusCategoria(row),
                      }}
                    />
                  )}
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
          title="Cadastrar Categoria"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className="mt-4 flex gap-3 flex-wrap">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Categoria*"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" } }}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
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
                  startIcon={<Save />}
                  onClick={CadastrarCategoria}
                />
              </div>
            </div>
          </div>
        </CentralModal>

        <ModalLateral
          open={editar}
          handleClose={ModalEditarFecha}
          tituloModal="Editar Categoria"
          icon={<Edit />}
          tamanhoTitulo="70%"
          conteudo={
            <div className="w-full">
              <div className="mt-4 w-full flex gap-3 items-center flex-wrap">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Categoria*"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  sx={{
                    width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" },
                  }}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Category />
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="w-[100%] mt-2 flex items-end justify-end">
                  <ButtonComponent
                    title={"Salvar"}
                    loading={loading}
                    disabled={!nome.trim()}
                    subtitle={"Salvar"}
                    startIcon={<Save />}
                    onClick={EditarCategoria}
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

export default Categoria;
