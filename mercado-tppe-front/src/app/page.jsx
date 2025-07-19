import Link from "next/link";

export default function Home() {
  return (
    <div className="page-container">
      <div className="background-highlight"></div>

      <header className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <nav className="navbar-menu">
          <Link href="/" className="menu-item">
            Início
          </Link>
          <Link href="/produtos" className="menu-item">
            Produtos
          </Link>
          <Link href="/clientes" className="menu-item">
            Clientes
          </Link>
          <Link href="/vendedores" className="menu-item">
            Vendedores
          </Link>
          <Link href="/vendas" className="menu-item">
            Vendas
          </Link>
        </nav>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <div className="title-container">
            <h1 className="hero-title">
              Mercadinho
              <br />
              Poc Poc
            </h1>
            <p className="hero-subtitle">
              Gestão simples e completa para o seu mercadinho.
            </p>
          </div>
          <Link href="/vendas/criar" className="primary-button">
            Registrar nova venda
          </Link>
        </div>
        <div className="hero-illustration">
          <img src="/banner.png" className="img-bg" alt="" />
        </div>
      </div>

      <h2 className="section-heading">Portal de Gestão Comercial</h2>

      <section className="gallery-section">
        <Link href="/vendas" className="gallery-item">
          <img src="/image-51.png" className="gallery-image" alt="Produto 1" />
        </Link>
        <Link href="/produtos" className="gallery-item">
          <img src="/image-61.png" className="gallery-image" alt="Produto 2" />
        </Link>
        <Link href="/vendedores" className="gallery-item">
          <img src="/image-71.png" className="gallery-image" alt="Produto 3" />
        </Link>
        <Link href="/clientes" className="gallery-item">
          <img src="/image-81.png" className="gallery-image" alt="Produto 4" />
        </Link>
      </section>
    </div>
  );
}
