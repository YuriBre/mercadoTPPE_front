import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link"; // Import para criar links de navegação

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mercadinho Poc Poc",
  description: "Sistema de gestão para pequenos mercados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* === Navbar Global === */}
        <header className="navbar">
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
          <nav className="navbar-menu">
            <Link href="/" className="menu-item">Início</Link>
            <Link href="/produtos" className="menu-item">Produtos</Link>
            <Link href="/clientes" className="menu-item">Clientes</Link>
            <Link href="/vendedores" className="menu-item">Vendedores</Link>
            <Link href="/vendas" className="menu-item">Vendas</Link>
          </nav>
        </header>

        {/* Espaço para não esconder conteúdo atrás da navbar */}
        <main style={{ paddingTop: "90px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

