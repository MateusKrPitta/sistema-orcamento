import React, { useState } from "react";
import Navbar from "../../../components/navbars/header";
import MenuMobile from "../../../components/menu-mobile";
import HeaderPerfil from "../../../components/navbars/perfil";
import { motion } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HeaderCadastro from "../../../components/navbars/cadastro";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import {
  AddCircle,
  Edit,
  Mail,
  Password,
  Person,
  Save,
  Search,
  SensorsSharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import TableComponent from "../../../components/table";
import { headerUsuario } from "../../../entities/headers/header-usuario";
import { cadastrosUsuarios } from "../../../entities/class/usuario";
import ModalLateral from "../../../components/modal-lateral";

const Usuario = () => {
  const [editar, setEditar] = useState(false);
  const [cadastro, setCadastro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      ativo: true,
      senha: "senha123",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      ativo: true,
      senha: "senha456",
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      ativo: false,
      senha: "senha789",
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      ativo: true,
      senha: "senha101",
    },
    {
      id: 5,
      nome: "Pedro Almeida",
      email: "pedro.almeida@email.com",
      ativo: true,
      senha: "senha202",
    },
    {
      id: 6,
      nome: "Juliana Pereira",
      email: "juliana.pereira@email.com",
      ativo: false,
      senha: "senha303",
    },
    {
      id: 7,
      nome: "Ricardo Souza",
      email: "ricardo.souza@email.com",
      ativo: true,
      senha: "senha404",
    },
    {
      id: 8,
      nome: "Fernanda Lima",
      email: "fernanda.lima@email.com",
      ativo: true,
      senha: "senha505",
    },
    {
      id: 9,
      nome: "Roberto Martins",
      email: "roberto.martins@email.com",
      ativo: true,
      senha: "senha606",
    },
    {
      id: 10,
      nome: "Patrícia Rocha",
      email: "patricia.rocha@email.com",
      ativo: false,
      senha: "senha707",
    },
  ];

  const ModalCadastro = () => {
    setCadastro(true);
  };

  const ModalFecha = () => {
    setCadastro(false);
  };

  const ModalEditar = () => {
    setEditar(true);
  };

  const ModalEditarFecha = () => {
    setEditar(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
              <AccountCircleIcon />
              Cadastro
            </h1>
            <div className=" items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start ">
              <div className="w-[100%] md:w-[60%] lg:w-[14%]">
                <HeaderCadastro />
              </div>
              <div className="w-[100%] itens-center mt-2 ml-2 sm:mt-0 md:flex md:justify-start flex-col lg:w-[80%]">
                <div className="flex gap-2 flex-wrap w-full justify-center md:justify-start">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Buscar usuário"
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

                  <ButtonComponent
                    startIcon={<AddCircle fontSize="small" />}
                    title={"Cadastrar"}
                    subtitle={"Cadastrar"}
                    buttonSize="large"
                    onClick={ModalCadastro}
                  />
                </div>
                <div>
                  <TableComponent
                    showPagination={false}
                    headers={headerUsuario}
                    rows={cadastrosUsuarios(usuarios)}
                    actionCalls={{
                      edit: ModalEditar,
                    }}
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
          title="Cadastrar Usuário"
        >
          <div className="overflow-y-auto overflow-x-hidden max-h-[300px]">
            <div className="mt-4 flex gap-3 flex-wrap">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Nome Completo*"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" } }}
                autoComplete="off"
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
                label="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" } }}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Senha*"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                sx={{ width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" } }}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Password />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="w-[100%] mt-2 flex items-end justify-end">
                <ButtonComponent
                  title={"Cadastrar"}
                  loading={loading}
                  disabled={!nome.trim() || !email.trim() || !senha.trim()}
                  subtitle={"Cadastrar"}
                  startIcon={<Save />}
                />
              </div>
            </div>
          </div>
        </CentralModal>

        <ModalLateral
          open={editar}
          handleClose={ModalEditarFecha}
          tituloModal="Editar Usuário"
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
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" },
                  }}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Senha*"
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  sx={{
                    width: { xs: "95%", sm: "95%", md: "40%", lg: "100%" },
                  }}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Password />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <div className="w-[100%] mt-2 flex items-end justify-end">
                  <ButtonComponent
                    title={"Salvar"}
                    loading={loading}
                    disabled={!nome.trim() || !email.trim() || !senha.trim()}
                    subtitle={"Cadastrar"}
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

export default Usuario;
