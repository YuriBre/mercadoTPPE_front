// src/app/produtos/editar/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../produtos/criar/style.css"; // Reutiliza o CSS da página de criação de produtos

export default function EditProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const { id: produtoIdParam } = params; // Captura o ID do produto da URL

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(""); // Usaremos string para o input, e converteremos para número
  const [lucroPercentual, setLucroPercentual] = useState(""); // NOVO: Estado para lucro percentual
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(""); // Usaremos string para o input, e converteremos para número

  const [loading, setLoading] = useState(false); // Para o status de submissão do formulário
  const [fetchingData, setFetchingData] = useState(true); // Para o status de carregamento dos dados do produto
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProdutoData() {
      if (!produtoIdParam) return;

      setFetchingData(true);
      setMessage("");

      try {
        const response = await fetch(
          `https://mercado-tppe.onrender.com/produtos/produtos/${produtoIdParam}`
        );

        if (response.ok) {
          const data = await response.json();
          // Preenche os estados com os dados do produto
          setNome(data.nome);
          setDescricao(data.descricao);
          setValor(data.valor?.toString() || "0");
          // NOVO: Preenche o lucro percentual
          setLucroPercentual(data.lucro_percentual?.toString() || "0");
          // CORRIGIDO: Nome do campo da API é 'qtd_estoque'
          setQuantidadeEstoque(data.qtd_estoque?.toString() || "0");
        } else {
          const errorData = await response.json();
          let errorMessage = "Erro ao carregar dados do produto.";

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
          setMessage(`Erro ao carregar dados do produto: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Erro na requisição para buscar produto:", error);
        setMessage(
          "Não foi possível conectar ao servidor para buscar dados do produto."
        );
      } finally {
        setFetchingData(false);
      }
    }

    fetchProdutoData();
  }, [produtoIdParam]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação básica dos campos
    if (
      !nome ||
      !descricao ||
      !valor ||
      !lucroPercentual ||
      !quantidadeEstoque
    ) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const updatedProduto = {
      nome,
      descricao,
      valor: parseFloat(valor),
      // NOVO: Inclui lucro_percentual no objeto a ser enviado
      lucro_percentual: parseFloat(lucroPercentual),
      // CORRIGIDO: Nome do campo para envio para 'qtd_estoque'
      qtd_estoque: parseInt(quantidadeEstoque, 10),
    };

    try {
      const response = await fetch(
        `https://mercado-tppe.onrender.com/produtos/produtos/${produtoIdParam}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduto),
        }
      );

      if (response.ok) {
        setMessage("Produto atualizado com sucesso! Redirecionando...");

        setTimeout(() => {
          router.push("/produtos"); // Volta para a página de listagem de produtos
        }, 5000);
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao atualizar produto.";

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

        setMessage(`Erro ao atualizar produto: ${errorMessage}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na requisição para atualizar produto:", error);
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/produtos"); // Volta para a página de listagem de produtos
  };

  if (fetchingData) {
    return (
      <div className="create-product-page-container">
        <p className="loading-message">
          Carregando dados do produto para edição...
        </p>
      </div>
    );
  }

  return (
    <div className="create-product-page-container">
      <div className="create-product-form-wrapper">
        <div className="create-product-headline-group">
          <div className="create-product-title">Editar Produto</div>
        </div>

        <form onSubmit={handleSubmit} className="product-form-fields-container">
          {/* Campo Nome */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Nome do Produto:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Nome do produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Descrição */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Descrição:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <textarea
                className="form-input-field"
                placeholder="Descrição detalhada do produto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows="4" // Aumenta o número de linhas visíveis
              ></textarea>
            </div>
          </div>

          {/* Campo Valor */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Valor:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number"
                step="0.01" // Permite valores decimais (centavos)
                className="form-input-field"
                placeholder="Valor do produto"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
          </div>

          {/* NOVO: Campo Lucro Percentual */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Lucro Percentual (%):</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number"
                step="0.01" // Permite valores decimais para percentual
                className="form-input-field"
                placeholder="Ex: 20.5 (para 20.5%)"
                value={lucroPercentual}
                onChange={(e) => setLucroPercentual(e.target.value)}
                required
                min="0" // Lucro mínimo 0%
                max="1000" // Limite superior razoável, ajuste se precisar
              />
            </div>
          </div>

          {/* Campo Quantidade em Estoque */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Quantidade em Estoque:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number"
                className="form-input-field"
                placeholder="Quantidade em estoque"
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(e.target.value)}
                min="0" // Quantidade mínima 0
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
                {loading ? "Atualizando..." : "Atualizar Produto"}
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
