export type NewsTopic = {
  id: string;
  label: string;
  region: "Danmark" | "International";
  keywords: string[];
  theme: string;
};

export const newsTopics: NewsTopic[] = [
  {
    id: "dk_inflation",
    label: "Dansk inflation og priser",
    region: "Danmark",
    keywords: ["Danmark inflation", "forbrugerpriser Danmark", "dansk inflation"],
    theme: "inflation",
  },
  {
    id: "dk_nationalbank",
    label: "Nationalbanken og renter",
    region: "Danmark",
    keywords: ["Nationalbanken rente", "Danmark renter", "Nationalbanken økonomi"],
    theme: "renter",
  },
  {
    id: "dk_housing",
    label: "Dansk boligmarked",
    region: "Danmark",
    keywords: ["boligmarked Danmark", "huspriser Danmark", "boligpriser Danmark"],
    theme: "boligmarked",
  },
  {
    id: "dk_labor",
    label: "Dansk arbejdsmarked",
    region: "Danmark",
    keywords: ["arbejdsmarked Danmark", "ledighed Danmark", "mangel på arbejdskraft Danmark"],
    theme: "arbejdsmarked",
  },
  {
    id: "dk_export",
    label: "Dansk eksport og erhvervsliv",
    region: "Danmark",
    keywords: ["dansk eksport", "Novo Nordisk økonomi", "Mærsk økonomi", "dansk erhvervsliv"],
    theme: "eksport",
  },
  {
    id: "dk_green",
    label: "Dansk grøn omstilling",
    region: "Danmark",
    keywords: ["grøn omstilling Danmark", "energi Danmark", "klima Danmark økonomi"],
    theme: "klima",
  },
  {
    id: "intl_ecb",
    label: "ECB og euroområdet",
    region: "International",
    keywords: ["ECB interest rates", "eurozone inflation", "ECB economy"],
    theme: "renter",
  },
  {
    id: "intl_fed",
    label: "Fed og USA",
    region: "International",
    keywords: ["Federal Reserve rates", "US inflation", "US recession"],
    theme: "renter",
  },
  {
    id: "intl_energy",
    label: "Energi og oliepriser",
    region: "International",
    keywords: ["oil prices", "gas prices Europe", "energy shock economy"],
    theme: "energi",
  },
  {
    id: "intl_trade",
    label: "Handelskrig og told",
    region: "International",
    keywords: ["trade war", "tariffs economy", "export restrictions"],
    theme: "handel",
  },
  {
    id: "intl_china",
    label: "Kina og global vækst",
    region: "International",
    keywords: ["China economy", "China growth", "China property crisis"],
    theme: "global vækst",
  },
  {
    id: "intl_banks",
    label: "Bankuro og finansiel stress",
    region: "International",
    keywords: ["bank crisis", "financial stress", "bank failures economy"],
    theme: "banker",
  },
  {
    id: "intl_climate",
    label: "Klima og ekstreme vejrhændelser",
    region: "International",
    keywords: ["climate shock economy", "extreme weather economy", "climate risk markets"],
    theme: "klima",
  },
];