// src/app/vendas/criar/CreateVendaPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

export default function CreateVendaPage() {
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [clienteCpf, setClienteCpf] = useState("");
  const [vendedorCpf, setVendedorCpf] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, vendedoresRes, produtosRes] = await Promise.all([
          fetch("https://mercado-tppe.onrender.com/clientes/clientes"),
          fetch("https://mercado-tppe.onrender.com/vendedores/vendedores"),
          fetch("https://mercado-tppe.onrender.com/produtos/produtos"),
        ]);

        const clientesData = await clientesRes.json();
        const vendedoresData = await vendedoresRes.json();
        const produtosData = await produtosRes.json();

        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setVendedores(Array.isArray(vendedoresData) ? vendedoresData : []);
        setProdutos(Array.isArray(produtosData) ? produtosData : []);

        // Set default selected values
        if (clientesData.length > 0) setClienteCpf(clientesData[0].cpf);
        if (vendedoresData.length > 0) setVendedorCpf(vendedoresData[0].cpf);
        if (produtosData.length > 0) setProdutoId(produtosData[0].id);
      } catch (error) {
        console.error("Erro ao carregar dados para dropdowns:", error);
        setMessage(
          "Erro ao carregar opções para seleção. Tente recarregar a página."
        );
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading when form is submitted
    setMessage("");

    if (!clienteCpf || !vendedorCpf || !produtoId || !quantidade) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const newVenda = {
      cliente_cpf: clienteCpf,
      vendedor_cpf: vendedorCpf,
      produto_id: parseInt(produtoId, 10),
      quantidade: parseInt(quantidade, 10),
    };

    try {
      const response = await fetch(
        "https://mercado-tppe.onrender.com/vendas/vendas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVenda),
        }
      );

      if (response.ok) {
        setMessage("Venda registrada com sucesso! Redirecionando...");
        setQuantidade(""); // Clear quantity for new sale

        // Only redirect after timeout, loading stays true until then.
        setTimeout(() => {
          setLoading(false); // Stop loading when redirect happens
          router.push("/vendas");
        }, 5000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Erro ao registrar venda: ${
            errorData.detail || errorData.message || response.statusText
          }`
        );
        setLoading(false); // Stop loading immediately on API error
      }
    } catch (error) {
      // This catch block handles network errors or errors before the response object is even created
      console.error("Erro na requisição:", error);
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
      setLoading(false); // Stop loading immediately on network error
    }
    // No finally block needed for setLoading(false) anymore, it's handled in specific branches
  };

  const handleCancel = () => {
    router.push("/vendas");
  };

  return (
    <div className="create-venda-page-container">
      <div className="create-venda-form-wrapper">
        <div className="create-venda-headline-group">
          <div className="create-venda-title">Registro de Venda</div>
        </div>

        {dataLoading ? (
          <p className="loading-message">Carregando dados para seleção...</p>
        ) : (
          <form onSubmit={handleSubmit} className="venda-form-fields-container">
            {/* CPF do Cliente (Dropdown) */}
            <div className="form-text-box">
              <label className="form-label" htmlFor="clienteCpf">
                <span className="label-text">Cliente (CPF):</span>
                <span className="required-star">*</span>
              </label>
              <div className="form-input-area">
                <select
                  id="clienteCpf"
                  className="form-input-field select-field"
                  value={clienteCpf}
                  onChange={(e) => setClienteCpf(e.target.value)}
                  required
                >
                  {clientes.length === 0 && (
                    <option value="">Nenhum cliente disponível</option>
                  )}
                  {clientes.map((cliente) => (
                    <option key={cliente.cpf} value={cliente.cpf}>
                      {cliente.nome} ({cliente.cpf})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CPF do Vendedor (Dropdown) */}
            <div className="form-text-box">
              <label className="form-label" htmlFor="vendedorCpf">
                <span className="label-text">Vendedor (CPF):</span>
                <span className="required-star">*</span>
              </label>
              <div className="form-input-area">
                <select
                  id="vendedorCpf"
                  className="form-input-field select-field"
                  value={vendedorCpf}
                  onChange={(e) => setVendedorCpf(e.target.value)}
                  required
                >
                  {vendedores.length === 0 && (
                    <option value="">Nenhum vendedor disponível</option>
                  )}
                  {vendedores.map((vendedor) => (
                    <option key={vendedor.cpf} value={vendedor.cpf}>
                      {vendedor.nome} ({vendedor.cpf})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ID do Produto (Dropdown) */}
            <div className="form-text-box">
              <label className="form-label" htmlFor="produtoId">
                <span className="label-text">Produto (ID):</span>
                <span className="required-star">*</span>
              </label>
              <div className="form-input-area">
                <select
                  id="produtoId"
                  className="form-input-field select-field"
                  value={produtoId}
                  onChange={(e) => setProdutoId(e.target.value)}
                  required
                >
                  {produtos.length === 0 && (
                    <option value="">Nenhum produto disponível</option>
                  )}
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} (ID: {produto.id}) - R${" "}
                      {produto.valor?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Campo Quantidade */}
            <div className="form-text-box">
              <label className="form-label" htmlFor="quantidade">
                <span className="label-text">Quantidade:</span>
                <span className="required-star">*</span>
              </label>
              <div className="form-input-area">
                <input
                  type="number"
                  id="quantidade"
                  className="form-input-field"
                  placeholder="Insira a quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Mensagens de feedback */}
            {message && (
              <div
                className={`form-message ${
                  message.includes("sucesso") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="form-buttons-group">
              <button
                type="submit"
                className="primary-large-button"
                disabled={loading}
              >
                <div className="button-text">
                  {loading ? "Registrando..." : "Registrar Venda"}
                </div>
              </button>
              <button
                type="button"
                className="secondary-large-button"
                onClick={handleCancel}
                disabled={loading}
              >
                <div className="button-text">Cancelar</div>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
