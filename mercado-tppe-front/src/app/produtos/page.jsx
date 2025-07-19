// src/app/produtos/ProdutosPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css"; // Certifique-se de que este é o caminho correto para seu CSS

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // NOVOS ESTADOS PARA O MODAL DE CONFIRMAÇÃO
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false); // Novo estado para o loading da exclusão
  const [deleteMessage, setDeleteMessage] = useState(""); // Nova mensagem para o feedback da exclusão

  const router = useRouter();

  const API_URL = "https://mercado-tppe.onrender.com/produtos/produtos";

  // Função para buscar produtos (já existente)
  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError(
          "Não foi possível carregar os produtos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCadastrarProduto = () => {
    console.log("Botão 'Cadastrar Produto' clicado!");
    router.push("/produtos/criar");
  };

  const handleEdit = (produtoId) => {
    console.log(`Editar produto com ID: ${produtoId}`);
    router.push(`/produtos/editar/${produtoId}`);
  };

  // MODIFICADO: Esta função agora ABRE o modal de confirmação
  const handleDeleteClick = (produtoId) => {
    setProductIdToDelete(produtoId); // Armazena o ID do produto a ser excluído
    setShowConfirmModal(true); // Exibe o modal
    setDeleteMessage(""); // Limpa qualquer mensagem anterior
  };

  // NOVA FUNÇÃO: Cancela a exclusão e fecha o modal
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setProductIdToDelete(null);
    setDeleteLoading(false);
    setDeleteMessage("");
  };

  // NOVA FUNÇÃO: Confirma a exclusão e faz a chamada à API
  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return; // Garante que há um ID para deletar

    setDeleteLoading(true);
    setDeleteMessage("Excluindo produto...");

    try {
      const response = await fetch(`${API_URL}/${productIdToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage("Produto excluído com sucesso!");
        // Remove o produto da lista local após a exclusão bem-sucedida
        setProdutos(produtos.filter((p) => p.id !== productIdToDelete));
        setTimeout(() => {
          handleCancelDelete(); // Fecha o modal e limpa os estados após um tempo
        }, 1500); // Exibe a mensagem de sucesso por 1.5 segundos
      } else {
        const errorData = await response.json();
        let errorMessage = "Erro ao excluir produto.";

        // Tentativa de extrair mensagem de erro mais detalhada
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

  const filteredProdutos = produtos.filter((produto) => {
    const term = searchTerm.toLowerCase();
    return (
      produto.nome?.toLowerCase().includes(term) ||
      produto.descricao?.toLowerCase().includes(term) ||
      String(produto.id).includes(term)
    );
  });

  return (
    <div className="products-page-container">
      {/* Seção: Título, Pesquisa e Botão Cadastrar Produto */}
      <div className="products-header-section">
        <div className="products-title-group">
          <div className="products-page-title">Produtos</div>
          <div className="products-base-subtitle">Base de Produtos</div>
        </div>
        <div className="products-search-button-group">
          <div className="products-search-input-wrapper">
            <input
              type="text"
              className="products-search-input"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img
              className="products-search-icon"
              src="/search.png"
              alt="Pesquisar"
            />
          </div>
          <button
            className="products-add-button"
            onClick={handleCadastrarProduto}
          >
            <div className="products-add-button-text">Cadastrar Produto</div>
          </button>
        </div>
      </div>

      {/* Seção da Tabela de Produtos */}
      <div className="products-table-section">
        {/* Cabeçalho da Tabela */}
        <div className="products-table-header-row">
          <div className="product-id-header-cell">
            <div className="product-id-text">ID</div>
          </div>
          <div className="product-name-header-cell">
            <div className="product-name-text">Nome</div>
          </div>
          <div className="product-description-header-cell">
            <div className="product-description-text">Descrição</div>
          </div>
          <div className="product-value-header-cell">
            <div className="product-value-text">Valor</div>
          </div>
          <div className="product-profit-header-cell">
            <div className="product-profit-text">Lucro %</div>
          </div>
          <div className="product-stock-header-cell">
            <div className="product-stock-text">Estoque</div>
          </div>
          <div className="product-actions-header-cell">
            <div className="product-actions-text">Ações</div>
          </div>
        </div>

        {/* Linhas da Tabela (dados dinâmicos) */}
        {loading && (
          <div className="product-loading-message">Carregando produtos...</div>
        )}
        {error && <div className="product-error-message">{error}</div>}
        {!loading && !error && filteredProdutos.length === 0 && (
          <div className="product-no-results-message">
            Nenhum produto encontrado.
          </div>
        )}

        {!loading &&
          !error &&
          filteredProdutos.map((produto, index) => (
            <div
              className={`product-data-row ${
                index % 2 === 0 ? "product-row-even" : "product-row-odd"
              }`}
              key={produto.id || index}
            >
              <div className="product-id-data-cell">
                <div className="product-id-value">{produto.id}</div>
              </div>
              <div className="product-name-data-cell">
                <div className="product-name-value">{produto.nome}</div>
              </div>
              <div className="product-description-data-cell">
                <div className="product-description-value">
                  {produto.descricao}
                </div>
              </div>
              <div className="product-value-data-cell">
                <div className="product-value-value">
                  {produto.valor?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
              <div className="product-profit-data-cell">
                <div className="product-profit-value">
                  {produto.lucro_percentual}%
                </div>
              </div>
              <div className="product-stock-data-cell">
                <div className="product-stock-value">{produto.qtd_estoque}</div>
              </div>
              <div className="product-actions-data-cell">
                <div className="product-edit-button-wrapper">
                  <button
                    type="button"
                    className="product-action-button"
                    onClick={() => handleEdit(produto.id)}
                    title={`Editar produto ${produto.nome}`}
                  >
                    <img
                      className="product-edit-icon"
                      src="/edit.png"
                      alt="Editar"
                    />
                  </button>
                </div>
                {/* MODIFICADO: Chama handleDeleteClick para abrir o modal */}
                <div className="product-delete-button-wrapper">
                  <button
                    type="button"
                    className="product-action-button delete" // Adicione a classe 'delete' para o estilo vermelho
                    onClick={() => handleDeleteClick(produto.id)}
                    title={`Excluir produto ${produto.nome}`}
                  >
                    <img
                      className="product-delete-icon"
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
          {" "}
          {/* Fundo escuro do modal */}
          <div className="c-onfirma-cadastro-protudo">
            <div className="headline">
              <div className="t-tulo">Confirmar Exclusão de Produto</div>{" "}
              {/* Título ajustado */}
            </div>
            <div className="frame-625011">
              <div className="erro-questao">
                <div className="frame-624944">
                  <div className="descri-o">
                    Tem certeza de que deseja excluir o produto de ID:
                    {productIdToDelete}?
                    <br />
                    Esta ação não pode ser desfeita.
                  </div>
                </div>
              </div>
              {deleteMessage && ( // Exibe mensagem de loading/erro/sucesso
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
