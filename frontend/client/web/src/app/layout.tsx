import React from "react";

export const metadata = {
  title: "PRIME CUT CLUB | Excellence in Every Ember",
  description: "Cortes nobres selecionados pelos maiores mestres churrasqueiros, maturados à perfeição (Wagyu A5, Dry-Aged e Angus).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0B0908", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#E8E1DE" }}>
        {children}
      </body>
    </html>
  );
}
