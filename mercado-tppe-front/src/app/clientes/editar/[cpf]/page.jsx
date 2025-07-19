// src/app/clientes/editar/[cpf]/EditClientePage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../criar/style.css"; // Reutiliza o CSS da página de criação

export default function EditClientePage() {
  const router = useRouter();
  const params = useParams(); // Para acessar os parâmetros da URL, como o CPF
  const { cpf: clienteCpfParam } = params; // Renomeia 'cpf' de params para 'clienteCpfParam' para evitar conflito com estado 'cpf'

  // Estados para os campos do formulário
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");

  const [loading, setLoading] = useState(false); // Para o status de submissão do formulário
  const [fetchingData, setFetchingData] = useState(true); // Para o status de carregamento dos dados do cliente
  const [message, setMessage] = useState("");

  // Efeito para buscar os dados do cliente quando a página carrega
  useEffect(() => {
    async function fetchClienteData() {
      if (!clienteCpfParam) return; // Garante que o CPF esteja disponível na URL

      setFetchingData(true);
      setMessage("");

      try {
        const response = await fetch(
          `https://mercado-tppe.onrender.com/clientes/clientes/${clienteCpfParam}`
        );

        if (response.ok) {
          const data = await response.json();
          // Preenche os estados com os dados do cliente
          setCpf(data.cpf);
          setNome(data.nome);
          setEndereco(data.endereco);
          setTelefone(data.telefone);
        } else {
          const errorData = await response.json();
          setMessage(
            `Erro ao carregar dados do cliente: ${
              errorData.detail || errorData.message || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error("Erro na requisição para buscar cliente:", error);
        setMessage(
          "Não foi possível conectar ao servidor para buscar dados do cliente."
        );
      } finally {
        setFetchingData(false);
      }
    }

    fetchClienteData();
  }, [clienteCpfParam]); // Dependência: executa quando o CPF da URL muda

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

    const updatedClient = {
      cpf,
      nome,
      endereco,
      telefone,
    };

    try {
      // Requisição PUT para atualizar o cliente
      const response = await fetch(
        `https://mercado-tppe.onrender.com/clientes/clientes/${clienteCpfParam}`,
        {
          method: "PUT", // MÉTODO PUT PARA EDIÇÃO
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedClient),
        }
      );

      if (response.ok) {
        setMessage("Cliente atualizado com sucesso! Redirecionando...");
        // Não limpamos o formulário na edição, pois ele já tem os dados editados.
        // Apenas redirecionamos.

        setTimeout(() => {
          router.push("/clientes"); // Volta para a página de listagem de clientes
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Erro ao atualizar cliente: ${
            errorData.detail || errorData.message || response.statusText
          }`
        );
        setLoading(false); // Para o loading em caso de erro na API
      }
    } catch (error) {
      console.error("Erro na requisição para atualizar cliente:", error);
      setMessage("Não foi possível conectar ao servidor. Tente novamente.");
      setLoading(false); // Para o loading em caso de erro de rede
    }
  };

  const handleCancel = () => {
    router.push("/clientes"); // Volta para a página de listagem de clientes
  };

  if (fetchingData) {
    return (
      <div className="create-client-page-container">
        <p className="loading-message">
          Carregando dados do cliente para edição...
        </p>
      </div>
    );
  }

  return (
    <div className="create-client-page-container">
      <div className="create-client-form-wrapper">
        <div className="create-client-headline-group">
          <div className="create-client-title">Editar Cliente</div>
        </div>

        <form onSubmit={handleSubmit} className="client-form-fields-container">
          {/* Campo CPF (pode ser readonly se o CPF não for editável na API) */}
          <div className="form-text-box">
            <label className="form-label">
              <span className="label-text">CPF:</span>
              <span className="required-star">*</span>
            </label>
            <div className="form-input-area">
              <input
                type="text"
                className="form-input-field"
                placeholder="CPF do cliente"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                maxLength="11"
                readOnly // Normalmente o CPF não é editável após o cadastro
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
                placeholder="Nome completo do cliente"
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
                placeholder="Endereço do cliente"
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
                type="tel"
                className="form-input-field"
                placeholder="Telefone do cliente"
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
                {loading ? "Atualizando..." : "Atualizar Cliente"}
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
