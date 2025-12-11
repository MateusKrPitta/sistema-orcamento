import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DvrIcon from "@mui/icons-material/Dvr";
import { Article, Assignment } from "@mui/icons-material";
import LogoOficial from "../../../assets/png/logo-verde.png";

const Navbar = () => {
  const [activeRoute, setActiveRoute] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = (route) => {
    navigate(route);
    sessionStorage.setItem("page", route);
    setActiveRoute(route);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveRoute(currentPath);
    sessionStorage.setItem("page", currentPath);
  }, [location]);

  return (
    <div className="hidden sm:hidden md:hidden lg:block fixed top-0 left-0 z-[9999]">
      <div className="lg:block hidden">
        <div
          className="transition-all duration-500 bg-primary h-screen bg-cover bg-no-repeat bg-center flex flex-col p-4 overflow-hidden"
          style={{ width: "200px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full items-center flex justify-center">
            <img
              style={{ width: "50%", borderRadius: "10%" }}
              src={LogoOficial}
              alt="Logo"
            />
          </div>

          <div className="mb-1">
            <label className="text-sm mb-2 font-bold text-black">Funções</label>
          </div>

          <div className="flex w-full flex-col gap-2 text-black font-bold overflow-hidden">
            <button
              onClick={() => handleNavigate("/dashboard")}
              className={`flex items-center bg-white font-bold bg-opacity-20 rounded p-3 px-2 py-2 gap-2 text-xs transition-all duration-300 hover:bg-opacity-40 hover:scale-[1.02] ${
                activeRoute.startsWith("/dashboard")
                  ? "border border-solid border-black bg-white bg-opacity-60"
                  : "border border-transparent"
              }`}
              title="Dashboard"
            >
              <DashboardIcon fontSize="small" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigate("/orcamentos")}
              className={`flex items-center bg-white font-bold bg-opacity-20 rounded p-3 px-2 py-2 gap-2 text-xs transition-all duration-300 hover:bg-opacity-40 hover:scale-[1.02] ${
                activeRoute.startsWith("/orcamentos")
                  ? "border border-solid border-black bg-white bg-opacity-60"
                  : "border border-transparent"
              }`}
              title="CRM Cobrança"
            >
              <DvrIcon fontSize="small" />
              <span>Orçamentos</span>
            </button>

            <button
              onClick={() => handleNavigate("/proposta-comercial")}
              className={`flex items-center bg-white font-bold bg-opacity-20 rounded p-3 px-2 py-2 gap-2 text-xs transition-all duration-300 hover:bg-opacity-40 hover:scale-[1.02] ${
                activeRoute.startsWith("/proposta-comercial")
                  ? "border border-solid border-black bg-white bg-opacity-60"
                  : "border border-transparent"
              }`}
              title="Proposta Comercial"
            >
              <Article fontSize="small" />
              <span>Proposta Comercial</span>
            </button>

            <div className="">
              <label className="text-black text-sm">Configurações</label>
            </div>

            <button
              onClick={() => handleNavigate("/cadastro")}
              className={`flex items-center bg-white font-bold bg-opacity-20 rounded p-3 px-2 py-2 gap-2 text-xs transition-all duration-300 hover:bg-opacity-40 hover:scale-[1.02] ${
                activeRoute.startsWith("/cadastro")
                  ? "border border-solid border-black bg-white bg-opacity-60"
                  : "border border-transparent"
              }`}
              title="Cadastro"
            >
              <Assignment fontSize="small" />
              <span>Cadastro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
