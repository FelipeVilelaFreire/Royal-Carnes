# 📝 Notas de Refatoração & Melhorias Futuras: Landing Page

Este documento registra os pontos de polimento e evolução previstos para a **Landing Page do Prime Cut Club**, garantindo rastreabilidade para futuras iterações sem interromper a entrega da aplicação.

## 📌 Checklist de Evolução

- [ ] **Integração Completa de Web Components Nativa (`<ui-button>`, `<ui-card>`)**:
  - Transicionar os primitivos React para componentes nativos Custom Elements com suporte nativo a direct token props (`radius="full"`, `bg="gold"`).

- [ ] **Efeitos Parallax & Animacões de Rolagem Suave**:
  - Adicionar suporte a `IntersectionObserver` para animações sutis de entrada das seções (`fade-on-scroll`).

- [ ] **Otimização Avançada de Mídias & Imagens Otimizadas**:
  - Substituir URLs externas por assets locais tokenizados no manifesto da Landing Page (`assets.heroBg`, `assets.tomahawk`).

- [ ] **Widget Flutuante do WhatsApp**:
  - Incorporar o botão flutuante de atendimento VIP WhatsApp no slot inferior do AppShell quando acionado por configuração (`config.whatsappWidget: true`).

---
*Registrado durante a sprint de entrega do Portal do Assinante.*
