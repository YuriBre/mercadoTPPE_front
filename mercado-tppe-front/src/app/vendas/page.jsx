// src/app/vendas/VendasPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter para navegação
import "./style.css"; // Ajuste o caminho para seu arquivo CSS

export default function VendasPage() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a pesquisa

  // NOVOS ESTADOS PARA O MODAL DE CONFIRMAÇÃO
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vendaIdToDelete, setVendaIdToDelete] = useState(null); // Usaremos ID da venda para deletar
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const router = useRouter(); // Inicializa o hook useRouter

  const API_URL = "https://mercado-tppe.onrender.com/vendas/vendas"; // URL da API de vendas

  useEffect(() => {
    async function fetchVendas() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        setVendas(data);
      } catch (err) {
        console.error("Erro ao buscar vendas:", err);
        setError(
          "Não foi possível carregar as vendas. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVendas();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCadastrarVenda = () => {
    console.log("Botão 'Cadastrar Venda' clicado!");
    router.push("/vendas/criar"); // Navega para a página de criação de venda. Ajuste o caminho conforme sua rota.
  };

  // A função handleEdit foi removida, pois o botão de editar será excluído.
  // const handleEdit = (vendaId) => {
  //     console.log(`Editar venda com ID: ${vendaId}`);
  //     // Lógica para editar venda
  //     // Exemplo: router.push(`/vendas/editar/${vendaId}`);
  // };

  // MODIFICADO: Esta função agora ABRE o modal de confirmação
  const handleDeleteClick = (vendaId) => {
    setVendaIdToDelete(vendaId); // Armazena o ID da venda a ser excluída
    setShowConfirmModal(true); // Exibe o modal
    setDeleteMessage(""); // Limpa qualquer mensagem anterior
  };

  // NOVA FUNÇÃO: Cancela a exclusão de venda e fecha o modal
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setVendaIdToDelete(null);
    setDeleteLoading(false);
    setDeleteMessage("");
  };

  // NOVA FUNÇÃO: Confirma a exclusão de venda e faz a chamada à API
  const handleConfirmDelete = async () => {
    if (!vendaIdToDelete) return; // Garante que há um ID para deletar

    setDeleteLoading(true);
    setDeleteMessage("Excluindo venda...");

    try {
      const response = await fetch(`${API_URL}/${vendaIdToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage("Venda excluída com sucesso!");
        // Remove a venda da lista local após a exclusão bem-sucedida
        setVendas(vendas.filter((v) => v.id !== vendaIdToDelete));
        setTimeout(() => {
          handleCancelDelete(); // Fecha o modal e limpa os estados após um tempo
        }, 1500); // Exibe a mensagem de sucesso por 1.5 segundos
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao excluir venda.";

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

  // Filtra vendas pelo ID, CPF do Cliente, CPF do Vendedor ou ID do Produto
  const filteredVendas = vendas.filter((venda) => {
    const term = searchTerm.toLowerCase();
    return (
      String(venda.id || "").includes(term) ||
      venda.cliente_cpf?.toLowerCase().includes(term) ||
      venda.vendedor_cpf?.toLowerCase().includes(term) ||
      String(venda.produto_id || "").includes(term)
    );
  });

  return (
    <div className="sales-page-container">
      {/* Seção: Título, Pesquisa e Botão Cadastrar Venda */}
      <div className="sales-header-section">
        <div className="sales-title-group">
          <div className="sales-page-title">Vendas</div>
          <div className="sales-base-subtitle">Base de Vendas</div>
        </div>
        <div className="sales-search-button-group">
          <div className="sales-search-input-wrapper">
            <input
              type="text"
              className="sales-search-input"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img
              className="sales-search-icon"
              src="/search.png"
              alt="Pesquisar"
            />
          </div>
          <button className="sales-add-button" onClick={handleCadastrarVenda}>
            <div className="sales-add-button-text">Cadastrar Venda</div>
          </button>
        </div>
      </div>

      {/* Seção da Tabela de Vendas */}
      <div className="sales-table-section">
        {/* Cabeçalho da Tabela */}
        <div className="sales-table-header-row">
          {/* Colunas do cabeçalho da tabela de vendas */}
          <div className="sale-id-header-cell">
            <div className="sale-id-text">ID</div>
          </div>
          <div className="sale-client-cpf-header-cell">
            <div className="sale-client-cpf-text">CPF Cliente</div>
          </div>
          <div className="sale-seller-cpf-header-cell">
            <div className="sale-seller-cpf-text">CPF Vendedor</div>
          </div>
          <div className="sale-product-id-header-cell">
            <div className="sale-product-id-text">ID Produto</div>
          </div>
          <div className="sale-quantity-header-cell">
            <div className="sale-quantity-text">Quantidade</div>
          </div>
          <div className="sale-total-value-header-cell">
            <div className="sale-total-value-text">Valor Total</div>
          </div>
          <div className="sale-actions-header-cell">
            <div className="sale-actions-text">Ações</div>
          </div>
        </div>

        {/* Linhas da Tabela (dados dinâmicos) */}
        {loading && (
          <div className="sale-loading-message">Carregando vendas...</div>
        )}
        {error && <div className="sale-error-message">{error}</div>}
        {!loading && !error && filteredVendas.length === 0 && (
          <div className="sale-no-results-message">
            Nenhuma venda encontrada.
          </div>
        )}

        {!loading &&
          !error &&
          filteredVendas.map((venda) => (
            <div
              className={`sale-data-row ${
                venda.id % 2 === 0 ? "sale-row-even" : "sale-row-odd" // Usando venda.id para alternar cores se for numérico
              }`}
              key={venda.id} // CORREÇÃO: Usar venda.id como key, que é único e estável
            >
              {/* Células de dados da tabela de vendas */}
              <div className="sale-id-data-cell">
                <div className="sale-id-value">{venda.id}</div>
              </div>
              <div className="sale-client-cpf-data-cell">
                <div className="sale-client-cpf-value">{venda.cliente_cpf}</div>
              </div>
              <div className="sale-seller-cpf-data-cell">
                <div className="sale-seller-cpf-value">
                  {venda.vendedor_cpf}
                </div>
              </div>
              <div className="sale-product-id-data-cell">
                <div className="sale-product-id-value">{venda.produto_id}</div>
              </div>
              <div className="sale-quantity-data-cell">
                <div className="sale-quantity-value">{venda.quantidade}</div>
              </div>
              <div className="sale-total-value-data-cell">
                <div className="sale-total-value-value">
                  {venda.valor_total?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
              <div className="sale-actions-data-cell">
                {/* O botão de editar foi removido daqui */}
                <div className="product-delete-button-wrapper">
                  {" "}
                  {/* Reutilizando a classe de produtos para o estilo de bola vermelha */}
                  <button
                    type="button"
                    className="product-action-button" // Reutilizando a classe de produtos para o botão transparente
                    onClick={() => handleDeleteClick(venda.id)} // Chama a nova função para abrir o modal
                    title={`Excluir venda ${venda.id}`}
                  >
                    <img
                      className="product-delete-icon" // Reutilizando a classe de produtos para o ícone
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
              <div className="t-tulo">Confirmar Exclusão de Venda</div>{" "}
              {/* Título ajustado */}
            </div>
            <div className="frame-625011">
              <div className="erro-questao">
                <div className="frame-624944">
                  <div className="descri-o">
                    Tem certeza de que deseja excluir a venda de ID:
                    {vendaIdToDelete}?
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
