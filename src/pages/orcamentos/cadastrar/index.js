import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { AddCircle, Save } from "@mui/icons-material";
import ButtonComponent from "../../../components/button";
import CentralModal from "../../../components/modal-central";
import { criarOrcamento } from "../../../services/post/orcamento";
import CustomToast from "../../../components/toast";
import { criarCliente } from "../../../services/post/cliente";
import InformacoesGerais from "./informacoes-gerais";
import DadosCliente from "./dados-cliente";
import ResponsavelOrcamento from "./responsavel";
import ProdutosOrcamento from "./produtos";
import FormasPagamentoOrcamento from "./forma-pagamento";

const CadastrarOrcamento = ({ onSuccess }) => {
  const [dataEmissao, setDataEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [dataEmissaoErro, setDataEmissaoErro] = useState(false);
  const [validadeErro, setValidadeErro] = useState(false);
  const [setor, setSetor] = useState("");

  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [enderecoCliente, setEnderecoCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [clienteExistente, setClienteExistente] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [nomeClienteErro, setNomeClienteErro] = useState(false);
  const [telefoneClienteErro, setTelefoneClienteErro] = useState(false);
  const [telefoneClienteFormatado, setTelefoneClienteFormatado] = useState("");

  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [emailResponsavel, setEmailResponsavel] = useState("");
  const [telefoneResponsavelFormatado, setTelefoneResponsavelFormatado] =
    useState("");

  const [produtos, setProdutos] = useState([]);
  const [subTotalGeral, setSubTotalGeral] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [imposto, setImposto] = useState(0);
  const [frete, setFrete] = useState(0);
  const [observacoesProdutos, setObservacoesProdutos] = useState("");
  const [totalGeral, setTotalGeral] = useState(0);
  const [descontoFormatado, setDescontoFormatado] = useState("");
  const [impostoFormatado, setImpostoFormatado] = useState("");
  const [freteFormatado, setFreteFormatado] = useState("");

  const [cadastrandoProduto, setCadastrandoProduto] = useState(false);

  const [tipoPagamento, setTipoPagamento] = useState("");
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [observacoesPagamento, setObservacoesPagamento] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [numeroConta, setNumeroConta] = useState("");
  const [tipoPagamentoErro, setTipoPagamentoErro] = useState(false);

  const [loadingCadastroCliente, setLoadingCadastroCliente] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [cadastro, setCadastro] = useState(false);

  useEffect(() => {
    if (statusSelecionado === "em_andamento" && validade) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = validade.split('-');
      if (ano && mes && dia) {
        const dataValidade = new Date(ano, mes - 1, dia);
        if (dataValidade < hoje) {
          setStatusSelecionado("pendente_ligacao");
          CustomToast({
            type: "info",
            message: "O status foi alterado para Pendente pois a validade foi ultrapassada.",
          });
        }
      }
    }
  }, [validade, statusSelecionado]);

  const ModalCadastro = () => {
    setCadastro(true);
  };

  const ModalFecha = () => {
    setCadastro(false);
    limparCampos();
  };

  const limparCampos = () => {
    setDataEmissao("");
    setValidade("");
    setStatusSelecionado("");
    setCategoriaSelecionada(null);
    setSetor("");
    setDataEmissaoErro(false);
    setValidadeErro(false);

    setNomeCliente("");
    setTelefoneCliente("");
    setEnderecoCliente("");
    setEmailCliente("");
    setClienteExistente(null);
    setClienteSelecionado(null);
    setClienteId(null);
    setNomeClienteErro(false);
    setTelefoneClienteErro(false);
    setTelefoneClienteFormatado("");

    setNomeResponsavel("");
    setTelefoneResponsavel("");
    setEmailResponsavel("");
    setTelefoneResponsavelFormatado("");

    setProdutos([]);
    setSubTotalGeral(0);
    setDesconto(0);
    setImposto(0);
    setFrete(0);
    setObservacoesProdutos("");
    setTotalGeral(0);
    setDescontoFormatado("");
    setImpostoFormatado("");
    setFreteFormatado("");

    setTipoPagamento("");
    setPrazoEntrega("");
    setObservacoesPagamento("");
    setDataPagamento("");
    setNumeroConta("");
    setTipoPagamentoErro(false);
  };

  const cadastrarClientePrimeiro = async () => {
    if (clienteSelecionado && clienteSelecionado.id) {
      return clienteSelecionado.id;
    }

    setLoadingCadastroCliente(true);
    try {
      const resultado = await criarCliente(
        nomeCliente,
        telefoneCliente,
        emailCliente || null,
        enderecoCliente || null,
      );

      if (resultado.success) {
        const clienteCriado = resultado.data.data;
        setClienteId(clienteCriado.id);

        CustomToast({
          type: "success",
          message: `Cliente "${nomeCliente}" cadastrado com sucesso!`,
        });

        return clienteCriado.id;
      } else {
        CustomToast({
          type: "error",
          message: resultado.message || "Erro ao cadastrar cliente",
        });
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      CustomToast({
        type: "error",
        message: "Erro ao cadastrar cliente",
      });
    } finally {
      setLoadingCadastroCliente(false);
    }

    return null;
  };

  const CadastrarOrcamento = async () => {
    if (produtos.length === 0) {
      CustomToast({
        type: "warning",
        message: "Adicione pelo menos um produto ao orçamento",
      });
      return;
    }

    if (!validade) {
      setValidadeErro(true);
      CustomToast({
        type: "warning",
        message: "A validade do orçamento é obrigatória",
      });
      return;
    }

    if (!tipoPagamento) {
      setTipoPagamentoErro(true);
      CustomToast({
        type: "warning",
        message: "A forma de pagamento é obrigatória",
      });
      return;
    }

    const clienteIdParaOrcamento = await cadastrarClientePrimeiro();

    if (!clienteIdParaOrcamento) {
      return;
    }

    const itensPrincipais = [];
    const itensAvulsos = [];

    produtos.forEach((prod, index) => {
      if (prod.tipo === "principal") {
        const subitens = produtos
          .filter((p) => p.tipo === "subitem" && p.principalId === prod.id)
          .map((sub) => ({
            produto_id: sub.produto_id || null,
            produto_nome: sub.nome,
            quantidade: sub.quantidade,
            preco_unitario: sub.preco,
            subtotal: sub.subTotal || sub.quantidade * sub.preco,
            observacoes: sub.observacoes || null,
          }));

        itensPrincipais.push({
          id: prod.id,
          produto_id: prod.produto_id || null,
          produto_nome: prod.nome,
          quantidade: prod.quantidade,
          preco_unitario: prod.preco,
          subtotal: prod.subTotal || prod.quantidade * prod.preco,
          observacoes: prod.observacoes || null,
          subitens: subitens.length > 0 ? subitens : undefined,
        });
      } else if (prod.tipo === "normal") {
        itensAvulsos.push({
          produto_id: prod.produto_id || null,
          produto_nome: prod.nome,
          quantidade: prod.quantidade,
          preco_unitario: prod.preco,
          subtotal: prod.subTotal || prod.quantidade * prod.preco,
          observacoes: prod.observacoes || null,
        });
      }
    });

    const dadosOrcamento = {
      cliente_id: clienteIdParaOrcamento,
      categoria_id: categoriaSelecionada?.id || null,
      responsavel_nome: nomeResponsavel || "",
      responsavel_telefone: telefoneResponsavel || "",
      responsavel_email: emailResponsavel || "",
      validade: validade ? `${validade}T23:59:59` : "",
      observacoes: observacoesProdutos || "",
      forma_pagamento_tipo: tipoPagamento,
      prazo_entrega: prazoEntrega ? `${prazoEntrega}T18:00:00` : "",
      forma_pagamento_observacoes: observacoesPagamento || "",
      data_pagamento: dataPagamento ? `${dataPagamento}T12:00:00` : "",
      numero_conta: numeroConta || "",
      setor: setor || "",
      desconto: parseFloat(desconto) || 0,
      imposto: parseFloat(imposto) || 0,
      frete: parseFloat(frete) || 0,
      status: statusSelecionado || "pendente_ligacao",

      itens_principais: itensPrincipais,
      itens_avulsos: itensAvulsos,
    };

    try {
      const resultado = await criarOrcamento(dadosOrcamento);
      if (resultado.success) {
        ModalFecha();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
    }
  };

  return (
    <div>
      <ButtonComponent
        startIcon={<AddCircle fontSize="small" />}
        title={"Cadastrar"}
        subtitle={"Cadastrar"}
        buttonSize="large"
        onClick={ModalCadastro}
      />
      <CentralModal
        tamanhoTitulo={"81%"}
        maxHeight={"90vh"}
        width={"1200px"}
        icon={<AddCircle fontSize="small" />}
        open={cadastro}
        onClose={ModalFecha}
        title="Cadastrar Orçamento"
      >
        <div className="overflow-y-auto overflow-x-hidden ">
          <div className="flex items-start gap-2 w-full flex-wrap">
            <div className=" flex gap-3 flex-wrap w-[100%] items-start ">
              <InformacoesGerais
                dataEmissao={dataEmissao}
                setDataEmissao={setDataEmissao}
                validade={validade}
                setValidade={setValidade}
                statusSelecionado={statusSelecionado}
                setStatusSelecionado={setStatusSelecionado}
                categorias={categorias}
                categoriaSelecionada={categoriaSelecionada}
                setCategoriaSelecionada={setCategoriaSelecionada}
                dataEmissaoErro={dataEmissaoErro}
                setCategorias={setCategorias}
                validadeErro={validadeErro}
                loadingCategorias={loadingCategorias}
                setor={setor}
                setSetor={setSetor}
              />

              <ResponsavelOrcamento
                nomeResponsavel={nomeResponsavel}
                setNomeResponsavel={setNomeResponsavel}
                telefoneResponsavel={telefoneResponsavel}
                setTelefoneResponsavel={setTelefoneResponsavel}
                emailResponsavel={emailResponsavel}
                setEmailResponsavel={setEmailResponsavel}
                telefoneResponsavelFormatado={telefoneResponsavelFormatado}
                setTelefoneResponsavelFormatado={
                  setTelefoneResponsavelFormatado
                }
              />

              <DadosCliente
                nomeCliente={nomeCliente}
                setNomeCliente={setNomeCliente}
                telefoneCliente={telefoneCliente}
                setTelefoneCliente={setTelefoneCliente}
                enderecoCliente={enderecoCliente}
                setEnderecoCliente={setEnderecoCliente}
                emailCliente={emailCliente}
                setEmailCliente={setEmailCliente}
                clienteExistente={clienteExistente}
                setClienteExistente={setClienteExistente}
                clienteSelecionado={clienteSelecionado}
                setClienteSelecionado={setClienteSelecionado}
                clienteId={clienteId}
                setClienteId={setClienteId}
                clientesDisponiveis={clientesDisponiveis}
                setClientesDisponiveis={setClientesDisponiveis}
                nomeClienteErro={nomeClienteErro}
                telefoneClienteErro={telefoneClienteErro}
                telefoneClienteFormatado={telefoneClienteFormatado}
                setTelefoneClienteFormatado={setTelefoneClienteFormatado}
                loadingClientes={loadingClientes}
              />

              <FormasPagamentoOrcamento
                tipoPagamento={tipoPagamento}
                setTipoPagamento={setTipoPagamento}
                prazoEntrega={prazoEntrega}
                setPrazoEntrega={setPrazoEntrega}
                observacoesPagamento={observacoesPagamento}
                setObservacoesPagamento={setObservacoesPagamento}
                tipoPagamentoErro={tipoPagamentoErro}
                dataPagamento={dataPagamento}
                setDataPagamento={setDataPagamento}
                numeroConta={numeroConta}
                setNumeroConta={setNumeroConta}
              />

              <ProdutosOrcamento
                produtos={produtos}
                setProdutos={setProdutos}
                subTotalGeral={subTotalGeral}
                setSubTotalGeral={setSubTotalGeral}
                desconto={desconto}
                setDesconto={setDesconto}
                imposto={imposto}
                setImposto={setImposto}
                frete={frete}
                setFrete={setFrete}
                observacoesProdutos={observacoesProdutos}
                setObservacoesProdutos={setObservacoesProdutos}
                totalGeral={totalGeral}
                setTotalGeral={setTotalGeral}
                descontoFormatado={descontoFormatado}
                setDescontoFormatado={setDescontoFormatado}
                impostoFormatado={impostoFormatado}
                setImpostoFormatado={setImpostoFormatado}
                freteFormatado={freteFormatado}
                setFreteFormatado={setFreteFormatado}
                loadingProdutos={loadingProdutos}
                setCadastrandoProduto={setCadastrandoProduto}
                cadastrandoProduto={cadastrandoProduto}
              />
            </div>
          </div>
          <div className="flex w-[100%] items-center gap-2 justify-end mt-2">
            <ButtonComponent
              startIcon={
                loadingCadastroCliente || cadastrandoProduto ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save fontSize="small" />
                )
              }
              title={
                loadingCadastroCliente
                  ? "Cadastrando Cliente..."
                  : cadastrandoProduto
                    ? "Cadastrando Produto..."
                    : "Cadastrar Orçamento"
              }
              subtitle={
                loadingCadastroCliente
                  ? "Cadastrando Cliente..."
                  : cadastrandoProduto
                    ? "Cadastrando Produto..."
                    : "Cadastrar"
              }
              onClick={CadastrarOrcamento}
              buttonSize="large"
            />
          </div>
        </div>
      </CentralModal>
    </div>
  );
};

export default CadastrarOrcamento;
