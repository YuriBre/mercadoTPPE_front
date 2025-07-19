// src/app/clientes/criar/CreateClientePage.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css"; // Importa o CSS específico para esta página

export default function CreateClientePage() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação básica dos campos
    if (!cpf || !nome || !endereco || !telefone) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const newClient = {
      cpf,
      nome,
      endereco,
      telefone,
    };

    try {
      const response = await fetch(
        "https://mercado-tppe.onrender.com/clientes/clientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClient),
        }
      );

      if (response.ok) {
        setMessage("Cliente cadastrado com sucesso!");
        // Limpar formulário
        setCpf("");
        setNome("");
        setEndereco("");
        setTelefone("");

        setTimeout(() => {
          router.push("/clientes");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Erro ao cadastrar cliente: ${
            errorData.detail || errorData.message || response.statusText
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
    router.push("/clientes"); // Volta para a página de listagem de clientes
  };

  return (
    <div className="create-client-page-container">
      <div className="create-client-form-wrapper">
        <div className="create-client-headline-group">
          <div className="create-client-title">Cadastro de Clientes</div>
        </div>

        <form onSubmit={handleSubmit} className="client-form-fields-container">
          {/* Campo CPF */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">CPF:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Insira o CPF do cliente"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                maxLength="11" // Limita o CPF a 11 caracteres (apenas números)
              />
            </div>
          </div>

          {/* Campo Nome */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Nome do Cliente:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Insira o nome completo do cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Endereço */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Endereço:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Insira o endereço do cliente"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
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
                type="tel" // Tipo 'tel' para telefones
                className="form-input-field"
                placeholder="Insira o telefone do cliente"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
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
                {loading ? "Cadastrando..." : "Cadastrar cliente"}
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
