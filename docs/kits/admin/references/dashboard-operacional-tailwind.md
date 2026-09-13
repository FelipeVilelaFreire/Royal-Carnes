# Dashboard Operacional — referência Tailwind recebida

> Colagem de referência visual fornecida pelo usuário. Este arquivo é uma fonte visual de comparação para o Dashboard web; não deve ser importado pelo runtime do RoyalPrime.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Operacional</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script>
    tailwind.config = { theme: { extend: { fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] }, colors: { brand: { charcoal: '#0C0D10', deep: '#121318', surface: '#171922', wine: '#24141E', gold: '#C5A869', goldMuted: '#9B834F', goldSoft: 'rgba(197, 168, 105, 0.12)' } } } } }
  </script>
  <style>
    body { background-color: #0b0c10; background-image: radial-gradient(at 15% 10%, rgba(36, 20, 30, 0.45) 0px, transparent 65%), radial-gradient(at 85% 20%, rgba(45, 27, 24, 0.3) 0px, transparent 60%), radial-gradient(at 50% 90%, rgba(26, 17, 26, 0.35) 0px, transparent 70%); background-attachment: fixed; color: #E2E4E9; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .glass-panel { background: linear-gradient(135deg, rgba(23, 25, 34, 0.72) 0%, rgba(16, 17, 24, 0.75) 100%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36); }
    .glass-card { background: linear-gradient(145deg, rgba(25, 28, 38, 0.65) 0%, rgba(16, 18, 26, 0.7) 100%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3); }
    .glass-card:hover { border-color: rgba(197, 168, 105, 0.2); }
    .status-badge { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.01em; }
  </style>
</head>
<body class="min-h-screen text-[#E1E4EA] p-6 lg:p-10">
  <main class="max-w-[1400px] mx-auto space-y-8">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.05]">
      <div>
        <div class="flex items-center gap-2 mb-1"><span class="w-1.5 h-1.5 rounded-full bg-[#C5A869]"></span><span class="text-xs font-medium tracking-wider uppercase text-[#9B834F]">Visão Executiva</span></div>
        <h1 class="text-2xl lg:text-3xl font-bold tracking-tight text-white">Dashboard Operacional</h1>
        <p class="text-sm text-[#8F94A6] mt-0.5 font-normal">Visão executiva de faturamento, assinantes e entregas</p>
      </div>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="glass-card rounded-xl p-5"><span class="text-xs font-medium uppercase tracking-wider text-[#8F94A6]">Faturamento mensal</span><div class="text-2xl font-bold tracking-tight text-white font-mono">R$ 449,00</div><div class="mt-2.5 text-xs text-[#8F94A6]"><span class="bg-[#C5A869]/70">●</span> 4 pedidos no painel</div></div>
      <div class="glass-card rounded-xl p-5"><span class="text-xs font-medium uppercase tracking-wider text-[#8F94A6]">Assinantes ativos</span><div class="text-2xl font-bold tracking-tight text-white font-mono">1</div><div class="mt-2.5 text-xs text-[#8F94A6]"><span class="text-emerald-500">●</span> 1 assinatura cadastrada</div></div>
      <div class="glass-card rounded-xl p-5"><span class="text-xs font-medium uppercase tracking-wider text-[#8F94A6]">Caixas na fila</span><div class="text-2xl font-bold tracking-tight text-white font-mono">4</div><div class="mt-2.5 text-xs text-[#8F94A6]"><span class="text-sky-500">●</span> 4 entregas em acompanhamento</div></div>
      <div class="glass-card rounded-xl p-5"><span class="text-xs font-medium uppercase tracking-wider text-[#8F94A6]">Taxa de retenção</span><div class="text-2xl font-bold tracking-tight text-white font-mono">100,0%</div><div class="mt-2.5 text-xs text-[#8F94A6]"><span class="text-emerald-500">●</span> Churn estimado de 0,0%</div></div>
    </section>

    <section class="glass-panel rounded-xl border border-white/[0.06] overflow-hidden">
      <div class="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between"><h2 class="text-base font-semibold text-white tracking-tight">Últimos pedidos em esteira</h2><button class="text-xs font-medium text-[#C5A869]">Ver todas as caixas</button></div>
      <div class="overflow-x-auto"><table class="w-full text-left border-collapse text-sm"><thead><tr class="bg-white/[0.02] text-xs font-medium uppercase tracking-wider text-[#818798]"><th>Pedido</th><th>Sócio</th><th>Plano</th><th>Caixa</th><th>Status</th><th>Data</th></tr></thead><tbody>
        <tr><td>RP-000004</td><td>Cliente RoyalPrime</td><td>Royal Delivery</td><td>DEL-000004</td><td><span class="status-badge bg-sky-500/10 text-sky-300">● Recebido</span></td><td>07/09/2026</td></tr>
        <tr><td>RP-000003</td><td>Lucas Dias</td><td>Royal Delivery</td><td>DEL-000003</td><td><span class="status-badge bg-emerald-500/10 text-emerald-300">● Aprovado</span></td><td>07/09/2026</td></tr>
        <tr><td>RP-000002</td><td>Felipe Vilela</td><td>Royal Box</td><td>DEL-000002</td><td><span class="status-badge bg-indigo-500/10 text-indigo-300">● Pronto</span></td><td>07/09/2026</td></tr>
        <tr><td>RP-000001</td><td>Cliente RoyalPrime</td><td>Pro</td><td>DEL-000001</td><td><span class="status-badge bg-amber-500/10 text-amber-300">● Separando</span></td><td>07/09/2026</td></tr>
      </tbody></table></div>
    </section>

    <section class="glass-panel rounded-xl border border-white/[0.06] overflow-hidden">
      <div class="px-6 py-4 border-b border-white/[0.06]"><h2 class="text-base font-semibold text-white tracking-tight">Planos ativos</h2></div>
      <div class="overflow-x-auto"><table class="w-full text-left border-collapse text-sm"><thead><tr><th>Plano</th><th>Preço</th><th>Recorrência</th><th>Itens inclusos</th><th>Assinantes ativos</th><th>Status</th></tr></thead><tbody>
        <tr><td>Basic</td><td>R$ 199,00</td><td>Mensal</td><td>1</td><td>0</td><td><span class="status-badge bg-emerald-500/10 text-emerald-300">● Ativo</span></td></tr>
        <tr><td>Premium</td><td>R$ 299,00</td><td>Mensal</td><td>2</td><td>0</td><td><span class="status-badge bg-emerald-500/10 text-emerald-300">● Ativo</span></td></tr>
        <tr><td>Pro</td><td>R$ 449,00</td><td>Mensal</td><td>2</td><td>1</td><td><span class="status-badge bg-emerald-500/10 text-emerald-300">● Ativo</span></td></tr>
      </tbody></table></div>
    </section>
  </main>
</body>
</html>
```
