import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Cadastro from "../pages/cadastro";
import Usuario from "../pages/cadastro/usuario";
import Produtos from "../pages/cadastro/produtos";
import Categoria from "../pages/cadastro/categoria";
import Orcamentos from "../pages/orcamentos";
import PropostaComercial from "../pages/proposta-comercial";

const appRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/orcamentos", element: <Orcamentos /> },
  { path: "/proposta-comercial", element: <PropostaComercial /> },
  { path: "/cadastro", element: <Cadastro /> },
  { path: "/cadastro/usuario", element: <Usuario /> },
  { path: "/cadastro/produtos", element: <Produtos /> },
  { path: "/cadastro/categoria", element: <Categoria /> },
  { path: "/", element: <Login /> },
];

const RoutesApp = () => (
  <BrowserRouter>
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  </BrowserRouter>
);

export default RoutesApp;
