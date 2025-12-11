import { Print } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import CentralModal from "../../../components/modal-central";
import ButtonComponent from "../../../components/button";
import ImagemCabecalho from "../../../assets/png/cabecalho.png";

const ImprimirOrcamento = () => {
  const [imprimir, setImprimir] = useState(false);
  const contentRef = useRef(null);

  const ModalImprimir = () => {
    setImprimir(true);
  };

  const ModalFecha = () => {
    setImprimir(false);
  };

  const handlePrint = () => {
    if (contentRef.current) {
      // Cria uma nova janela para impressão
      const printWindow = window.open("", "_blank");

      // Obtém o conteúdo do modal
      const content = contentRef.current.innerHTML;

      // Estilos para impressão
      const printStyles = `
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-xs { font-size: 12px; }
            .text-sm { font-size: 14px; }
            .border-t { border-top: 1px solid #000; }
            .pt-4 { padding-top: 16px; }
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
            .w-35 { width: 35%; }
            .w-60 { width: 60%; }
            .gap-2 { gap: 8px; }
            .italic { font-style: italic; }
            .bg-gray-100 { background-color: #f3f4f6; }
          }
        </style>
      `;

      // Conteúdo completo para impressão
      const printContent = `
        <html>
          <head>
            <title>Orçamento - ADEAGRO</title>
            ${printStyles}
          </head>
          <body onload="window.print(); window.close();">
            <div style="padding: 20px;">
              ${content}
            </div>
          </body>
        </html>
      `;

      // Escreve o conteúdo na nova janela
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex w-[97%]  items-end justify-end">
      <ButtonComponent
        startIcon={<Print fontSize="small" />}
        title={"Imprimir"}
        subtitle={"Imprimir"}
        buttonSize="large"
        onClick={ModalImprimir}
      />

      <CentralModal
        tamanhoTitulo={"81%"}
        maxHeight={"90vh"}
        width={"800px"}
        icon={<Print fontSize="small" />}
        open={imprimir}
        onClose={ModalFecha}
        title="Cadastro Proposta Comercial"
      >
        <div
          className="flex flex-col gap-4 w-full"
          style={{ direction: "ltr" }}
        >
          {/* Botão de impressão */}
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

          {/* Conteúdo do orçamento com ref */}
          <div ref={contentRef}>
            <div className="flex flex-col w-full gap-2">
              <img className="w-full" src={ImagemCabecalho} alt="Cabeçalho" />

              {/* Informações do pedido */}
              <div className="flex items-start w-full mt-4 border-t pt-4">
                <div className="flex flex-col gap-2 w-[50%]">
                  <label className="text-black text-xs font-semibold">
                    DATA SOLICITAÇÃO: 13/1/2025
                  </label>
                  <label className="text-black text-xs font-semibold">
                    CLIENTE: ADEAGRO - CLAUDINEI
                  </label>
                  <label className="text-black text-xs font-semibold">
                    CONDIÇÃO DE PAGAMENTO: A COMBINAR
                  </label>
                </div>
                <div className="flex flex-col gap-2 w-[49%]">
                  <label className="text-black text-xs font-semibold">
                    PRAZO DE ENTREGA: 30 DIAS
                  </label>
                  <label className="text-black text-xs font-semibold">
                    RESPONSÁVEL: RENATO
                  </label>
                  <label className="text-black text-xs font-semibold">
                    ORÇAMENTO: 15465
                  </label>
                </div>
              </div>

              {/* Tabela de itens */}
              <div className="mt-6">
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left w-12">
                        Nº
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        ITEM/DESCRIÇÃO
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-16">
                        QTD
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-24">
                        VALOR UNITÁRIO
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-24">
                        SUB-TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">1</td>
                      <td className="border border-gray-300 p-2">
                        NUMERO DE FROTA PLOTADO EM PRETO
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        138
                      </td>
                      <td className="border border-gray-300 p-2">R$ 6,30</td>
                      <td className="border border-gray-300 p-2">R$ 869,40</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">2</td>
                      <td className="border border-gray-300 p-2">
                        LOGO GRANDE 27X27
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        140
                      </td>
                      <td className="border border-gray-300 p-2">R$ 20,00</td>
                      <td className="border border-gray-300 p-2">
                        R$ 2.800,00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totais */}
              <div className="mt-6">
                <div className="text-center mb-4">
                  <p className="text-sm italic">
                    Excelência em cada detalhe, compromisso em cada entrega
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <div className="w-[60%]">
                    <p className="text-black text-xs font-semibold mb-2">
                      OBSERVAÇÕES:
                    </p>
                    <p className="text-black text-xs">DESCONTO 10 %</p>
                  </div>
                  <div className="w-[35%]">
                    <div className="mb-2">
                      <p className="text-black text-sm font-bold">
                        TOTAL PRODUTOS:{" "}
                        <span className="float-right">R$ 3.669,40</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-black text-sm font-bold">
                        TOTAL PEDIDO:{" "}
                        <span className="float-right">R$ 3.669,40</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="mt-8 pt-4 border-t text-center">
                <p className="text-xs">
                  RUA JOSÉ CAMILO PEREIRA, Nº 471 - POLO EMPALBINO MÂNICA -
                  VINHEMA/MS
                </p>
              </div>
            </div>
          </div>
        </div>
      </CentralModal>
    </div>
  );
};

export default ImprimirOrcamento;
