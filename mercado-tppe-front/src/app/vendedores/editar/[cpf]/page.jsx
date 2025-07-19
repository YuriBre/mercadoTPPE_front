// src/app/vendedores/editar/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../produtos/criar/style.css"; // Reutiliza o CSS de formulários, se os estilos forem genéricos

export default function EditVendedorPage() {
  const router = useRouter();
  const params = useParams();
  const { cpf: vendedorCpfParam } = params; // Captura o CPF do vendedor da URL

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  // REMOVIDO: const [comissaoPercentual, setComissaoPercentual] = useState("");

  const [loading, setLoading] = useState(false); // Para o status de submissão do formulário
  const [fetchingData, setFetchingData] = useState(true); // Para o status de carregamento dos dados do vendedor
  const [message, setMessage] = useState("");

  const API_URL = "https://mercado-tppe.onrender.com/vendedores/vendedores"; // URL base da API de vendedores

  useEffect(() => {
    async function fetchVendedorData() {
      if (!vendedorCpfParam) {
        setFetchingData(false);
        setMessage("CPF do vendedor não fornecido na URL.");
        return;
      }

      setFetchingData(true);
      setMessage("");

      try {
        const response = await fetch(`${API_URL}/${vendedorCpfParam}`);

        if (response.ok) {
          const data = await response.json();
          // Preenche os estados com os dados do vendedor
          setNome(data.nome || "");
          setCpf(data.cpf || "");
          setEmail(data.email || "");
          setTelefone(data.telefone || "");
          // REMOVIDO: setComissaoPercentual(data.comissao_percentual?.toString() || "0");
        } else {
          const errorData = await response.json();
          let errorMessage = "Erro ao carregar dados do vendedor.";

          if (Array.isArray(errorData) && errorData.length > 0) {
            errorMessage = errorData
              .map((err) => err.message || err.detail || "Erro desconhecido")
              .join(", ");
          } else if (errorData && typeof errorData === "object") {
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail
                  .map((err) => err.msg || err.message || "Erro de validação")
                  .join(", ");
              } else if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail;
              }
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (response.statusText) {
              errorMessage = `Erro: ${response.statusText}`;
            }
          }
          setMessage(`Erro ao carregar dados do vendedor: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Erro na requisição para buscar vendedor:", error);
        setMessage(
          "Não foi possível conectar ao servidor para buscar dados do vendedor."
        );
      } finally {
        setFetchingData(false);
      }
    }

    fetchVendedorData();
  }, [vendedorCpfParam]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação básica dos campos (comissaoPercentual removido)
    if (!nome || !cpf || !email || !telefone) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    // Objeto com os dados atualizados do vendedor (comissao_percentual removido)
    const updatedVendedor = {
      nome,
      cpf,
      email,
      telefone,
    };

    try {
      const response = await fetch(`${API_URL}/${vendedorCpfParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVendedor),
      });

      if (response.ok) {
        setMessage("Vendedor atualizado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/vendedores");
        }, 3000);
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao atualizar vendedor.";

        if (Array.isArray(errorData) && errorData.length > 0) {
          errorMessage = errorData
            .map((err) => err.message || err.detail || "Erro desconhecido")
            .join(", ");
        } else if (errorData && typeof errorData === "object") {
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail
                .map((err) => err.msg || err.message || "Erro de validação")
                .join(", ");
            } else if (typeof errorData.detail === "string") {
              errorMessage = errorData.detail;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (response.statusText) {
            errorMessage = `Erro: ${response.statusText}`;
          }
        }
        setMessage(`Erro ao atualizar vendedor: ${errorMessage}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição para atualizar vendedor:", error);
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/vendedores");
  };

  if (fetchingData) {
    return (
      <div className="create-product-page-container">
        <p className="loading-message">Carregando dados do vendedor...</p>
      </div>
    );
  }

  return (
    <div className="create-product-page-container">
      <div className="create-product-form-wrapper">
        <div className="create-product-headline-group">
          <div className="create-product-title">Editar Vendedor</div>
        </div>

        <form onSubmit={handleSubmit} className="product-form-fields-container">
          {/* Campo Nome */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Nome:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Nome completo do vendedor"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo CPF (geralmente não editável se for o ID) */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">CPF:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="CPF do vendedor"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                disabled // Desabilita a edição do CPF se ele for o identificador principal
              />
            </div>
          </div>

          {/* Campo Email */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">E-mail:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="email"
                className="form-input-field"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Telefone */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Telefone:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="tel"
                className="form-input-field"
                placeholder="(XX) XXXXX-XXXX"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* REMOVIDO: Campo Comissão Percentual */}
          {/*
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Comissão Percentual (%):</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number"
                step="0.01"
                className="form-input-field"
                placeholder="Ex: 5 (para 5%)"
                value={comissaoPercentual}
                onChange={(e) => setComissaoPercentual(e.target.value)}
                required
                min="0"
                max="100"
              />
            </div>
          </div>
          */}

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
                {loading ? "Atualizando..." : "Atualizar Vendedor"}
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
      </div>
    </div>
  );
}
