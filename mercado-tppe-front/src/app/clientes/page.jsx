// src/app/clientes/ClientesPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css"; // Certifique-se de que este é o caminho correto para seu CSS

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // NOVOS ESTADOS PARA O MODAL DE CONFIRMAÇÃO (clientes)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clienteCpfToDelete, setClienteCpfToDelete] = useState(null); // Usaremos CPF para deletar
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const router = useRouter();

  const API_URL = "https://mercado-tppe.onrender.com/clientes/clientes"; // API de Clientes

  useEffect(() => {
    async function fetchClientes() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setError(
          "Não foi possível carregar os clientes. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
    const blurActiveElement = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    blurActiveElement();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCadastrarCliente = () => {
    console.log("Botão 'Cadastrar Cliente' clicado!");
    router.push("/clientes/criar");
  };

  const handleEdit = (clienteCpf) => {
    console.log(`Editar cliente com CPF: ${clienteCpf}`);
    router.push(`/clientes/editar/${clienteCpf}`);
  };

  // MODIFICADO: Esta função agora ABRE o modal de confirmação para clientes
  const handleDeleteClick = (clienteCpf) => {
    setClienteCpfToDelete(clienteCpf); // Armazena o CPF do cliente a ser excluído
    setShowConfirmModal(true); // Exibe o modal
    setDeleteMessage(""); // Limpa qualquer mensagem anterior
  };

  // NOVA FUNÇÃO: Cancela a exclusão de cliente e fecha o modal
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setClienteCpfToDelete(null);
    setDeleteLoading(false);
    setDeleteMessage("");
  };

  // NOVA FUNÇÃO: Confirma a exclusão de cliente e faz a chamada à API
  const handleConfirmDelete = async () => {
    if (!clienteCpfToDelete) return; // Garante que há um CPF para deletar

    setDeleteLoading(true);
    setDeleteMessage("Excluindo cliente...");

    try {
      const response = await fetch(`${API_URL}/${clienteCpfToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage("Cliente excluído com sucesso!");
        // Remove o cliente da lista local após a exclusão bem-sucedida
        setClientes(clientes.filter((c) => c.cpf !== clienteCpfToDelete));
        setTimeout(() => {
          handleCancelDelete(); // Fecha o modal e limpa os estados após um tempo
        }, 1500); // Exibe a mensagem de sucesso por 1.5 segundos
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao excluir cliente.";

        if (errorData && typeof errorData === "object") {
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
        setDeleteMessage(`Erro: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Erro na requisição de exclusão:", err);
      setDeleteMessage("Não foi possível conectar ao servidor para excluir.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredClients = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase();
    return (
      cliente.nome?.toLowerCase().includes(term) ||
      cliente.cpf?.includes(term) ||
      cliente.telefone?.includes(term) ||
      cliente.endereco?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="gest-o-de-clientes">
      {/* Nova Seção: Título, Pesquisa e Botão Cadastrar Cliente */}
      <div className="frame-625033">
        <div className="frame-625031">
          <div className="clientes-title">Clientes</div>
          <div className="base-de-clientes">Base de Clientes</div>
        </div>
        <div className="frame-625032">
          <div className="group-24">
            <input
              type="text"
              className="rectangle-31"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img className="search-1" src="/search.png" alt="Pesquisar" />
          </div>
          <button
            className="botao-novo-cliente"
            onClick={handleCadastrarCliente}
          >
            <div className="cadastrar-cliente">Cadastrar Cliente</div>
          </button>
        </div>
      </div>

      {/* Seção da Tabela de Clientes */}
      <div className="frame-625026">
        {/* Cabeçalho da Tabela */}
        <div className="frame-625024">
          <div className="frame-625018">
            <div className="nome-completo">Nome Completo</div>
          </div>
          <div className="frame-625019">
            <div className="cpf">CPF</div>
          </div>
          <div className="frame-625021">
            <div className="telefone">Telefone</div>
          </div>
          <div className="frame-625022">
            <div className="endere-o">Endereço</div>
          </div>
          <div className="frame-625023">
            <div className="a-es">Ações</div>
          </div>
        </div>

        {/* Linhas da Tabela (dados dinâmicos) */}
        {loading && (
          <div className="loading-message">Carregando clientes...</div>
        )}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && filteredClients.length === 0 && (
          <div className="no-clients-message">Nenhum cliente encontrado.</div>
        )}

        {!loading &&
          !error &&
          filteredClients.map((cliente, index) => (
            <div
              className={`frame-6250232 ${
                index % 2 === 0 ? "frame-row-even" : "frame-row-odd"
              }`}
              key={cliente.cpf || index}
            >
              <div className="frame-6250182">
                <div className="olivia-pontes">{cliente.nome}</div>
              </div>
              <div className="frame-6250192">
                <div className="_06688513255">{cliente.cpf}</div>
              </div>
              <div className="frame-6250212">
                <div className="_61-991082000">{cliente.telefone}</div>
              </div>
              <div className="frame-6250222">
                <div className="r-fict-cia-456-b-imagin-rio-cidade-exemplo-uf-cep-98765-432">
                  {cliente.endereco}
                </div>
              </div>
              <div className="frame-6250233">
                <div className="product-edit-button-wrapper">
                  {" "}
                  {/* Reutilizando classes de estilo de produto */}
                  <button
                    type="button"
                    className="product-action-button"
                    onClick={() => handleEdit(cliente.cpf)}
                    title={`Editar cliente ${cliente.nome}`}
                  >
                    <img
                      className="product-edit-icon"
                      src="/edit.png"
                      alt="Editar"
                    />
                  </button>
                </div>
                <div className="frame-625025">
                  {" "}
                  {/* Este é o wrapper do botão de delete */}
                  <button
                    type="button"
                    className="product-action-button delete" // Reutilizando classes de estilo de produto e adicionando 'delete'
                    onClick={() => handleDeleteClick(cliente.cpf)} // Chama a nova função
                    title={`Excluir cliente ${cliente.nome}`}
                  >
                    <img
                      className="delete" // Esta classe pode ser mais específica para o ícone de cliente se precisar
                      src="/delete.png"
                      alt="Excluir"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* NOVO: Modal de Confirmação (RENDERIZA CONDICIONALMENTE) */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="c-onfirma-cadastro-protudo">
            <div className="headline">
              <div className="t-tulo">Confirmar Exclusão de Cliente</div>{" "}
              {/* Título ajustado */}
            </div>
            <div className="frame-625011">
              <div className="erro-questao">
                <div className="frame-624944">
                  <div className="descri-o">
                    Tem certeza de que deseja excluir o cliente com CPF:
                    {clienteCpfToDelete}?
                    <br />
                    Esta ação não pode ser desfeita.
                  </div>
                </div>
              </div>
              {deleteMessage && (
                <div
                  className={`delete-message ${
                    deleteMessage.includes("sucesso") ? "success" : "error"
                  }`}
                >
                  {deleteMessage}
                </div>
              )}
              <div className="botoes-apagar">
                <button
                  type="button"
                  className="frame-625012" // Botão "Cancelar"
                  onClick={handleCancelDelete}
                  disabled={deleteLoading}
                >
                  <div className="text">Cancelar</div>
                </button>
                <button
                  type="button"
                  className="confirmar-deletar" // CLASSE VERMELHA para confirmar exclusão
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                >
                  <div className="text2">
                    {deleteLoading ? "Excluindo..." : "Confirmar Exclusão"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
