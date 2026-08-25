import React from "react";

export const metadata = {
  title: "Royal Carnes | A Experiência Suprema do Churrasco em sua Casa",
  description: "Cortes nobres selecionados pelos maiores mestres churrasqueiros, maturados à perfeição (Wagyu A5, Dry-Aged e Angus).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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
                  if (mode === 'dark') {
                    document.documentElement.style.backgroundColor = '#0B0908';
                    document.documentElement.style.color = '#F5F3EF';
                  } else {
                    document.documentElement.style.backgroundColor = '#FCFBF7';
                    document.documentElement.style.color = '#1A1A1A';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0B0908", fontFamily: "'Inter', sans-serif", color: "#F5F3EF" }}>
        {children}
      </body>
    </html>
  );
}
