import React, { useState } from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  AttachMoney,
  CheckCircle,
  Description,
  Person,
  TrendingUp,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Dados para o gráfico de orçamentos por mês
  const [budgetData, setBudgetData] = useState([
    { month: "Jan", orcamentos: 12 },
    { month: "Fev", orcamentos: 20 },
    { month: "Mar", orcamentos: 15 },
    { month: "Abr", orcamentos: 18 },
    { month: "Mai", orcamentos: 22 },
    { month: "Jun", orcamentos: 19 },
  ]);

  // Dados para o gráfico de barras
  const [revenueData, setRevenueData] = useState([
    { category: "Produtos", value: 4500 },
    { category: "Serviços", value: 3200 },
    { category: "Consultoria", value: 2800 },
    { category: "Manutenção", value: 1900 },
  ]);

  // Métricas principais
  const [metrics, setMetrics] = useState({
    quantidadeGrande: 52,
    valorTotal: 1780,
    quantidadeAprovada: 10,
    volumeTotal: 400,
    orcamentosRealizados: 95,
  });

  // Estado para acompanhar mês selecionado
  const [selectedMonth, setSelectedMonth] = useState("Fevereiro");

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, active: true },
    { name: "Orçamentos", icon: <AttachMoney /> },
    { name: "Proposta Comercial", icon: <Description /> },
    { name: "Cadastro", icon: <Person /> },
  ];

  // Função para mudar o mês no gráfico
  const handleMonthChange = (direction) => {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
    const currentIndex = months.indexOf(selectedMonth);
    let newIndex;

    if (direction === "next") {
      newIndex = currentIndex < months.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : months.length - 1;
    }

    setSelectedMonth(months[newIndex]);
  };

  return (
    <div className="w-full flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Navbar />

      {/* Conteúdo principal */}
      <div className="flex flex-col w-full ml-0 lg:ml-[200px]">
        {/* Header fixo com Menu Mobile e Perfil */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <MenuMobile />
          <HeaderPerfil />
        </div>

        {/* Conteúdo da página com padding */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="w-full p-4 lg:p-6"
        >
          {/* Cabeçalho */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 mt-4 lg:mt-2">
            <h1 className="text-primary font-bold text-2xl flex gap-2 items-center">
              <DashboardIcon className="text-primary" />
              Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Quantidade Grande */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-xsm font-medium">
                  Quantidade Grande
                </h3>
                <TrendingUp className="text-green-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {metrics.quantidadeGrande}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    +12% vs mês anterior
                  </p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowDropUp />
                  <span>5.2%</span>
                </div>
              </div>
            </motion.div>

            {/* Valor Total */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">Valor Total</h3>
                <AttachMoney className="text-green-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    R${" "}
                    {metrics.valorTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">Total acumulado</p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowDropUp />
                  <span>8.1%</span>
                </div>
              </div>
            </motion.div>

            {/* Quantidade Aprovada */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">
                  Quantidade Aprovada
                </h3>
                <CheckCircle className="text-purple-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {metrics.quantidadeAprovada}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Taxa de aprovação: 85%
                  </p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowDropUp />
                  <span>3.4%</span>
                </div>
              </div>
            </motion.div>

            {/* Volume Total */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">Volume Total</h3>
                <TrendingUp className="text-orange-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    R${" "}
                    {metrics.volumeTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">Volume aprovado</p>
                </div>
                <div className="flex items-center text-red-500">
                  <ArrowDropDown />
                  <span>2.1%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gráficos e informações adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de orçamentos por mês */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Orçamentos Realizados por Mês
                </h2>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} orçamentos`,
                        "Quantidade",
                      ]}
                      labelStyle={{ color: "#5f7527" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orcamentos"
                      stroke="#a3cb39"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de distribuição de receita */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Distribuição por categoria
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `R$ ${value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`,
                        "Valor",
                      ]}
                      labelStyle={{ color: "#5f7527" }}
                    />
                    <Bar dataKey="value" fill="#a3cb39" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
