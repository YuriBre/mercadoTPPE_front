// src/app/vendedores/VendedoresPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter para navegação
import "./style.css"; // Ajuste o caminho para seu arquivo CSS

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a pesquisa

  // NOVOS ESTADOS PARA O MODAL DE CONFIRMAÇÃO
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vendedorCpfToDelete, setVendedorCpfToDelete] = useState(null); // Usaremos CPF para deletar
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const router = useRouter(); // Inicializa o hook useRouter

  const API_URL = "https://mercado-tppe.onrender.com/vendedores/vendedores"; // URL da API de vendedores

  useEffect(() => {
    async function fetchVendedores() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        setVendedores(data);
      } catch (err) {
        console.error("Erro ao buscar vendedores:", err);
        setError(
          "Não foi possível carregar os vendedores. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVendedores();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCadastrarVendedor = () => {
    // Função para cadastrar vendedor
    console.log("Botão 'Cadastrar Vendedor' clicado!");
    router.push("/vendedores/criar"); // Navega para a página de criação de vendedor. Ajuste o caminho conforme sua rota.
  };

  const handleEdit = (vendedorCpf) => {
    // Usando CPF como identificador
    console.log(`Editar vendedor com CPF: ${vendedorCpf}`);
    router.push(`/vendedores/editar/${vendedorCpf}`);
  };

  // MODIFICADO: Esta função agora ABRE o modal de confirmação
  const handleDeleteClick = (vendedorCpf) => {
    setVendedorCpfToDelete(vendedorCpf); // Armazena o CPF do vendedor a ser excluído
    setShowConfirmModal(true); // Exibe o modal
    setDeleteMessage(""); // Limpa qualquer mensagem anterior
  };

  // NOVA FUNÇÃO: Cancela a exclusão de vendedor e fecha o modal
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setVendedorCpfToDelete(null);
    setDeleteLoading(false);
    setDeleteMessage("");
  };

  // NOVA FUNÇÃO: Confirma a exclusão de vendedor e faz a chamada à API
  const handleConfirmDelete = async () => {
    if (!vendedorCpfToDelete) return; // Garante que há um CPF para deletar

    setDeleteLoading(true);
    setDeleteMessage("Excluindo vendedor...");

    try {
      const response = await fetch(`${API_URL}/${vendedorCpfToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage("Vendedor excluído com sucesso!");
        // Remove o vendedor da lista local após a exclusão bem-sucedida
        setVendedores(vendedores.filter((v) => v.cpf !== vendedorCpfToDelete));
        setTimeout(() => {
          handleCancelDelete(); // Fecha o modal e limpa os estados após um tempo
        }, 1500); // Exibe a mensagem de sucesso por 1.5 segundos
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao excluir vendedor.";

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

  // Filtra vendedores pelo CPF, nome, email ou telefone
  const filteredVendedores = vendedores.filter((vendedor) => {
    const term = searchTerm.toLowerCase();
    return (
      vendedor.cpf?.includes(term) ||
      vendedor.nome?.toLowerCase().includes(term) ||
      vendedor.email?.toLowerCase().includes(term) ||
      vendedor.telefone?.includes(term)
    );
  });

  return (
    <div className="sellers-page-container">
      {/* Seção: Título, Pesquisa e Botão Cadastrar Vendedor */}
      <div className="sellers-header-section">
        <div className="sellers-title-group">
          <div className="sellers-page-title">Vendedores</div>
          <div className="sellers-base-subtitle">Base de Vendedores</div>
        </div>
        <div className="sellers-search-button-group">
          <div className="sellers-search-input-wrapper">
            <input
              type="text"
              className="sellers-search-input"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img
              className="sellers-search-icon"
              src="/search.png"
              alt="Pesquisar"
            />
          </div>
          <button
            className="sellers-add-button"
            onClick={handleCadastrarVendedor}
          >
            <div className="sellers-add-button-text">Cadastrar Vendedor</div>
          </button>
        </div>
      </div>

      {/* Seção da Tabela de Vendedores */}
      <div className="sellers-table-section">
        {/* Cabeçalho da Tabela */}
        <div className="sellers-table-header-row">
          {/* Colunas do cabeçalho da tabela de vendedores */}
          <div className="seller-cpf-header-cell">
            <div className="seller-cpf-text">CPF</div>
          </div>
          <div className="seller-name-header-cell">
            <div className="seller-name-text">Nome</div>
          </div>
          <div className="seller-email-header-cell">
            <div className="seller-email-text">E-mail</div>
          </div>
          <div className="seller-phone-header-cell">
            <div className="seller-phone-text">Telefone</div>
          </div>
          <div className="seller-actions-header-cell">
            <div className="seller-actions-text">Ações</div>
          </div>
        </div>

        {/* Linhas da Tabela (dados dinâmicos) */}
        {loading && (
          <div className="seller-loading-message">Carregando vendedores...</div>
        )}
        {error && <div className="seller-error-message">{error}</div>}
        {!loading && !error && filteredVendedores.length === 0 && (
          <div className="seller-no-results-message">
            Nenhum vendedor encontrado.
          </div>
        )}

        {!loading &&
          !error &&
          filteredVendedores.map((vendedor, index) => (
            <div
              className={`seller-data-row ${
                index % 2 === 0 ? "seller-row-even" : "seller-row-odd"
              }`}
              key={vendedor.cpf || index} // Usando CPF como key, ou index como fallback
            >
              {/* Células de dados da tabela de vendedores */}
              <div className="seller-cpf-data-cell">
                <div className="seller-cpf-value">{vendedor.cpf}</div>
              </div>
              <div className="seller-name-data-cell">
                <div className="seller-name-value">{vendedor.nome}</div>
              </div>
              <div className="seller-email-data-cell">
                <div className="seller-email-value">{vendedor.email}</div>
              </div>
              <div className="seller-phone-data-cell">
                <div className="seller-phone-value">{vendedor.telefone}</div>
              </div>
              <div className="seller-actions-data-cell">
                {/* Botão de Editar */}
                <div className="seller-edit-button-wrapper">
                  <button
                    type="button"
                    className="seller-action-button" // Nova classe para estilização do botão
                    onClick={() => handleEdit(vendedor.cpf)}
                    title={`Editar vendedor ${vendedor.nome}`}
                  >
                    <img
                      className="seller-edit-icon"
                      src="/edit.png"
                      alt="Editar"
                    />
                  </button>
                </div>
                {/* Botão de Excluir (MODIFICADO para abrir o modal) */}
                <div className="seller-delete-button-wrapper">
                  <button
                    type="button"
                    className="seller-action-button delete" // Adicione a classe 'delete' para o estilo vermelho
                    onClick={() => handleDeleteClick(vendedor.cpf)} // Chama a nova função
                    title={`Excluir vendedor ${vendedor.nome}`}
                  >
                    <img
                      className="seller-delete-icon"
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
              <div className="t-tulo">Confirmar Exclusão de Vendedor</div>{" "}
              {/* Título ajustado */}
            </div>
            <div className="frame-625011">
              <div className="erro-questao">
                <div className="frame-624944">
                  <div className="descri-o">
                    Tem certeza de que deseja excluir o vendedor com CPF:
                    {vendedorCpfToDelete}?
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
                  disabled={deleteLoading} // Desabilita durante a exclusão
                >
                  <div className="text">Cancelar</div>
                </button>
                <button
                  type="button"
                  className="confirmar-deletar" // NOVA CLASSE para o botão vermelho de Confirmar
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading} // Desabilita durante a exclusão
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
