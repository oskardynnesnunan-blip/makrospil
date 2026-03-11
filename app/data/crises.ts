export type Crisis = {
  id: string;
  title: string;
  description: string;
  theme: string;
  severity: "low" | "medium" | "high";
};

export const crises: Crisis[] = [
  {
    id: "oil_shock",
    title: "Oliechok",
    description:
      "En ny konflikt sender olieprisen op. Inflation og produktionsomkostninger stiger hurtigt.",
    theme: "energi",
    severity: "high",
  },
  {
    id: "bank_panic",
    title: "Bankpanik",
    description:
      "Flere banker kommer under pres. Investorer og kunder mister tillid til sektoren.",
    theme: "banker",
    severity: "high",
  },
  {
    id: "trade_war",
    title: "Handelskrig",
    description:
      "Nye toldsatser og eksportrestriktioner skaber problemer i forsyningskæderne.",
    theme: "handel",
    severity: "medium",
  },
  {
    id: "cyber_attack",
    title: "Cyberangreb",
    description:
      "Et stort cyberangreb rammer betalinger, logistik og tilliden til økonomiens infrastruktur.",
    theme: "teknologi",
    severity: "high",
  },
  {
    id: "housing_drop",
    title: "Boligmarkedet falder",
    description:
      "Boligpriserne falder hurtigt, og husholdningerne bliver mere forsigtige.",
    theme: "boligmarked",
    severity: "medium",
  },
  {
    id: "climate_disaster",
    title: "Klimakatastrofe",
    description:
      "Ekstremt vejr rammer transport, landbrug og energiforsyning. Flere sektorer bliver pressede.",
    theme: "klima",
    severity: "high",
  },
  {
    id: "shipping_block",
    title: "Shippingkrise",
    description:
      "Vigtige søveje bliver ustabile. Fragtrater stiger, og varer bliver forsinkede.",
    theme: "forsyningskæder",
    severity: "medium",
  },
  {
    id: "currency_attack",
    title: "Valutauro",
    description:
      "Kapital flytter sig hurtigt, og valutaen svækkes. Import bliver dyrere, og markedet er nervøst.",
    theme: "valuta",
    severity: "medium",
  },
];