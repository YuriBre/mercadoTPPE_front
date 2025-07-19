// src/app/vendedores/criar/CreateVendedorPage.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css"; // Importa o CSS específico para esta página

export default function CreateVendedorPage() {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validação básica dos campos
    if (!cpf || !nome || !email || !telefone) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const newVendedor = {
      cpf,
      nome,
      email,
      telefone,
    };

    try {
      const response = await fetch(
        "https://mercado-tppe.onrender.com/vendedores/vendedores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVendedor),
        }
      );

      if (response.ok) {
        setMessage("Vendedor cadastrado com sucesso!");
        // Limpar formulário
        setCpf("");
        setNome("");
        setEmail("");
        setTelefone("");
        // Opcional: navegar de volta para a lista de vendedores
        // router.push('/vendedores');

        setTimeout(() => {
          router.push("/vendedores");
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Erro ao cadastrar vendedor: ${
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
    router.push("/vendedores"); // Volta para a página de listagem de vendedores
  };

  return (
    <div className="create-vendedor-page-container">
      <div className="create-vendedor-form-wrapper">
        <div className="create-vendedor-headline-group">
          <div className="create-vendedor-title">Cadastro de Vendedores</div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="vendedor-form-fields-container"
        >
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
                placeholder="Insira o CPF do vendedor"
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
              <span className="label-text">Nome do Vendedor:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="Insira o nome completo do vendedor"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Email */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">Email:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="email" // Tipo 'email' para validação básica de email
                className="form-input-field"
                placeholder="Insira o email do vendedor"
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
                type="tel" // Tipo 'tel' para telefones
                className="form-input-field"
                placeholder="Insira o telefone do vendedor"
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
                {loading ? "Cadastrando..." : "Cadastrar vendedor"}
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
