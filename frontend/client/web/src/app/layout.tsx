import React from "react";
import { AppearOnScrollRuntime } from "../design-system/AppearOnScrollRuntime";

export const metadata = {
  title: "Royal Carnes | Assinaturas, Box e Delivery para churrasco",
  description: "Produtos para churrasco, assinaturas fechadas, Royal Box mensal personalizada e Royal Delivery avulso.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('royal_prime_theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', mode);
                  var isDark = mode === 'dark';
                  var bg = isDark ? '#0B0908' : '#FCFBF7';
                  var color = isDark ? '#E8E1DE' : '#1A1A1A';
                  document.documentElement.style.backgroundColor = bg;
                  document.documentElement.style.color = color;
                } catch (e) {}
              })();
            `
          }}
        />
        <style>{`
          :root {
            --theme-bg: #0B0908;
            --theme-text: #E8E1DE;
            --theme-surface: #151312;
            --theme-surface-container: #1A1817;
            --theme-border: #2A2624;
            --theme-copper: #B87333;
            --theme-text-muted: #D4C4B0;
          }
          html[data-theme="light"] {
            --theme-bg: #FCFBF7;
            --theme-text: #1A1A1A;
            --theme-surface: #FCFBF7;
            --theme-surface-container: #F2F1ED;
            --theme-border: #D1D1D1;
            --theme-copper: #B87333;
            --theme-text-muted: #4A4A4A;
          }
          html, body {
            background-color: var(--theme-bg) !important;
            color: var(--theme-text) !important;
            transition: background-color 0.25s ease, color 0.25s ease;
          }
          .appear-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .appear-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', sans-serif" }}>
        <AppearOnScrollRuntime />
        {children}
      </body>
    </html>
  );
}
