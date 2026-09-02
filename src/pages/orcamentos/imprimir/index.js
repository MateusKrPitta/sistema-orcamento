import React, { useState, useRef } from "react";
import CentralModal from "../../../components/modal-central";
import ButtonComponent from "../../../components/button";
import { Print } from "@mui/icons-material";
import ImagemCabecalho from "../../../assets/png/cabecalho.png";

const ImprimirOrcamento = ({ dadosOrcamento, open, onClose }) => {
  const contentRef = useRef(null);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  const getStatusTexto = (status) => {
    const statusMap = {
      pendente_ligacao: "Pendente Ligação",
      em_andamento: "Em Andamento",
      venda_concluida: "Venda Concluída",
      cancelado: "Cancelado",
      em_orcamento: "Em Orçamento",
      producao: "Produção",
      entregue: "Entregue",
    };
    return statusMap[status] || status;
  };

  const getFormaPagamentoTexto = (tipo) => {
    const formasPagamento = {
      dinheiro: "Dinheiro",
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
      transferencia: "Transferência Bancária",
      boleto: "Boleto Bancário",
      pix: "PIX",
      cheque: "Cheque",
      a_combinar: "A Combinar",
      deposito_bancario: "Depósito Bancário",
    };
    return formasPagamento[tipo] || tipo;
  };

  // Função para achatar todos os itens (principais com subitens + avulsos)
  const achatarItens = () => {
    if (!dadosOrcamento) return [];

    const itensAchatados = [];
    let contador = 1;

    // Processa itens principais e seus subitens
    if (
      dadosOrcamento.itens_principais &&
      dadosOrcamento.itens_principais.length > 0
    ) {
      dadosOrcamento.itens_principais.forEach((itemPrincipal) => {
        // Adiciona o item principal
        itensAchatados.push({
          id: `principal-${itemPrincipal.id}`,
          numero: contador++,
          nome: itemPrincipal.produto_nome,
          quantidade: itemPrincipal.quantidade,
          preco_unitario: itemPrincipal.preco_unitario,
          subtotal: itemPrincipal.subtotal,
          observacoes: itemPrincipal.observacoes,
          tipo: "principal",
        });

        // Adiciona os subitens
        if (itemPrincipal.subitens && itemPrincipal.subitens.length > 0) {
          itemPrincipal.subitens.forEach((subitem) => {
            itensAchatados.push({
              id: `subitem-${subitem.id}`,
              numero: contador++,
              nome: `   ↳ ${subitem.produto_nome}`, // Identação visual para subitens
              quantidade: subitem.quantidade,
              preco_unitario: subitem.preco_unitario,
              subtotal: subitem.subtotal,
              observacoes: subitem.observacoes,
              tipo: "subitem",
              itemPai: itemPrincipal.produto_nome,
            });
          });
        }
      });
    }

    // Processa itens avulsos
    if (
      dadosOrcamento.itens_avulsos &&
      dadosOrcamento.itens_avulsos.length > 0
    ) {
      dadosOrcamento.itens_avulsos.forEach((itemAvulso) => {
        itensAchatados.push({
          id: `avulso-${itemAvulso.id}`,
          numero: contador++,
          nome: itemAvulso.produto_nome,
          quantidade: itemAvulso.quantidade,
          preco_unitario: itemAvulso.preco_unitario,
          subtotal: itemAvulso.subtotal,
          observacoes: itemAvulso.observacoes,
          tipo: "avulso",
        });
      });
    }

    return itensAchatados;
  };

  const handlePrint = () => {
    if (contentRef.current) {
      const printWindow = window.open("", "_blank");

      const content = contentRef.current.innerHTML;

      const printStyles = `
        <style>
          @media print {
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #000; padding: 8px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .text-xs { font-size: 12px; }
            .text-sm { font-size: 14px; }
            .text-lg { font-size: 18px; }
            .border-t { border-top: 1px solid #000; }
            .border-b { border-bottom: 1px solid #000; }
            .pt-4 { padding-top: 16px; }
            .mt-2 { margin-top: 8px; }
            .mt-4 { margin-top: 16px; }
            .mt-6 { margin-top: 24px; }
            .mt-8 { margin-top: 32px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .w-full { width: 100%; }
            .w-50 { width: 50%; }
            .w-100 { width: 100%; }
            .gap-2 { gap: 8px; }
            .italic { font-style: italic; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-primary { background-color: #f0f7ff; }
            .nowrap { white-space: nowrap; }
            .pl-4 { padding-left: 16px; }
            .subitem { padding-left: 20px; font-style: italic; }
          }
        </style>
      `;

      const printContent = `
        <html>
          <head>
            <title>Orçamento ${dadosOrcamento?.numero || ""} - ${
              dadosOrcamento?.cliente?.nome || "Cliente"
            }</title>
            ${printStyles}
          </head>
          <body onload="window.print(); window.close();">
            <div style="padding: 20px;">
              ${content}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const itens = achatarItens();

  return (
    <CentralModal
      tamanhoTitulo={"81%"}
      maxHeight={"90vh"}
      width={"800px"}
      icon={<Print fontSize="small" />}
      open={open}
      onClose={onClose}
      title={`Orçamento ${dadosOrcamento?.numero || ""}`}
    >
      <div className="flex flex-col gap-4 w-full" style={{ direction: "ltr" }}>
        <div className="flex justify-end mb-4 no-print">
          <ButtonComponent
            startIcon={<Print fontSize="small" />}
            title={"Imprimir Orçamento"}
            buttonSize="medium"
            onClick={handlePrint}
            variant="contained"
            color="primary"
          />
        </div>

        {dadosOrcamento ? (
          <div ref={contentRef}>
            <div className="flex flex-col w-full gap-2">
              {/* Cabeçalho */}
              <img className="w-full" src={ImagemCabecalho} alt="Cabeçalho" />

              {/* Informações do Orçamento */}
              <div className="flex justify-between items-start w-full mt-6 border-t pt-4">
                <div className="flex flex-col gap-3 w-[48%]">
                  <div>
                    <label className="text-black text-xs font-bold block ">
                      ORÇAMENTO Nº:
                    </label>
                    <label className="text-black text-sm ">
                      {dadosOrcamento.numero}
                    </label>
                  </div>

                  <div>
                    <label className="text-black text-xs font-bold block ">
                      DATA DE EMISSÃO:
                    </label>
                    <label className="text-black text-sm">
                      {formatarData(dadosOrcamento.data_emissao)}
                    </label>
                  </div>

                  <div>
                    <label className="text-black text-xs font-bold block ">
                      VALIDADE:
                    </label>
                    <label className="text-black text-sm">
                      {formatarData(dadosOrcamento.validade)}
                    </label>
                  </div>

                  <div>
                    <label className="text-black text-xs font-bold block ">
                      STATUS:
                    </label>
                    <label className="text-black text-sm">
                      {getStatusTexto(dadosOrcamento.status)}
                    </label>
                    <div className="flex flex-col gap-1">
                      <label className="text-black text-xs font-bold block ">
                        CLIENTE:
                      </label>
                      <label className="text-black text-sm ">
                        {dadosOrcamento.cliente?.nome}
                      </label>
                      <label className="text-black text-xs block mt-1">
                        {dadosOrcamento.cliente?.telefone}
                      </label>
                      <label className="text-black text-xs block">
                        {dadosOrcamento.cliente?.endereco}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-[48%]">
                  <div className="flex flex-col gap-1">
                    <label className="text-black text-xs font-bold mb-1">
                      SOLICITANTE:
                    </label>
                    <label className="text-black text-sm">
                      {dadosOrcamento.responsavel?.nome}
                    </label>
                    <label className="text-black text-xs block mt-1">
                      {dadosOrcamento.responsavel?.telefone}
                    </label>
                    <label className="text-black text-xs block">
                      {dadosOrcamento.responsavel?.email}
                    </label>
                  </div>

                  <div>
                    <label className="text-black text-xs font-bold block ">
                      CATEGORIA:
                    </label>
                    <label className="text-black text-sm">
                      {dadosOrcamento.categoria?.nome}
                    </label>
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento e Prazo de Entrega */}
              <div className="flex justify-between items-start w-full mt-6 border-t pt-4">
                <div className="w-[48%]">
                  <label className="text-black text-xs font-bold block ">
                    FORMA DE PAGAMENTO:
                  </label>
                  <label className="text-black text-sm">
                    {getFormaPagamentoTexto(
                      dadosOrcamento.forma_pagamento?.tipo,
                    )}
                    {dadosOrcamento.forma_pagamento?.tipo === "deposito_bancario" &&
                      dadosOrcamento.forma_pagamento?.numero_conta && (
                        <span> - Conta: {dadosOrcamento.forma_pagamento.numero_conta}</span>
                      )}
                  </label>
                </div>

                <div className="w-[48%]">
                  <label className="text-black text-xs font-bold block ">
                    PRAZO DE ENTREGA:
                  </label>
                  <label className="text-black text-sm">
                    {dadosOrcamento.forma_pagamento?.prazo_entrega
                      ? formatarData(
                          dadosOrcamento.forma_pagamento.prazo_entrega,
                        )
                      : "Não informado"}
                  </label>
                </div>
              </div>

              {/* Tabela de Itens */}
              <div className="mt-6">
                <h3 className="text-black text-sm font-bold mb-3">
                  ITENS DO ORÇAMENTO
                </h3>
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left w-12 text-center">
                        Nº
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        PRODUTO/DESCRIÇÃO
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-16 text-center">
                        QTD
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-24 text-right">
                        VALOR UNITÁRIO
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-24 text-right">
                        SUBTOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.numero}
                        </td>
                        <td
                          className={`border border-gray-300 p-2 ${item.tipo === "subitem" ? "pl-8" : ""}`}
                        >
                          <div
                            className={
                              item.tipo === "subitem" ? "italic" : "font-medium"
                            }
                          >
                            {item.nome}
                          </div>
                          {item.observacoes && (
                            <div className="text-xs text-gray-600 italic">
                              Obs: {item.observacoes}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {parseFloat(item.quantidade).toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {item.tipo === "subitem" ? "-" : formatarMoeda(parseFloat(item.preco_unitario))}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {item.tipo === "subitem" ? "-" : formatarMoeda(parseFloat(item.subtotal))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totais */}
              <div className="mt-6">
                <div className="flex justify-between items-start">
                  <div className="w-[60%]">
                    <div className="mb-2">
                      <p className="text-black text-xs font-bold block ">
                        OBSERVAÇÕES:
                      </p>
                      <p className="text-black text-xs">
                        {dadosOrcamento.observacoes ||
                          "Nenhuma observação registrada."}
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-xs font-bold block ">
                        OBSERVAÇÕES DO PAGAMENTO:
                      </p>
                      <p className="text-black text-xs">
                        {dadosOrcamento.forma_pagamento?.observacoes ||
                          "Nenhuma observação."}
                      </p>
                    </div>
                  </div>

                  <div className="w-[35%]">
                    <div className="mb-2">
                      <p className="text-black text-sm font-bold flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          {formatarMoeda(
                            parseFloat(dadosOrcamento.totais?.subtotal || 0),
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="mb-2">
                      <p className="text-black text-sm flex justify-between">
                        <span>Desconto:</span>
                        <span>
                          {formatarMoeda(
                            parseFloat(dadosOrcamento.totais?.desconto || 0),
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="mb-2">
                      <p className="text-black text-sm flex justify-between">
                        <span>Imposto:</span>
                        <span>
                          {formatarMoeda(
                            parseFloat(dadosOrcamento.totais?.imposto || 0),
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="mb-2">
                      <p className="text-black text-sm flex justify-between">
                        <span>Frete:</span>
                        <span>
                          {formatarMoeda(
                            parseFloat(dadosOrcamento.totais?.frete || 0),
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-black text-lg font-bold flex justify-between">
                        <span>TOTAL GERAL:</span>
                        <span>
                          {formatarMoeda(
                            parseFloat(dadosOrcamento.totais?.total_geral || 0),
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé */}
              <div className="mt-8 pt-4 border-t text-center">
                <p className="text-xs italic">
                  Excelência em cada detalhe, compromisso em cada entrega
                </p>
                <p className="text-xs mt-2">
                  RUA JOSÉ CAMILO PEREIRA, Nº 471 - POLO EMPALBINO MÂNICA -
                  VINHEMA/MS
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhum orçamento selecionado para impressão.
            </p>
          </div>
        )}
      </div>
    </CentralModal>
  );
};

export default ImprimirOrcamento;
