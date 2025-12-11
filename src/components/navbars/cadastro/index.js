import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ButtonComponent from "../../button";
import { useNavigate, useLocation } from "react-router-dom";
import { Category, ProductionQuantityLimits, Work } from "@mui/icons-material";

const HeaderCadastro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const savedPermissions = sessionStorage.getItem("permissoes_id");
    if (savedPermissions) {
      try {
        const parsedPermissions = JSON.parse(savedPermissions);
        setPermissions(parsedPermissions);
      } catch (error) {
        console.error("Erro ao parsear permissões:", error);
      }
    }

    const path = location.pathname.split("/cadastro/")[1];
    setActiveSection(path);
  }, [location]);

  const handleNavigation = (section) => {
    setActiveSection(section);
    switch (section) {
      case "usuario":
        navigate("/cadastro/usuario");
        break;
      case "produtos":
        navigate("/cadastro/produtos");
        break;
      case "categoria":
        navigate("/cadastro/categoria");
        break;
      default:
        console.warn(`Seção desconhecida: ${section}`);
        break;
    }
  };

  return (
    <div className="w-[100%] items-center justify-center flex flex-wrap gap-1 lg:justify-start md:gap-1 mb-2 md:h-ss">
      <ButtonComponent
        id="elemento1"
        startIcon={<AccountCircleIcon fontSize="small" />}
        title="Usuário"
        subtitle={"Usuário"}
        buttonSize="large"
        onClick={() => handleNavigation("usuario")}
        isActive={activeSection === "usuario"}
        className={`sm:w-[25%] md:w-[25%] lg:w-[100%] text-xs text-black border border-black ${
          activeSection === "usuario" ? "bg-primary text-black" : ""
        }`}
      />

      <ButtonComponent
        id="elemento2"
        startIcon={<ProductionQuantityLimits fontSize="small" />}
        title="Produtos"
        subtitle={"Produtos"}
        buttonSize="large"
        onClick={() => handleNavigation("produtos")}
        isActive={activeSection === "produtos"}
        className={`sm:w-[25%] md:w-[25%] lg:w-[100%] border border-black ${
          activeSection === "produtos" ? "bg-primary text-black" : ""
        }`}
      />

      <ButtonComponent
        id="elemento3"
        startIcon={<Category fontSize="small" />}
        title="Categoria"
        subtitle={"Categoria"}
        buttonSize="large"
        onClick={() => handleNavigation("categoria")}
        isActive={activeSection === "categoria"}
        className={`sm:w-[25%] md:w-[25%] lg:w-[100%] border border-black ${
          activeSection === "categoria" ? "bg-primary text-black" : ""
        }`}
      />
    </div>
  );
};

export default HeaderCadastro;
