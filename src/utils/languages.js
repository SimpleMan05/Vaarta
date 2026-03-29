export const LANGUAGES = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    script: 'Devanagari',
    region: 'North India',
    regionDetail: 'Uttar Pradesh, Bihar, Rajasthan, MP, Uttarakhand',
    speakers: '600M+',
    color: '#e8630a',
    flag: '🟧',
    economyNote: 'India\'s largest consumer market, MSME heartland, agrarian economy',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    region: 'Tamil Nadu',
    regionDetail: 'Tamil Nadu, Puducherry, Sri Lankan Tamil diaspora',
    speakers: '80M+',
    color: '#0d7377',
    flag: '🟩',
    economyNote: 'IT services, auto manufacturing, textiles, strong SME culture',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    region: 'Andhra & Telangana',
    regionDetail: 'Andhra Pradesh, Telangana',
    speakers: '90M+',
    color: '#c0392b',
    flag: '🟥',
    economyNote: 'Hyderabad tech hub, pharma industry, agriculture, emerging startups',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    region: 'West Bengal & Bangladesh',
    regionDetail: 'West Bengal, Tripura, Bangladesh',
    speakers: '230M+',
    color: '#2c3e50',
    flag: '🟫',
    economyNote: 'Kolkata financial legacy, Jute & textile, emerging startup ecosystem',
  },
]

export const SAMPLE_ARTICLES = [
  {
    title: "RBI Holds Repo Rate, Signals Cautious Stance",
    text: `The Reserve Bank of India's Monetary Policy Committee (MPC) on Friday unanimously decided to keep the benchmark repo rate unchanged at 6.5 per cent for the seventh consecutive time, signalling a cautious approach amid global uncertainties and domestic inflation concerns.

RBI Governor Shaktikanta Das, presenting the bi-monthly policy review, said the central bank remains focused on withdrawing accommodation to ensure inflation aligns with its 4 per cent target while supporting growth. Consumer price inflation eased to 4.87 per cent in October but food prices remain elevated.

The decision was in line with market expectations. Analysts said the central bank is unlikely to cut rates before mid-2025, as the RBI wants to ensure durability of disinflation before pivoting. The GDP growth forecast for FY25 was maintained at 7 per cent, reflecting resilience in domestic consumption and investment.

Indian equity markets responded positively, with the BSE Sensex rising 312 points to close at 65,900, while the NSE Nifty50 gained 95 points to end at 19,694.`,
  },
  {
    title: "Tata Group Eyes $2 Billion Renewable Energy Acquisition",
    text: `Tata Group is in advanced talks to acquire a majority stake in a mid-sized renewable energy company for approximately $2 billion, as part of its ambitious plan to scale up clean energy capacity to 20 gigawatts by 2030, sources familiar with the matter told ET.

The salt-to-software conglomerate, which operates Tata Power as its energy arm, is looking to fast-track its transition away from thermal power. The deal, if concluded, would be one of the largest clean energy acquisitions in India's history.

India's renewable energy sector has attracted over $14 billion in investments this fiscal year alone, driven by government incentives and corporate net-zero commitments. The sector is expected to generate 500,000 new jobs by 2025 as solar and wind projects scale across states like Rajasthan, Gujarat, and Andhra Pradesh.

Tata Power currently operates 3.8 GW of renewable capacity, and this acquisition could nearly double that figure overnight, positioning the group favorably to meet its ESG targets ahead of schedule.`,
  },
  {
    title: "Reliance Jio Plans Rs 50,000 Crore 5G Infrastructure Push",
    text: `Reliance Jio Infocomm Ltd is planning to invest Rs 50,000 crore over the next 18 months to accelerate 5G rollout across Tier-2 and Tier-3 cities in India, as the telecom giant races to maintain its competitive edge over rivals Airtel and BSNL.

The investment will cover tower infrastructure, fibre backhaul, and edge computing nodes — critical for low-latency 5G services. Jio's 5G network currently covers 406 districts and 1,200 cities, but the new push aims to reach 97 per cent of India's population by December 2025.

The move comes as the Indian government's Digital India initiative gains pace, with small businesses in semi-urban areas increasingly depending on high-speed internet for payments, supply chain management, and e-commerce. Jio's affordable 5G plans, starting at Rs 299 per month, have already attracted over 18 crore subscribers.

Analysts at Motilal Oswal estimate Jio's revenues could cross Rs 1 lakh crore by FY26, making it one of the most valuable telecom companies in Asia.`,
  },
]

export function buildTranslationPrompt(articleText, language) {
  const lang = LANGUAGES.find(l => l.code === language)

  return `You are an expert business journalist and cultural interpreter, fluent in ${lang.name} (${lang.nativeName}) and deeply familiar with the economy, culture, and local context of ${lang.region} — specifically ${lang.regionDetail}.

Your task is to transform the following English business news article into a version that resonates deeply with ${lang.name}-speaking readers. This is NOT a literal translation — it is a cultural and linguistic adaptation.

ARTICLE TO ADAPT:
"""
${articleText}
"""

GUIDELINES:
1. **Translation**: Translate naturally as a ${lang.name}-speaking journalist would write. Use vocabulary and sentence structures that feel native, not translated.
2. **Cultural Adaptation**: Replace Western or generic Indian financial metaphors with ones familiar to ${lang.region} audiences. Example: don't say "Wall Street equivalent" — say what it actually means in ${lang.region}'s context.
3. **Local Grounding**: Where possible, connect national news to ${lang.region}'s economy (${lang.economyNote}).
4. **Numbers & Units**: Use Indian numbering (lakh, crore) and convert where needed.
5. **Tone**: Match the tone of a respected regional business publication like a ${lang.name}-language financial daily.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):
{
  "headline": "Translated headline in ${lang.name}",
  "translation": "Full translated article text in ${lang.name}",
  "culturalContext": [
    {
      "vernacular": "Bullet point in ${lang.name} — cultural or local context insight",
      "english": "Same point in English as a subtitle"
    },
    {
      "vernacular": "Second point in ${lang.name}",
      "english": "Second point in English"
    },
    {
      "vernacular": "Third point in ${lang.name}",
      "english": "Third point in English"
    }
  ],
  "whyItMatters": {
    "vernacular": "One paragraph in ${lang.name} explaining why this news matters to ${lang.region}'s economy and people",
    "english": "Same paragraph in English as a subtitle"
  },
  "keyTerms": [
    { "english": "original term", "vernacular": "${lang.name} equivalent", "explanation": "brief note in English" }
  ]
}`
}
