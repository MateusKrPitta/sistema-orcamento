import React, { useState } from "react";
import logoOficial from "../../assets/png/logo.png";
import { useNavigate } from "react-router-dom";
import {
  Dashboard,
  Dvr,
  Menu,
  Inventory2,
  Assignment,
  ExitToApp,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

const MenuMobile = () => {
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie =
        name +
        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
        window.location.hostname;
    }
  };

  const clearAllStorage = () => {
    if (window.indexedDB) {
      window.indexedDB.databases().then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }

    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
    if (window.caches) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  };

  const toggleMenu = () => {
    if (!menuOpen) {
      setMenuOpen(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setMenuOpen(false);
      }, 300);
    }
  };

  const handleNavigate = (route) => {
    setIsAnimating(false);
    setMenuOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    setLogout(false);
    setLoading(true);

    const originalPushState = window.history.pushState;
    window.history.pushState = function () {};

    try {
      clearAllCookies();
      clearAllStorage();

      window.dispatchEvent(
        new CustomEvent("authChange", {
          detail: { isAuthenticated: false },
        })
      );
      setTimeout(() => {
        navigate("/login", { replace: true });
        setTimeout(() => {
          setLoading(false);
          window.location.reload();
        }, 100);
      }, 500);
    } finally {
      setTimeout(() => {
        window.history.pushState = originalPushState;
      }, 1000);
    }
  };

  return (
    <div
      className="w-full flex items-center justify-between p-2 z-30 md:flex lg:hidden relative"
      style={{ backgroundColor: "#006b33" }}
    >
      <div className="flex-1 flex justify-center">
        <div
          className="flex justify-center cursor-pointer"
          onClick={() => handleNavigate("/dashboard")}
        >
          <img
            src={logoOficial}
            alt="Logo"
            title="Clique para acessar a Dashboard"
            className="w-24"
          />
        </div>
      </div>

      <div className="absolute right-2">
        <IconButton onClick={toggleMenu} style={{ color: "#ffff" }}>
          <Menu fontSize="small" />
        </IconButton>
      </div>

      {menuOpen && (
        <div
          className={`absolute top-12 left-0 w-full bg-white text-black ml-8 rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2"
          }`}
        >
          <div className="flex flex-col p-2">
            <button
              onClick={() => handleNavigate("/home")}
              className="flex items-center gap-2 p-2 font-bold text-primary hover:bg-gray-200 transition-colors duration-200"
            >
              <Dashboard style={{ color: "#006b33" }} fontSize="small" />
              Home
            </button>

            <button
              onClick={() => handleNavigate("/crm-cobranca")}
              className="flex items-center gap-2 p-2 font-bold text-primary hover:bg-gray-200 transition-colors duration-200"
            >
              <Dvr style={{ color: "#006b33" }} fontSize="small" />
              CRM Cobrança
            </button>

            <button
              onClick={() => handleNavigate("/cadastro")}
              className="flex items-center gap-2 p-2 font-bold text-primary hover:bg-gray-200 transition-colors duration-200"
            >
              <Assignment style={{ color: "#006b33" }} fontSize="small" />
              Cadastro
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 font-bold text-primary hover:bg-gray-200 transition-colors duration-200"
            >
              <ExitToApp style={{ color: "#006b33" }} fontSize="small" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuMobile;
