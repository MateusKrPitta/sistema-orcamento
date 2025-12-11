import React, { useState } from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import DvrIcon from "@mui/icons-material/Dvr";
import { IconButton, InputAdornment, TextField } from "@mui/material";
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

const Orcamentos = () => {
  const [editar, setEditar] = useState(false);
  const [filtro, setFiltro] = useState(false);
  const [buscaOrcamento, setBuscaOrcamento] = useState("");

  const ModalFiltro = () => {
    setFiltro(true);
  };

  const ModalFiltroFecha = () => {
    setFiltro(false);
  };

  const orcamentos = [
    {
      id: 1,
      nome: "João Silva",
      valorTotal: "R$ 2.500,00",
      status: "Pendente",
      ativo: true,
      categoria: "Metalurgica",
    },
    {
      id: 2,
      nome: "João Silva",
      valorTotal: "R$ 2.500,00",
      status: "Cancelado",
      ativo: true,
      categoria: "Metalurgica",
    },
    {
      id: 3,
      nome: "João Silva",
      valorTotal: "R$ 3.500,00",
      status: "Aprovado",
      ativo: true,
      categoria: "Ferragens",
    },
  ];

  const ModalEditar = () => {
    setEditar(true);
  };

  const ModalEditarFecha = () => {
    setEditar(false);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="w-full flex min-h-screen bg-gray-50">
      {/* Sidebar */}
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
          className="w-full  p-4"
        >
          <div className="flex flex-col  justify-between items-start mb-6 lg:mb-8 mt-4 lg:mt-2">
            <h1 className="text-primary font-bold text-xl flex gap-2 items-center">
              <DvrIcon />
              Orçamentos
            </h1>
            <div className=" items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start ">
              <div className="w-[100%] itens-center gap-4 mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[90%]">
                <div className="flex w-full gap-2 items-center">
                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[20%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "30%" }}
                      src={Imagem01}
                      alt="Quantidade"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Quantidade</label>
                      <label className="text-lg font-extrabold">30</label>
                    </div>
                  </div>
                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[30%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img style={{ width: "20%" }} src={Imagem02} alt="Total" />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Total</label>
                      <label className="text-lg font-extrabold">
                        R$ 3.000,00
                      </label>
                    </div>
                  </div>
                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[20%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem03}
                      alt="Pendente"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Pendente</label>
                      <label className="text-lg font-extrabold">30</label>
                    </div>
                  </div>
                  <div
                    className="bg-primary p-3 flex items-center gap-4 w-[20%]"
                    style={{ border: "1px solid black", borderRadius: "10px" }}
                  >
                    <img
                      style={{ width: "20%" }}
                      src={Imagem04}
                      alt="Cancelado"
                    />
                    <div className="flex flex-col gap-2 items-center justify-center w-[70%]">
                      <label className="text-xs font-bold">Cancelado</label>
                      <label className="text-lg font-extrabold">40</label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Buscar orçamento"
                    value={buscaOrcamento}
                    onChange={(e) => setBuscaOrcamento(e.target.value)}
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
                    }}
                  />
                  <CadastrarOrcamento />
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
                <div className="w-full flex-1">
                  <TableComponent
                    showPagination={true}
                    headers={headerOrcamento}
                    rows={cadastrosOrcamentos(orcamentos)}
                    actionCalls={{
                      edit: ModalEditar,
                      print: "",
                      delete: "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <EditarOrcamento open={editar} handleClose={ModalEditarFecha} />

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
                autoComplete="off"
                type="date"
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
                autoComplete="off"
                type="date"
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
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Cliente"
                select
                autoComplete="off"
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
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
                label="Responsável"
                select
                autoComplete="off"
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "100%" },
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
                label="Categoria"
                select
                autoComplete="off"
                sx={{
                  width: { xs: "72%", sm: "50%", md: "40%", lg: "48%" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category />
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
                autoComplete="off"
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
              />
              <div className="w-[100%] mt-2 flex items-end gap-3 justify-end">
                <ButtonComponent
                  title={"Limpar Filtro"}
                  subtitle={"Limpar Filtro"}
                  startIcon={<CleaningServices />}
                />
                <ButtonComponent
                  title={"Pesquisar"}
                  subtitle={"Pesquisar"}
                  startIcon={<Search />}
                />
              </div>
            </div>
          </div>
        </CentralModal>
      </div>
    </div>
  );
};

export default Orcamentos;
