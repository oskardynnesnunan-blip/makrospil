export type GameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  customerGoal: string;
  bankQuestion: string;
  timeLimitSeconds: number;
  hints: string[];
  optionA: {
    id: string;
    title: string;
    text: string;
    next: string;
    feedback: string;
  };
  optionB: {
    id: string;
    title: string;
    text: string;
    next: string;
    feedback: string;
  };
};

export const gameCases: Record<string, GameCase> = {
  first_home: {
    id: "first_home",
    title: "Unge købere vil have boliglån",
    description:
      "Et ungt par vil købe en ejerlejlighed til 2,8 mio. kr. De tjener samlet 52.000 kr. før skat om måneden. De har 120.000 kr. i opsparing og et billån med ydelse på 3.200 kr. om måneden.",
    theme: "boliglån",
    customerGoal: "Kunden vil købe sin første bolig.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med betingelser? Forklar med fokus på rådighedsbeløb, opsparing, gæld og risiko.",
    timeLimitSeconds: 480,
    hints: [
      "Se på udbetalingen i forhold til boligprisen.",
      "Se på deres eksisterende gæld og månedlige ydelse.",
      "Banken ser både på løn, rådighedsbeløb og robusthed.",
    ],
    optionA: {
      id: "first_home_a",
      title: "Ja, men kun med betingelser",
      text: "Banken er positiv, men vil kræve stærkere økonomi eller mere opsparing.",
      next: "car_loan_apprentice",
      feedback:
        "Det er ofte en realistisk bankbeslutning. Kunden har indkomst, men opsparingen er begrænset, og billånet presser økonomien. Banken vil ofte stille krav før et endeligt ja.",
    },
    optionB: {
      id: "first_home_b",
      title: "Nej, ikke endnu",
      text: "Banken vurderer, at økonomien er for presset lige nu.",
      next: "debt_consolidation",
      feedback:
        "Det kan også være en fagligt rimelig beslutning, hvis rådighedsbeløbet er for stramt eller risikoen vurderes som for høj. Banken skal kunne forklare afslaget tydeligt.",
    },
  },

  car_loan_apprentice: {
    id: "car_loan_apprentice",
    title: "Lærling vil låne til bil",
    description:
      "En lærling vil låne 180.000 kr. til en bil. Kunden tjener 19.500 kr. før skat om måneden, bor til leje og har ingen opsparing. Kunden siger, at bilen er nødvendig for at komme på arbejde.",
    theme: "billån",
    customerGoal: "Kunden vil købe bil for at kunne passe job og transport.",
    bankQuestion:
      "Bør banken godkende billånet, afvise det eller foreslå en anden løsning? Forklar med fokus på betalingsevne, opsparing og risiko.",
    timeLimitSeconds: 480,
    hints: [
      "Se på kundens indkomst og manglende opsparing.",
      "Tænk på om bilen er nødvendig eller bare ønsket.",
      "En bank kan godt foreslå et lavere lånebeløb eller en billigere løsning.",
    ],
    optionA: {
      id: "car_loan_apprentice_a",
      title: "Ja, men kun til en billigere løsning",
      text: "Banken vil måske hjælpe, men ikke nødvendigvis til den ønskede bil.",
      next: "self_employed_van",
      feedback:
        "Det er ofte en stærk beslutning, fordi banken anerkender behovet, men samtidig reducerer risikoen ved at foreslå et mindre lån eller billigere bil.",
    },
    optionB: {
      id: "car_loan_apprentice_b",
      title: "Nej, økonomien er for svag",
      text: "Banken vil ikke tage risikoen nu.",
      next: "missing_documents",
      feedback:
        "Det kan være rimeligt, hvis kundens økonomi er for stram, og der ikke er nogen buffer. Banken skal dog kunne forklare, hvad kunden konkret skal forbedre for senere at kunne låne.",
    },
  },

  debt_consolidation: {
    id: "debt_consolidation",
    title: "Kunde vil samle dyr gæld",
    description:
      "En kunde har tre forbrugslån og to kreditkort med høj rente. Samlet gæld er 215.000 kr. Kunden tjener 36.000 kr. før skat og har fast arbejde, men har tidligere haft overtræk flere gange.",
    theme: "samlelån",
    customerGoal: "Kunden vil samle gælden og få lavere månedlig ydelse.",
    bankQuestion:
      "Bør banken sige ja til samlelån, nej eller kun ja med tydelige krav? Forklar med fokus på betalingshistorik, rådighedsbeløb og risiko.",
    timeLimitSeconds: 480,
    hints: [
      "Samlelån kan hjælpe, men løser ikke altid dårlige vaner.",
      "Se på kundens historik, ikke kun den nuværende løn.",
      "Banken vil ofte kræve budget og bedre økonomisk adfærd.",
    ],
    optionA: {
      id: "debt_consolidation_a",
      title: "Ja, men med klare krav",
      text: "Banken hjælper kun, hvis kunden samtidig ændrer økonomisk adfærd.",
      next: "energy_renovation",
      feedback:
        "Det er ofte en stærk løsning. Et samlelån kan give bedre overblik, men banken skal sikre, at kunden ikke bare fortsætter samme mønster bagefter.",
    },
    optionB: {
      id: "debt_consolidation_b",
      title: "Nej, risikoen er stadig for høj",
      text: "Banken vurderer, at kundens historik vejer for tungt lige nu.",
      next: "overdraft_customer",
      feedback:
        "Det kan være rigtigt, hvis overtræk, svag historik og usikker adfærd giver for stor risiko. Banken skal dog forklare, hvad kunden skal ændre for at blive mere kreditværdig.",
    },
  },

  self_employed_van: {
    id: "self_employed_van",
    title: "Selvstændig vil låne til varebil",
    description:
      "En selvstændig elektriker vil låne 260.000 kr. til en varebil. Virksomheden har haft stigende omsætning de seneste to år, men indkomsten svinger fra måned til måned. Kunden har 80.000 kr. i opsparing.",
    theme: "erhvervslån",
    customerGoal: "Kunden vil finansiere varebil for at kunne tage flere opgaver.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med ekstra dokumentation? Forklar med fokus på svingende indkomst, dokumentation og sikkerhed.",
    timeLimitSeconds: 480,
    hints: [
      "Selvstændige vurderes ofte hårdere på dokumentation.",
      "Se på regnskab, budget og udsving.",
      "Tænk på om bilen skaber værdi for virksomheden.",
    ],
    optionA: {
      id: "self_employed_van_a",
      title: "Ja, men kun med ekstra dokumentation",
      text: "Banken er positiv, men vil se regnskab, budget og robusthed.",
      next: "cafe_startup",
      feedback:
        "Det er ofte den bedste bankbeslutning. Kunden kan have et fornuftigt projekt, men banken vil næsten altid kræve ekstra dokumentation, når indkomsten svinger.",
    },
    optionB: {
      id: "self_employed_van_b",
      title: "Nej, indkomsten er for usikker",
      text: "Banken vil ikke låne ud nu.",
      next: "missing_documents",
      feedback:
        "Det kan være en forsvarlig beslutning, hvis dokumentationen er for svag eller udsvingene for store. Banken bør dog tydeligt forklare, hvilke tal der mangler.",
    },
  },

  energy_renovation: {
    id: "energy_renovation",
    title: "Familie vil låne til energirenovering",
    description:
      "En familie vil låne 300.000 kr. til nye vinduer, varmepumpe og isolering. De ejer allerede huset og har fast indkomst. De har moderat opsparing og ingen forbrugsgæld.",
    theme: "boligforbedring",
    customerGoal: "Kunden vil forbedre bolig og sænke fremtidige energiudgifter.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med betingelser? Forklar med fokus på boligværdi, betalingsevne og langsigtet risiko.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på om lånet forbedrer boligens værdi eller økonomi.",
      "Se på gæld, opsparing og faste indkomster.",
      "Banken vurderer stadig risiko, selv når formålet virker fornuftigt.",
    ],
    optionA: {
      id: "energy_renovation_a",
      title: "Ja, det virker fornuftigt",
      text: "Banken kan være positiv, hvis familiens økonomi hænger sammen.",
      next: "new_graduate_andel",
      feedback:
        "Det er ofte en stærk beslutning, fordi formålet er fornuftigt, og projektet kan forbedre bolig og økonomi. Banken skal stadig sikre, at familien kan bære lånet.",
    },
    optionB: {
      id: "energy_renovation_b",
      title: "Ja, men kun med lavere beløb",
      text: "Banken vil begrænse risikoen og kræve mere egenbetaling.",
      next: "divorce_refinance",
      feedback:
        "Det kan være en god løsning, hvis banken vil støtte projektet, men samtidig holde risikoen nede. Det er ofte lettere at forklare end et rent afslag.",
    },
  },

  cafe_startup: {
    id: "cafe_startup",
    title: "Kunde vil låne til café",
    description:
      "En kunde vil låne 600.000 kr. til at åbne café. Kunden har brancheerfaring, men har aldrig drevet egen virksomhed før. Kunden har 70.000 kr. i opsparing og et foreløbigt budget.",
    theme: "iværksætteri",
    customerGoal: "Kunden vil starte egen café.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med store forbehold? Forklar med fokus på risiko, dokumentation, egenkapital og drift.",
    timeLimitSeconds: 480,
    hints: [
      "Iværksætteri giver ofte højere risiko end almindelige privatlån.",
      "Se på egenkapital og dokumentation.",
      "Banken vurderer både kunden og projektet.",
    ],
    optionA: {
      id: "cafe_startup_a",
      title: "Nej, risikoen er for høj lige nu",
      text: "Banken vurderer, at projektet er for usikkert i den nuværende form.",
      next: "debt_consolidation",
      feedback:
        "Det er ofte den stærkeste bankbeslutning, når egenkapitalen er lav, dokumentationen usikker og projektet endnu ikke robust nok.",
    },
    optionB: {
      id: "cafe_startup_b",
      title: "Ja, men kun med meget mere dokumentation",
      text: "Banken er kun åben, hvis kunden løfter projektet markant.",
      next: "small_business_growth",
      feedback:
        "Det kan være rimeligt, hvis banken ser potentiale, men kræver detaljeret budget, omsætningsforventninger og større egenbetaling, før noget godkendes.",
    },
  },

  new_graduate_andel: {
    id: "new_graduate_andel",
    title: "Nyuddannet vil købe andel",
    description:
      "En nyuddannet kunde har fået fast job og vil købe andelsbolig. Kunden har løn på 34.000 kr. før skat, studiegæld på 145.000 kr. og opsparing på 90.000 kr.",
    theme: "andel",
    customerGoal: "Kunden vil købe andelsbolig hurtigt efter studiet.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med betingelser? Forklar med fokus på stabil indkomst, studiegæld og buffer.",
    timeLimitSeconds: 480,
    hints: [
      "Fast job tæller positivt, men studiegæld tæller også.",
      "Tænk på hvor robust økonomien er efter køb.",
      "Banken vil gerne se, om kunden stadig har luft i budgettet bagefter.",
    ],
    optionA: {
      id: "new_graduate_andel_a",
      title: "Ja, men kun hvis budgettet holder",
      text: "Banken er forsigtigt positiv, men vil være sikker på luft i økonomien.",
      next: "missing_documents",
      feedback:
        "Det er ofte den rigtige banktilgang. Kunden har noget, der taler for, men banken skal sikre, at studiegæld og boligudgifter ikke samlet bliver for tunge.",
    },
    optionB: {
      id: "new_graduate_andel_b",
      title: "Nej, ikke endnu",
      text: "Banken vil se længere historik og mere økonomisk buffer først.",
      next: "car_loan_apprentice",
      feedback:
        "Det kan være rimeligt, hvis budgettet er for stramt eller banken vurderer, at kunden er for sårbar kort efter jobstart.",
    },
  },

  divorce_refinance: {
    id: "divorce_refinance",
    title: "Kunde efter skilsmisse vil blive boende",
    description:
      "En kunde vil overtage huset efter skilsmisse og bede banken om at omlægge lånene alene. Kunden har fast indkomst, to børn og begrænset økonomisk buffer.",
    theme: "omlægning",
    customerGoal: "Kunden vil blive boende i huset alene.",
    bankQuestion:
      "Bør banken acceptere omlægningen, afvise den eller kræve ændringer? Forklar med fokus på rådighedsbeløb, robusthed og risiko.",
    timeLimitSeconds: 480,
    hints: [
      "Se på om én indkomst kan bære huset alene.",
      "Tænk på børn, faste udgifter og buffer.",
      "Banken skal se på den fremtidige bæreevne, ikke kun ønsket om at blive boende.",
    ],
    optionA: {
      id: "divorce_refinance_a",
      title: "Ja, men kun med stramt budget og sikkerhed",
      text: "Banken kan være positiv, hvis økonomien stadig hænger sammen alene.",
      next: "overdraft_customer",
      feedback:
        "Det er ofte en realistisk løsning. Banken kan godt hjælpe, men kun hvis kunden tydeligt kan bære huset alene og stadig har luft til uforudsete udgifter.",
    },
    optionB: {
      id: "divorce_refinance_b",
      title: "Nej, boligen er for tung alene",
      text: "Banken vurderer, at huset ikke kan bæres af én indkomst.",
      next: "energy_renovation",
      feedback:
        "Det kan være den rigtige beslutning, hvis økonomien bliver for sårbar. Banken skal beskytte både kunde og kreditrisiko.",
    },
  },

  overdraft_customer: {
    id: "overdraft_customer",
    title: "Kunde søger lån men har mange overtræk",
    description:
      "En kunde søger et mindre privatlån til uforudsete udgifter. Kunden har fast job og okay løn, men kontoen har haft mange overtræk de seneste seks måneder.",
    theme: "privatlån",
    customerGoal: "Kunden vil have et mindre lån hurtigt.",
    bankQuestion:
      "Bør banken sige ja, nej eller kræve mere dokumentation først? Forklar med fokus på betalingshistorik og kreditværdighed.",
    timeLimitSeconds: 480,
    hints: [
      "Historik betyder meget i banken.",
      "Fast job er ikke nok, hvis adfærden ser usikker ud.",
      "Banken kan bede om budget og forklaring før den siger ja.",
    ],
    optionA: {
      id: "overdraft_customer_a",
      title: "Nej, historikken er for svag",
      text: "Banken vurderer, at adfærden på kontoen gør risikoen for høj.",
      next: "small_business_growth",
      feedback:
        "Det er ofte den stærkeste bankbeslutning, fordi overtræk er et tydeligt faresignal. Banken skal se, at kunden først får styr på økonomien.",
    },
    optionB: {
      id: "overdraft_customer_b",
      title: "Kun med fuldt budget og forklaring",
      text: "Banken vil først se dokumentation og forbedret overblik.",
      next: "first_home",
      feedback:
        "Det kan være rimeligt, hvis banken vil undersøge, om overtrækkene er midlertidige eller systematiske. Men banken skal være meget tydelig om kravene.",
    },
  },

  missing_documents: {
    id: "missing_documents",
    title: "Høj løn, men dokumentationen mangler",
    description:
      "En kunde med høj løn søger lån og virker overbevisende i mødet. Men der mangler lønsedler, kontoudtog og et fuldt budget. Kunden siger, at det kan sendes senere.",
    theme: "dokumentation",
    customerGoal: "Kunden vil have hurtigt ja på baggrund af mundtlige oplysninger.",
    bankQuestion:
      "Bør banken sige ja, nej eller vente? Forklar med fokus på dokumentation og bankens ansvar.",
    timeLimitSeconds: 480,
    hints: [
      "Banken må ikke kun bygge på det, kunden siger.",
      "Dokumentation er en central del af kreditvurderingen.",
      "Et hurtigt ja uden papir kan være en bankfaglig fejl.",
    ],
    optionA: {
      id: "missing_documents_a",
      title: "Vent, til dokumentationen er på plads",
      text: "Banken kan ikke beslutte noget endeligt endnu.",
      next: "first_home",
      feedback:
        "Det er den stærkeste bankbeslutning. Banken skal have dokumentation på plads, før den kan vurdere indkomst, udgifter og risiko ordentligt.",
    },
    optionB: {
      id: "missing_documents_b",
      title: "Ja, fordi kunden virker stærk",
      text: "Banken vælger at stole på indtrykket fra mødet.",
      next: "overdraft_customer",
      feedback:
        "Det er en svag bankbeslutning. Et godt indtryk er ikke nok uden dokumentation. Banken skal kunne underbygge sin kreditvurdering.",
    },
  },

  small_business_growth: {
    id: "small_business_growth",
    title: "Mindre virksomhed vil udvide",
    description:
      "En mindre virksomhed vil låne 450.000 kr. til at udvide og ansætte én medarbejder mere. De seneste regnskaber er fornuftige, men markedet er lidt usikkert.",
    theme: "virksomhed",
    customerGoal: "Kunden vil vækste og udvide virksomheden.",
    bankQuestion:
      "Bør banken sige ja, nej eller ja med ekstra krav? Forklar med fokus på regnskab, risiko og robusthed.",
    timeLimitSeconds: 480,
    hints: [
      "Regnskaber tæller positivt, men markedet betyder også noget.",
      "Se på, om virksomheden kan tåle et dårligere år.",
      "Banken kan godt være positiv og stadig kræve sikkerhed.",
    ],
    optionA: {
      id: "small_business_growth_a",
      title: "Ja, men med krav om sikkerhed og budget",
      text: "Banken vil støtte vækst, men ikke uden tydelige rammer.",
      next: "final_case",
      feedback:
        "Det er ofte en stærk beslutning. Banken kan støtte vækst, men vil typisk kræve mere dokumentation, sikkerhed eller tættere opfølgning, når markedet er usikkert.",
    },
    optionB: {
      id: "small_business_growth_b",
      title: "Nej, usikkerheden er for høj",
      text: "Banken vil ikke bære risikoen ved udvidelsen nu.",
      next: "final_case",
      feedback:
        "Det kan være en rimelig beslutning, hvis markedet er for usikkert eller robustheden for svag. Men banken bør forklare præcist, hvad der holder kunden tilbage.",
    },
  },

  final_case: {
    id: "final_case",
    title: "Bankmødet med blandede signaler",
    description:
      "En kunde søger lån og har både stærke og svage sider. Kunden har rimelig indkomst, lidt opsparing og mindre gæld, men budgettet er stramt, og noget dokumentation er stadig uklar.",
    theme: "samlet vurdering",
    customerGoal: "Kunden vil have banken til at tage stilling i et tvivlstilfælde.",
    bankQuestion:
      "Hvad er bankens bedste beslutning i et tvivlstilfælde, og hvorfor? Forklar med fokus på helhedsvurdering, risiko og dokumentation.",
    timeLimitSeconds: 480,
    hints: [
      "Det handler ikke kun om ja eller nej, men om bankens begrundelse.",
      "Banken skal kunne forklare sin risiko klart.",
      "Se på helheden: indkomst, gæld, buffer og dokumentation.",
    ],
    optionA: {
      id: "final_case_a",
      title: "Ja, men kun med meget klare betingelser",
      text: "Banken siger ikke et frit ja, men stiller præcise krav.",
      next: "first_home",
      feedback:
        "Det er ofte den bedste bankløsning i tvivlstilfælde. Banken kan være åben, men kun hvis krav og dokumentation er tydelige, og risikoen kan forklares.",
    },
    optionB: {
      id: "final_case_b",
      title: "Nej, indtil sagen er stærkere",
      text: "Banken vurderer, at tvivlen er for stor lige nu.",
      next: "first_home",
      feedback:
        "Det kan være rigtigt, hvis usikkerheden samlet er for høj. Det vigtige er, at banken præcist forklarer, hvorfor kunden ikke er klar endnu.",
    },
  },
};