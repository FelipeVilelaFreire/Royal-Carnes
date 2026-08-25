import { SubscriptionPlan } from "../../contracts";

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan-essential",
    key: "essential",
    name: "Essencial Barbecue",
    tagline: "Cortes nobres essenciais para o seu churrasco mensal",
    priceMonthly: 199.00,
    priceAnnual: 179.00,
    features: [
      "4kg de cortes selecionados por mês",
      "Picanha e Ancho maturados inclusos",
      "Frete grátis para todo o estado",
      "Receitas e dicas do assador em vídeo"
    ]
  },
  {
    id: "plan-master",
    key: "master",
    name: "Master Churrasco",
    tagline: "A experiência completa de churrascaria no conforto de casa",
    priceMonthly: 349.00,
    priceAnnual: 319.00,
    recommended: true,
    features: [
      "7kg de cortes nobres e especiais por mês",
      "Prime Rib, Chorizo e Picanha Premium",
      "Kit de sais de parrilla e carvão ecológico inclusos",
      "Atendimento prioritário e escolha de data de entrega"
    ]
  },
  {
    id: "plan-wagyu",
    key: "wagyu",
    name: "Exclusive Wagyu",
    tagline: "Para apreciadores do mais alto nível do churrasco mundial",
    priceMonthly: 699.00,
    priceAnnual: 629.00,
    features: [
      "10kg de cortes super nobres incluindo Wagyu A5 importado",
      "Degustações exclusivas e convites para workshops de parrilla",
      "Entrega em caixa térmica VIP agendada",
      "Sommelier de churrasco dedicado para harmonização"
    ]
  }
];
