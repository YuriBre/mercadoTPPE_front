// src/app/produtos/criar/CreateProdutoPage.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css"; // Importa o CSS específico para esta página

export default function CreateProdutoPage() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [lucroPercentual, setLucroPercentual] = useState(0); // Novo campo para lucro percentual
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Para mensagens de sucesso/erro

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const newProduct = {
      nome,
      descricao,
      valor: parseFloat(valor),
      qtd_estoque: parseInt(quantidade, 10),
      lucro_percentual: parseFloat(lucroPercentual),
    };

    try {
      const response = await fetch(
        "https://mercado-tppe.onrender.com/produtos/produtos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        setMessage("Produto cadastrado com sucesso!");
        setNome("");
        setDescricao("");
        setValor("");
        setQuantidade("");
        setLucroPercentual(0);

        setTimeout(() => {
          router.push("/produtos");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Erro ao cadastrar produto: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/produtos"); // Volta para a página de listagem de produtos
  };

  return (
    <div className="create-product-page-container">
      <div className="create-product-form-wrapper">
        <div className="create-product-headline-group">
          <div className="create-product-title">Cadastro de Produtos</div>
        </div>

        <form onSubmit={handleSubmit} className="product-form-fields-container">
          {/* Campo Nome do produto */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Nome do produto:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Insira o nome do produto"
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
                className="form-input-field textarea-field" // Adicionado classe para textarea
                placeholder="Descreva o produto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
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
                type="number" // Tipo number para valores monetários
                step="0.01" // Permite centavos
                className="form-input-field"
                placeholder="Insira o valor do produto"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
          </div>

          {/* NOVO CAMPO: Lucro Percentual */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Lucro Percentual:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number"
                step="0.01" // Permite valores decimais para o percentual
                className="form-input-field"
                placeholder="Insira o lucro percentual (ex: 10 para 10%)"
                value={lucroPercentual}
                onChange={(e) => setLucroPercentual(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Quantidade */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Quantidade:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="number" // Tipo number para quantidade
                className="form-input-field"
                placeholder="Insira a quantidade do produto"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
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
                {loading ? "Cadastrando..." : "Cadastrar produto"}
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
