import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Cadastro from "../pages/cadastro";
import Usuario from "../pages/cadastro/usuario";
import Produtos from "../pages/cadastro/produtos";
import Categoria from "../pages/cadastro/categoria";
import Orcamentos from "../pages/orcamentos";
import PropostaComercial from "../pages/proposta-comercial";
import CustomToast from "../components/toast";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ProtectedRoute = () => {
  const token = getCookie("auth_token");

  useEffect(() => {
    if (!token) {
      CustomToast({
        type: "warning",
        message: "Sessão expirada ou não autenticada. Por favor, faça login.",
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const RoutesApp = () => (
  <BrowserRouter>
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orcamentos" element={<Orcamentos />} />
        <Route path="/proposta-comercial" element={<PropostaComercial />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro/usuario" element={<Usuario />} />
        <Route path="/cadastro/produtos" element={<Produtos />} />
        <Route path="/cadastro/categoria" element={<Categoria />} />
      </Route>

      {/* Rota fall-back */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default RoutesApp;
