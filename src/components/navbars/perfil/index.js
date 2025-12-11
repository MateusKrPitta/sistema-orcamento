import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, CircularProgress } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Person } from "@mui/icons-material";
import CentralModal from "../../modal-central";
import ButtonComponent from "../../button";

const HeaderPerfil = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const ModalLogout = () => setLogout(true);
  const ModalFecha = () => setLogout(false);

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
    <>
      <div className="hidden md:flex justify-end w-full">
        <div className="flex items-center justify-end lg:w-[160px] h-12 bg-cover bg-primary rounded-bl-lg">
          <div className="flex items-center mr-4">
            <IconButton onClick={handleMenuOpen} className="p-1">
              <label className="text-xs text-white flex items-center gap-1 font-bold">
                <Person fontSize="small" /> Administrador
              </label>
            </IconButton>
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="p-4"
      >
        <MenuItem title="Sair do sistema" className="flex items-center gap-2">
          <span className="text-xs text-primary">Administrador</span>
        </MenuItem>
        <MenuItem
          onClick={ModalLogout}
          title="Sair do sistema"
          className="flex items-center gap-2"
        >
          <LogoutIcon fontSize="small" className="text-red" /> Sair
        </MenuItem>
      </Menu>

      <CentralModal
        tamanhoTitulo={"81%"}
        maxHeight={"90vh"}
        top={"20%"}
        left={"28%"}
        width={"400px"}
        icon={<LogoutIcon fontSize="small" />}
        open={logout}
        onClose={ModalFecha}
        title="Deseja realmente sair?"
      >
        <div className="mt-4 flex items-center justify-center w-full">
          <ButtonComponent
            onClick={handleLogout}
            startIcon={
              <CheckCircleOutlineIcon
                fontSize="small"
                style={{ marginBottom: "5px" }}
              />
            }
            title={"Sim"}
            subtitle={"Sim"}
            buttonSize="large"
          />
        </div>
      </CentralModal>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center flex-col gap-4 bg-white bg-opacity-50 z-50">
          <div className="text-primary font-semibold text-lg">
            Saindo do sistema...
          </div>
          <CircularProgress sx={{ color: "#006b33" }} />
        </div>
      )}
    </>
  );
};

export default HeaderPerfil;
