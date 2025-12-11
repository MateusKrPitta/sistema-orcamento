import React from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import { Assignment } from "@mui/icons-material";
import HeaderCadastro from "../../components/navbars/cadastro";
import ImagemCadastro from "../../assets/png/cadastro.png";
const Cadastro = () => {
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
          className="w-full p-4"
        >
          <div className="flex flex-col  justify-between items-start mb-6 lg:mb-8 mt-4 lg:mt-2">
            <h1 className="text-primary font-bold text-xl flex gap-2 items-center">
              <Assignment />
              Cadastro
            </h1>
            <div className=" items-center justify-center lg:justify-start w-full flex mt-2 gap-2 flex-wrap md:items-start ">
              <div className="w-[100%] md:w-[60%] lg:w-[14%]">
                <HeaderCadastro />
              </div>
              <div className="flex items-center justify-center gap-4 flex-col w-[70%]">
                <img style={{ width: "40%" }} src={ImagemCadastro}></img>
                <label className="text-xl text-primary font-bold">
                  Selecione uma opção do menu!
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
