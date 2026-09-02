import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbars/header";
import MenuMobile from "../../components/menu-mobile";
import HeaderPerfil from "../../components/navbars/perfil";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  AttachMoney,
  CheckCircle,
  Description,
  TrendingUp,
} from "@mui/icons-material";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CustomToast from "../../components/toast";
import { buscarInformacoesOrcamento } from "../../services/get/informacoes-orcamentos";

const Dashboard = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const [metrics, setMetrics] = useState({
    quantidadeGrande: 0,
    valorTotal: 0,
    quantidadeAprovada: 0,
    volumeTotal: 0,
    orcamentosRealizados: 0,
  });

  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUS_COLORS = {
    pendente_ligacao: "#FFA726",
    em_andamento: "#42A5F5",
    venda_concluida: "#66BB6A",
    cancelado: "#EF5350",
    em_orcamento: "#AB47BC",
    producao: "#26C6DA",
    entregue: "#8D6E63",
  };

  const STATUS_LABELS = {
    pendente_ligacao: "Pendente Ligação",
    em_andamento: "Em Andamento",
    venda_concluida: "Venda Concluída",
    cancelado: "Cancelado",
    em_orcamento: "Em Orçamento",
    producao: "Produção",
    entregue: "Entregue",
  };

  const transformStatusData = useCallback((porStatus) => {
    return Object.keys(porStatus).map((status) => ({
      name: STATUS_LABELS[status] || status,
      value: porStatus[status],
      color: STATUS_COLORS[status] || "#8884d8",
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await buscarInformacoesOrcamento();

        if (response.success && response.data) {
          const data = response.data;

          setMetrics({
            quantidadeGrande: data.total_ativos || 0,
            valorTotal: data.valor_total || 0,
            quantidadeAprovada: data.por_status?.venda_concluida || 0,
            volumeTotal: data.valor_total || 0,
            orcamentosRealizados: data.total_geral || 0,
          });

          if (data.por_status) {
            const transformedData = transformStatusData(data.por_status);
            setStatusData(transformedData);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        CustomToast({
          type: "error",
          message: "Erro ao carregar dados do dashboard",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transformStatusData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculateApprovalRate = () => {
    const total = metrics.orcamentosRealizados;
    const approved = metrics.quantidadeAprovada;
    return total > 0 ? ((approved / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="w-full flex min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col w-full ml-0 lg:ml-[200px]">
          <div className="sticky top-0 z-40 bg-white shadow-sm">
            <MenuMobile />
            <HeaderPerfil />
          </div>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex min-h-screen bg-gray-50">
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
          className="w-full p-4 lg:p-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 mt-4 lg:mt-2">
            <h1 className="text-primary font-bold text-2xl flex gap-2 items-center">
              <DashboardIcon className="text-primary" />
              Dashboard
            </h1>
          </div>

          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Ativos */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">
                  Orçamentos Ativos
                </h3>
                <TrendingUp className="text-blue-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {metrics.quantidadeGrande}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Total de orçamentos em aberto
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Valor Total */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">Valor Total Geral</h3>
                <AttachMoney className="text-green-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(metrics.valorTotal)}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Soma de todos os orçamentos
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vendas Concluídas */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">Vendas Concluídas</h3>
                <CheckCircle className="text-purple-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {metrics.quantidadeAprovada}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Taxa de aprovação: {calculateApprovalRate()}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Total Geral */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-medium">
                  Total de Orçamentos
                </h3>
                <Description className="text-orange-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {metrics.orcamentosRealizados}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Todos os orçamentos criados
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de Pizza - Status dos Orçamentos */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Distribuição por Status
              </h2>
              <div className="h-72">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${(entry.percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} orçamentos`,
                          "Quantidade",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legenda dos Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Detalhamento por Status
              </h2>
              <div className="space-y-4">
                {statusData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">
                        {item.value}
                      </span>
                      <span className="text-gray-500 text-sm">
                        (
                        {(
                          (item.value / metrics.orcamentosRealizados) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
