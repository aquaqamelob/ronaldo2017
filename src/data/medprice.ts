import type { MaterialPriceRecord } from '@/types/medprice'

const HOSPITAL_TYPES = ['Kliniczny', 'Wojewódzki', 'Powiatowy', 'Miejski'] as const

function enrich(record: MaterialPriceRecord, index: number): MaterialPriceRecord {
  return {
    ...record,
    hospitalName: index % 3 === 0 ? 'Szpital Kliniczny Nr 1' : 'Twój Szpital',
    hospitalType: HOSPITAL_TYPES[index % HOSPITAL_TYPES.length],
    isAnonymous: index % 5 === 0,
  }
}

let materials: MaterialPriceRecord[] = []

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const generateRandomDate = (maxDaysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysAgo));
  return date.toISOString();
};

const getRandomSource = () => {
  const sources = ['Przetarg', 'Badanie rynku', 'Ceny katalogowe'];
  return sources[Math.floor(Math.random() * sources.length)];
};

const RAW_MOCK_DATA: Omit<MaterialPriceRecord, 'updatedAt'>[] = [
  { id: '1', name: 'Mercator Nitrylex Black M', genericName: 'Rękawice nitrylowe bezpudrowe', category: 'Rękawice', manufacturer: 'Mercator', unitPrice: 0.22, quantity: 500000, totalValue: 110000, benchmarkPrice: 0.19, benchmarkMedianVolume: 1200000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '2', name: 'BD Discardit II 5ml', genericName: 'Strzykawka 2-częściowa 5ml', category: 'Iniekcja', manufacturer: 'BD', unitPrice: 0.45, quantity: 100000, totalValue: 45000, benchmarkPrice: 0.42, benchmarkMedianVolume: 250000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '3', name: 'B.Braun Vasofix Safety G20', genericName: 'Kaniula bezpieczna G20', category: 'Kaniule', manufacturer: 'B.Braun', unitPrice: 2.10, quantity: 20000, totalValue: 42000, benchmarkPrice: 1.95, benchmarkMedianVolume: 45000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '4', name: 'Zarys Mask-Pro 3ply', genericName: 'Maska chirurgiczna 3-warstwowa', category: 'Ochrona', manufacturer: 'Zarys', unitPrice: 0.08, quantity: 1000000, totalValue: 80000, benchmarkPrice: 0.07, benchmarkMedianVolume: 5000000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '5', name: 'Hartmann Soft-Zellin', genericName: 'Gaziki nasączone alkoholem', category: 'Dezynfekcja', manufacturer: 'Hartmann', unitPrice: 0.12, quantity: 300000, totalValue: 36000, benchmarkPrice: 0.14, benchmarkMedianVolume: 400000, benchmarkMedianContractMonths: 36, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '6', name: 'Baxa Enteral CH16', genericName: 'Sonda żołądkowa dożywienie CH16', category: 'Cewniki', manufacturer: 'Baxa', unitPrice: 5.40, quantity: 5000, totalValue: 27000, benchmarkPrice: 4.80, benchmarkMedianVolume: 12000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '7', name: 'Terumo Neolus 21G', genericName: 'Igła iniekcyjna 0.8 x 40mm', category: 'Iniekcja', manufacturer: 'Terumo', unitPrice: 0.12, quantity: 200000, totalValue: 24000, benchmarkPrice: 0.10, benchmarkMedianVolume: 800000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '8', name: '3M Tegaderm Diamond', genericName: 'Opatrunek foliowy do kaniul', category: 'Kaniule', manufacturer: '3M', unitPrice: 1.85, quantity: 15000, totalValue: 27750, benchmarkPrice: 1.60, benchmarkMedianVolume: 50000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '9', name: 'Medline Comfort Ease L', genericName: 'Fartuch barierowy ochronny', category: 'Ochrona', manufacturer: 'Medline', unitPrice: 3.50, quantity: 10000, totalValue: 35000, benchmarkPrice: 3.10, benchmarkMedianVolume: 25000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '10', name: 'Schülke Octenisept 1L', genericName: 'Preparat do dezynfekcji błon śluzowych', category: 'Dezynfekcja', manufacturer: 'Schülke', unitPrice: 48.00, quantity: 1000, totalValue: 48000, benchmarkPrice: 44.50, benchmarkMedianVolume: 2500, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '11', name: 'Unomedical Cewnik Nelaton CH14', genericName: 'Cewnik Nelaton 40cm', category: 'Cewniki', manufacturer: 'Unomedical', unitPrice: 1.20, quantity: 8000, totalValue: 9600, benchmarkPrice: 1.10, benchmarkMedianVolume: 20000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '12', name: 'Ansell Gammex Powder-Free', genericName: 'Rękawice chirurgiczne sterylne', category: 'Rękawice', manufacturer: 'Ansell', unitPrice: 2.80, quantity: 12000, totalValue: 33600, benchmarkPrice: 2.55, benchmarkMedianVolume: 30000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '13', name: 'KD-Fine Needle 25G', genericName: 'Igła iniekcyjna 0.5 x 25mm', category: 'Iniekcja', manufacturer: 'KD-Medical', unitPrice: 0.09, quantity: 150000, totalValue: 13500, benchmarkPrice: 0.08, benchmarkMedianVolume: 600000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '14', name: 'Smith & Nephew IV3000', genericName: 'Opatrunek paroprzepuszczalny', category: 'Inne', manufacturer: 'Smith & Nephew', unitPrice: 2.40, quantity: 10000, totalValue: 24000, benchmarkPrice: 2.15, benchmarkMedianVolume: 40000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '15', name: 'Coloplast Folysil CH18', genericName: 'Cewnik Foleya silikonowy 100%', category: 'Cewniki', manufacturer: 'Coloplast', unitPrice: 18.50, quantity: 2000, totalValue: 37000, benchmarkPrice: 16.20, benchmarkMedianVolume: 5000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '16', name: 'Ecolab Skinman Soft N', genericName: 'Płyn do dezynfekcji rąk 5L', category: 'Dezynfekcja', manufacturer: 'Ecolab', unitPrice: 115.00, quantity: 400, totalValue: 46000, benchmarkPrice: 108.00, benchmarkMedianVolume: 1200, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '17', name: 'Sempercare Nitrile Shine L', genericName: 'Rękawice nitrylowe diagnostyczne', category: 'Rękawice', manufacturer: 'Semperit', unitPrice: 0.24, quantity: 400000, totalValue: 96000, benchmarkPrice: 0.21, benchmarkMedianVolume: 1000000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '18', name: 'Braun Omnican 40 1ml', genericName: 'Strzykawka insulinowa z igłą', category: 'Iniekcja', manufacturer: 'B.Braun', unitPrice: 0.65, quantity: 50000, totalValue: 32500, benchmarkPrice: 0.58, benchmarkMedianVolume: 120000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '19', name: 'Mölnlycke Biogel Surg. 7.5', genericName: 'Rękawice chirurgiczne lateksowe', category: 'Rękawice', manufacturer: 'Mölnlycke', unitPrice: 4.20, quantity: 8000, totalValue: 33600, benchmarkPrice: 3.90, benchmarkMedianVolume: 15000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '20', name: 'Zarys Combi-Stopper', genericName: 'Korek combi-stopper uniwersalny', category: 'Inne', manufacturer: 'Zarys', unitPrice: 0.35, quantity: 60000, totalValue: 21000, benchmarkPrice: 0.31, benchmarkMedianVolume: 200000, benchmarkMedianContractMonths: 36, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '21', name: 'Fresenius Kabivol 1L', genericName: 'Płyn infuzyjny NaCl 0.9%', category: 'Inne', manufacturer: 'Fresenius Kabi', unitPrice: 3.10, quantity: 40000, totalValue: 124000, benchmarkPrice: 2.85, benchmarkMedianVolume: 150000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '22', name: 'Romed Syringe 20ml', genericName: 'Strzykawka 3-częściowa 20ml', category: 'Iniekcja', manufacturer: 'Romed', unitPrice: 0.72, quantity: 30000, totalValue: 21600, benchmarkPrice: 0.65, benchmarkMedianVolume: 100000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '23', name: 'Zarys Gauze SWAB 5x5', genericName: 'Kompresy jałowe 5x5cm 17n', category: 'Inne', manufacturer: 'Zarys', unitPrice: 0.45, quantity: 100000, totalValue: 45000, benchmarkPrice: 0.38, benchmarkMedianVolume: 400000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '24', name: 'BD Venflon Pro Safety G22', genericName: 'Kaniula dożylna bezpieczna G22', category: 'Kaniule', manufacturer: 'BD', unitPrice: 2.45, quantity: 25000, totalValue: 61250, benchmarkPrice: 2.15, benchmarkMedianVolume: 80000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '25', name: 'Kimberly-Clark N95 Mask', genericName: 'Półmaska filtrująca FFP2', category: 'Ochrona', manufacturer: 'Kimberly-Clark', unitPrice: 1.20, quantity: 20000, totalValue: 24000, benchmarkPrice: 0.95, benchmarkMedianVolume: 100000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '26', name: 'Medisept Velox Wipes', genericName: 'Chusteczki do dezynfekcji powierzchni', category: 'Dezynfekcja', manufacturer: 'Medisept', unitPrice: 18.00, quantity: 3000, totalValue: 54000, benchmarkPrice: 16.50, benchmarkMedianVolume: 10000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '27', name: 'Teleflex Rüsch Gold CH20', genericName: 'Cewnik Foleya lateksowy silikonowany', category: 'Cewniki', manufacturer: 'Teleflex', unitPrice: 4.80, quantity: 6000, totalValue: 28800, benchmarkPrice: 4.20, benchmarkMedianVolume: 15000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '28', name: '3M Durapore 2.5cm', genericName: 'Przylepiec jedwabny 2.5cm x 9m', category: 'Inne', manufacturer: '3M', unitPrice: 4.50, quantity: 5000, totalValue: 22500, benchmarkPrice: 3.90, benchmarkMedianVolume: 12000, benchmarkMedianContractMonths: 36, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '29', name: 'B.Braun Infusomat Space', genericName: 'Przyrząd do infuzji do pomp', category: 'Inne', manufacturer: 'B.Braun', unitPrice: 12.40, quantity: 15000, totalValue: 186000, benchmarkPrice: 11.50, benchmarkMedianVolume: 40000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '30', name: 'Vygon Nutrisafe 2', genericName: 'Zgłębnik do karmienia niemowląt', category: 'Cewniki', manufacturer: 'Vygon', unitPrice: 14.50, quantity: 2000, totalValue: 29000, benchmarkPrice: 13.20, benchmarkMedianVolume: 4000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '31', name: 'Mercator Comfort Latex XL', genericName: 'Rękawice lateksowe bezpudrowe', category: 'Rękawice', manufacturer: 'Mercator', unitPrice: 0.28, quantity: 200000, totalValue: 56000, benchmarkPrice: 0.25, benchmarkMedianVolume: 800000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '32', name: 'BD Microlance 27G', genericName: 'Igła iniekcyjna 0.4 x 13mm', category: 'Iniekcja', manufacturer: 'BD', unitPrice: 0.15, quantity: 100000, totalValue: 15000, benchmarkPrice: 0.13, benchmarkMedianVolume: 500000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '33', name: 'Hartmann MoliCare Premium', genericName: 'Pieluchomajtki dla dorosłych L', category: 'Inne', manufacturer: 'Hartmann', unitPrice: 2.45, quantity: 40000, totalValue: 98000, benchmarkPrice: 2.10, benchmarkMedianVolume: 120000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '34', name: 'Diversey Oxivir Excel', genericName: 'Płyn myjąco-dezynfekujący na bazie H2O2', category: 'Dezynfekcja', manufacturer: 'Diversey', unitPrice: 145.00, quantity: 200, totalValue: 29000, benchmarkPrice: 132.00, benchmarkMedianVolume: 600, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '35', name: 'Polmil Maska FFP3', genericName: 'Maska o wysokiej filtracji FFP3', category: 'Ochrona', manufacturer: 'Polmil', unitPrice: 4.80, quantity: 5000, totalValue: 24000, benchmarkPrice: 4.10, benchmarkMedianVolume: 15000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '36', name: 'Smith & Nephew Melolin', genericName: 'Opatrunek chłonny nieprzywierający', category: 'Inne', manufacturer: 'Smith & Nephew', unitPrice: 1.15, quantity: 20000, totalValue: 23000, benchmarkPrice: 0.98, benchmarkMedianVolume: 60000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '37', name: 'Unomedical Worken Bag', genericName: 'Worek do zbiórki moczu 2L', category: 'Cewniki', manufacturer: 'Unomedical', unitPrice: 1.85, quantity: 30000, totalValue: 55500, benchmarkPrice: 1.65, benchmarkMedianVolume: 100000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '38', name: 'Medline Protective Cap', genericName: 'Czepek medyczny typu pielęgniarka', category: 'Ochrona', manufacturer: 'Medline', unitPrice: 0.14, quantity: 100000, totalValue: 14000, benchmarkPrice: 0.12, benchmarkMedianVolume: 400000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '39', name: 'Braun Introcan Safety G18', genericName: 'Kaniula dożylna FEP G18', category: 'Kaniule', manufacturer: 'B.Braun', unitPrice: 2.90, quantity: 10000, totalValue: 29000, benchmarkPrice: 2.65, benchmarkMedianVolume: 40000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '40', name: 'Zarys Elastic Bandage 10cm', genericName: 'Bandaż elastyczny z zapinką', category: 'Inne', manufacturer: 'Zarys', unitPrice: 1.25, quantity: 15000, totalValue: 18750, benchmarkPrice: 1.10, benchmarkMedianVolume: 50000, benchmarkMedianContractMonths: 36, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '41', name: 'Anios Aniosgel 85 NPC', genericName: 'Żel do dezynfekcji rąk 500ml', category: 'Dezynfekcja', manufacturer: 'Anios', unitPrice: 19.50, quantity: 5000, totalValue: 97500, benchmarkPrice: 17.80, benchmarkMedianVolume: 15000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '42', name: 'Coloplast SpeediCath CH12', genericName: 'Cewnik Nelaton gotowy do użycia', category: 'Cewniki', manufacturer: 'Coloplast', unitPrice: 9.80, quantity: 4000, totalValue: 39200, benchmarkPrice: 8.90, benchmarkMedianVolume: 12000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '43', name: '3M Micropore 1.25cm', genericName: 'Przylepiec włókninowy papierowy', category: 'Inne', manufacturer: '3M', unitPrice: 2.10, quantity: 8000, totalValue: 16800, benchmarkPrice: 1.85, benchmarkMedianVolume: 25000, benchmarkMedianContractMonths: 36, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '44', name: 'Sempercare Latex Exam L', genericName: 'Rękawice lateksowe pudrowane', category: 'Rękawice', manufacturer: 'Semperit', unitPrice: 0.20, quantity: 100000, totalValue: 20000, benchmarkPrice: 0.18, benchmarkMedianVolume: 500000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '45', name: 'BD Eclipse Needle 21G', genericName: 'Igła bezpieczna z osłonką', category: 'Iniekcja', manufacturer: 'BD', unitPrice: 1.10, quantity: 20000, totalValue: 22000, benchmarkPrice: 0.95, benchmarkMedianVolume: 60000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '46', name: 'Kruuse Sutures 3-0 Silk', genericName: 'Nici chirurgiczne jedwabne', category: 'Inne', manufacturer: 'Kruuse', unitPrice: 12.00, quantity: 1000, totalValue: 12000, benchmarkPrice: 10.50, benchmarkMedianVolume: 3000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '47', name: 'Johnson & Johnson Ethicon PDS', genericName: 'Szew wchłanialny monofilamentowy', category: 'Inne', manufacturer: 'Ethicon', unitPrice: 35.00, quantity: 500, totalValue: 17500, benchmarkPrice: 32.00, benchmarkMedianVolume: 2000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '48', name: 'Paul Hartmann Sterillium', genericName: 'Płyn do chirurgicznej dezynfekcji rąk', category: 'Dezynfekcja', manufacturer: 'Hartmann', unitPrice: 52.00, quantity: 1500, totalValue: 78000, benchmarkPrice: 48.50, benchmarkMedianVolume: 4000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '49', name: 'B.Braun Exadrop', genericName: 'Regulator precyzyjny przepływu', category: 'Inne', manufacturer: 'B.Braun', unitPrice: 8.50, quantity: 5000, totalValue: 42500, benchmarkPrice: 7.90, benchmarkMedianVolume: 12000, benchmarkMedianContractMonths: 24, period: '2024-Q1', priceSource: getRandomSource() },
  { id: '50', name: 'Wiva Mask 3-ply Blue', genericName: 'Maska medyczna typ II', category: 'Ochrona', manufacturer: 'Wiva', unitPrice: 0.06, quantity: 2000000, totalValue: 120000, benchmarkPrice: 0.05, benchmarkMedianVolume: 8000000, benchmarkMedianContractMonths: 12, period: '2024-Q1', priceSource: getRandomSource() },
];

const MOCK_BASE: MaterialPriceRecord[] = RAW_MOCK_DATA.map(item => ({
  ...item,
  updatedAt: generateRandomDate(120) // Random date within last 120 days
}));




export const MOCK_MARKET_DATA: MaterialPriceRecord[] = MOCK_BASE.map(enrich)

export const CATEGORIES = ['Rękawice', 'Iniekcja', 'Kaniule', 'Ochrona', 'Dezynfekcja', 'Cewniki', 'Inne'] as const

export async function getCategories() {
  await delay(100)
  return [...CATEGORIES]
}

export async function getMaterials(): Promise<MaterialPriceRecord[]> {
  await delay(400)
  if (materials.length === 0) {
    materials = [...MOCK_MARKET_DATA]
  }
  return [...materials]
}

export async function addMaterials(records: MaterialPriceRecord[]): Promise<void> {
  await delay(200)
  materials = [...records, ...materials]
}

export function initMaterials(seed: MaterialPriceRecord[]) {
  materials = [...seed]
}
