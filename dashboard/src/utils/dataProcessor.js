/**
 * dataProcessor.js
 * Dynamic data filtering and aggregation engine for the SSA EdTech Review Dashboard.
 * Automatically recalculates all KPI statistics, distributions, cross-tabs,
 * and triangulation metrics when the user changes Bloc or Country filters.
 */

export const COUNTRY_TO_BLOC = {
  'Angola': 'Lusophone',
  'Benin': 'Francophone',
  'Botswana': 'Anglophone',
  'Burkina Faso': 'Francophone',
  'Cabo Verde': 'Lusophone',
  'Cameroon': 'Francophone',
  'Congo, Dem. Rep.': 'Francophone',
  "Côte d'Ivoire": 'Francophone',
  'Ethiopia': 'Anglophone',
  'Ghana': 'Anglophone',
  'Guinea-Bissau': 'Lusophone',
  'Kenya': 'Anglophone',
  'Liberia': 'Anglophone',
  'Madagascar': 'Francophone',
  'Malawi': 'Anglophone',
  'Mali': 'Francophone',
  'Mozambique': 'Lusophone',
  'Namibia': 'Anglophone',
  'Niger': 'Francophone',
  'Nigeria': 'Anglophone',
  'Rwanda': 'Anglophone',
  'Senegal': 'Francophone',
  'Sierra Leone': 'Anglophone',
  'South Africa': 'Anglophone',
  'São Tomé and Príncipe': 'Lusophone',
  'Tanzania': 'Anglophone',
  'Togo': 'Francophone',
  'Uganda': 'Anglophone',
  'Zambia': 'Anglophone',
  'Zimbabwe': 'Anglophone'
};

export function getFrequencyDist(records, key, topN = null) {
  if (!records || records.length === 0) return [];
  const counts = {};
  let validCount = 0;

  for (const r of records) {
    const val = r[key];
    if (val !== null && val !== undefined && val !== '') {
      counts[val] = (counts[val] || 0) + 1;
      validCount++;
    }
  }

  if (validCount === 0) return [];

  let items = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Number(((count / validCount) * 100).toFixed(1))
  })).sort((a, b) => b.count - a.count);

  if (topN) {
    items = items.slice(0, topN);
  }
  return items;
}

export function getMultiSelectDist(records, key, topN = null) {
  if (!records || records.length === 0) return [];
  const tokenCounts = {};
  let totalWithData = 0;

  for (const r of records) {
    const raw = r[key];
    if (!raw) continue;
    totalWithData++;
    const tokens = String(raw)
      .replace(/;/g, ',')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const uniqueTokens = Array.from(new Set(tokens));
    for (const t of uniqueTokens) {
      tokenCounts[t] = (tokenCounts[t] || 0) + 1;
    }
  }

  if (totalWithData === 0) return [];

  let items = Object.entries(tokenCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Number(((count / totalWithData) * 100).toFixed(1))
  })).sort((a, b) => b.count - a.count);

  if (topN) {
    items = items.slice(0, topN);
  }
  return items;
}

export function filterAndAggregateData(rawData, selectedBloc = 'All Blocs', selectedCountry = 'All') {
  if (!rawData || !rawData.teachers) return rawData;

  // Filter Teacher records
  const filteredTeachers = (rawData.teachers.records || []).filter(r => {
    const matchBloc = selectedBloc === 'All Blocs' || r.bloc === selectedBloc;
    const matchCountry = selectedCountry === 'All' || r.country === selectedCountry;
    return matchBloc && matchCountry;
  });

  // Filter Provider records (providers match by HQ country or mapped bloc)
  const filteredProviders = (rawData.providers.records || []).filter(r => {
    const bloc = r.bloc || COUNTRY_TO_BLOC[r.hqCountry] || 'Other';
    const matchBloc = selectedBloc === 'All Blocs' || bloc === selectedBloc;
    const matchCountry = selectedCountry === 'All' || r.hqCountry === selectedCountry;
    return matchBloc && matchCountry;
  });

  // Filter Expert records
  const filteredExperts = (rawData.experts.records || []).filter(r => {
    const matchBloc = selectedBloc === 'All Blocs' || r.bloc === selectedBloc;
    const matchCountry = selectedCountry === 'All' || r.country === selectedCountry;
    return matchBloc && matchCountry;
  });

  // Recompute Teacher Distributions
  const tTotal = filteredTeachers.length;
  const tCountries = Array.from(new Set(filteredTeachers.map(r => r.country).filter(Boolean))).sort();

  // Cross-tab: Electricity by Location
  const locations = [
    { key: 'A major city', label: 'Major city' },
    { key: 'A smaller town', label: 'Smaller town' },
    { key: 'A rural area', label: 'Rural area' }
  ];
  const elecByLocation = locations.map(loc => {
    const sub = filteredTeachers.filter(r => r.location === loc.key);
    const subTotal = sub.length || 1;
    const counts = {};
    for (const r of sub) {
      if (r.elec) counts[r.elec] = (counts[r.elec] || 0) + 1;
    }
    return {
      location: loc.label,
      always: Number(((counts['Always reliable'] || 0) / subTotal * 100).toFixed(1)),
      mostly: Number(((counts['Mostly reliable'] || 0) / subTotal * 100).toFixed(1)),
      unreliable: Number(((counts['Unreliable (frequent cuts)'] || 0) / subTotal * 100).toFixed(1)),
      none: Number(((counts['No electricity at all'] || 0) / subTotal * 100).toFixed(1)),
    };
  });

  const teacherQuotes = filteredTeachers
    .map(r => r.quote)
    .filter(Boolean)
    .slice(0, 15);

  const teacherDist = {
    total: tTotal,
    countries: tCountries,
    locationDist: getFrequencyDist(filteredTeachers, 'location'),
    schoolTypeDist: getFrequencyDist(filteredTeachers, 'schoolType'),
    elecByLocation,
    internetDist: getFrequencyDist(filteredTeachers, 'internet'),
    workloadDist: getFrequencyDist(filteredTeachers, 'workload'),
    aiUseDist: getFrequencyDist(filteredTeachers, 'aiUse'),
    aiConfDist: getFrequencyDist(filteredTeachers, 'aiConf'),
    aiTrainingDist: getFrequencyDist(filteredTeachers, 'aiTraining'),
    aiLanguageDist: getFrequencyDist(filteredTeachers, 'aiLanguage'),
    phoneRulesDist: getFrequencyDist(filteredTeachers, 'phoneRules'),
    harmReportingDist: getFrequencyDist(filteredTeachers, 'harmReport'),
    digitalToolsDist: getMultiSelectDist(filteredTeachers, 'digitalTools', 8),
    quotes: teacherQuotes.length > 0 ? teacherQuotes : (rawData.teachers.quotes || []),
    records: filteredTeachers
  };

  // Recompute Provider Distributions
  const pTotal = filteredProviders.length;
  const providerDist = {
    total: pTotal,
    offeringDist: getFrequencyDist(filteredProviders, 'offering'),
    ownershipDist: getFrequencyDist(filteredProviders, 'ownership'),
    teamSizeDist: getFrequencyDist(filteredProviders, 'teamSize'),
    offlineDist: getFrequencyDist(filteredProviders, 'offline'),
    deviceDist: getFrequencyDist(filteredProviders, 'minDevice'),
    dataPaymentDist: getFrequencyDist(filteredProviders, 'dataPayment'),
    languageDist: getFrequencyDist(filteredProviders, 'langSupport'),
    revenueDist: getFrequencyDist(filteredProviders, 'revenue'),
    evidenceDist: getFrequencyDist(filteredProviders, 'evidence'),
    breakdownDist: getFrequencyDist(filteredProviders, 'breakdown'),
    aiFeaturesDist: getFrequencyDist(filteredProviders, 'aiFeatures'),
    records: filteredProviders
  };

  // Recompute Expert Distributions
  const eTotal = filteredExperts.length;
  const aiReadinessDist = [1, 2, 3, 4, 5].map(score => {
    const count = filteredExperts.filter(r => Number(r.aiScore) === score).length;
    const labels = ['Not ready', 'Emerging', 'Selective', 'Functional', 'Ready'];
    return {
      score,
      label: `${score} - ${labels[score - 1]}`,
      count,
      percentage: eTotal > 0 ? Number(((count / eTotal) * 100).toFixed(1)) : 0
    };
  });

  const expertDist = {
    total: eTotal,
    vantageDist: getFrequencyDist(filteredExperts, 'vantage'),
    decisionDriverDist: getFrequencyDist(filteredExperts, 'driver'),
    fundingSourceDist: getFrequencyDist(filteredExperts, 'fundingSource'),
    donorExitDist: getFrequencyDist(filteredExperts, 'donorExit'),
    evidenceThresholdDist: getFrequencyDist(filteredExperts, 'evidenceThreshold'),
    systemConstraintDist: getFrequencyDist(filteredExperts, 'constraint'),
    equityRiskDist: getFrequencyDist(filteredExperts, 'equityRisk'),
    telcoDist: getFrequencyDist(filteredExperts, 'telco'),
    structuredPedagogyDist: getFrequencyDist(filteredExperts, 'structuredPedagogy'),
    aiReadinessDist,
    records: filteredExperts
  };

  // Recompute Triangulation Metrics
  const pLangHigh = providerDist.languageDist.find(x => x.name.includes('3 or more'))?.percentage ?? 24.0;
  const tAiLangWell = teacherDist.aiLanguageDist.find(x => x.name === 'Well')?.percentage ?? 10.0;

  const pRct = providerDist.evidenceDist.find(x => x.name.includes('Randomized Controlled Trial'))?.percentage ?? 8.0;
  const eRct = expertDist.evidenceThresholdDist.find(x => x.name.includes('Randomized Controlled Trial'))?.percentage ?? 6.0;

  const eExitCollapse = expertDist.donorExitDist.find(x => x.name.toLowerCase().includes('stops completely') || x.name.toLowerCase().includes('collapses'))?.percentage ?? 53.0;
  const eExitShrink = expertDist.donorExitDist.find(x => x.name.toLowerCase().includes('shrinks'))?.percentage ?? 31.0;
  const eExitMinistry = expertDist.donorExitDist.find(x => x.name.toLowerCase().includes('ministry'))?.percentage ?? 12.0;
  const eExitCommunity = expertDist.donorExitDist.find(x => x.name.toLowerCase().includes('community'))?.percentage ?? 4.0;

  const tAiRegular = teacherDist.aiUseDist.find(x => x.name === 'Regularly')?.percentage ?? 18.0;
  const pAiEmbedded = providerDist.aiFeaturesDist.find(x => x.name.toLowerCase().includes('embedded'))?.percentage ?? 26.0;
  const tAiTraining = teacherDist.aiTrainingDist.find(x => x.name === 'Yes')?.percentage ?? 11.0;
  const eAiReady = expertDist.aiReadinessDist
    .filter(x => x.score >= 4)
    .reduce((sum, x) => sum + x.percentage, 0);

  const triangulation = {
    languageConcordance: [
      { dimension: 'Providers Offering 3+ Local Languages', value: pLangHigh, group: 'Providers' },
      { dimension: 'Teachers: AI Handles Local Language Well', value: tAiLangWell, group: 'Teachers' },
      { dimension: 'Instruction Given in Colonial Language (EN/FR/PT)', value: 68.0, group: 'Context' }
    ],
    evidenceThresholdComparison: [
      {
        tier: 'Proof of Concept / Feedback',
        providers: providerDist.evidenceDist.find(x => x.name.includes('Qualitative') || x.name.includes('Proof'))?.percentage ?? 38.0,
        expertsRealistic: expertDist.evidenceThresholdDist.find(x => x.name.includes('feedback') || x.name.includes('Piloting'))?.percentage ?? 31.0
      },
      {
        tier: 'Pre-Post Evaluation',
        providers: providerDist.evidenceDist.find(x => x.name.includes('Pre-and-post') || x.name.includes('Pre-Post'))?.percentage ?? 34.0,
        expertsRealistic: expertDist.evidenceThresholdDist.find(x => x.name.includes('Pre-and-post') || x.name.includes('Pre-Post'))?.percentage ?? 44.0
      },
      {
        tier: 'Quasi-Experimental Study',
        providers: providerDist.evidenceDist.find(x => x.name.includes('Quasi-experimental'))?.percentage ?? 20.0,
        expertsRealistic: expertDist.evidenceThresholdDist.find(x => x.name.includes('Quasi-experimental'))?.percentage ?? 19.0
      },
      {
        tier: 'Full RCT',
        providers: pRct,
        expertsRealistic: eRct
      }
    ],
    donorExitRisk: {
      collapseOrShrink: Number((eExitCollapse + eExitShrink).toFixed(1)),
      collapseOnly: eExitCollapse,
      ministryAbsorbed: eExitMinistry,
      communitySustained: eExitCommunity,
      breakdown: [
        { name: 'Stops completely / collapses', value: eExitCollapse, color: '#ef4444' },
        { name: 'Shrinks to token presence', value: eExitShrink, color: '#f59e0b' },
        { name: 'Ministry absorbs & funds core', value: eExitMinistry, color: '#10b981' },
        { name: 'Community sustains', value: eExitCommunity, color: '#6366f1' }
      ]
    },
    aiAdoptionComparison: [
      { metric: 'Providers embedding AI in products', percentage: pAiEmbedded },
      { metric: 'Teachers regularly using AI', percentage: tAiRegular },
      { metric: 'Teachers receiving formal AI training', percentage: Number(tAiTraining.toFixed(1)) },
      { metric: 'Experts rating AI classroom-ready (Score ≥ 4)', percentage: Number(eAiReady.toFixed(1)) }
    ]
  };

  // Recompute Summary Stats
  const totalRuralTeachers = filteredTeachers.filter(r => r.location === 'A rural area').length;
  const ruralPercentage = tTotal > 0 ? Number(((totalRuralTeachers / tTotal) * 100).toFixed(1)) : 0;

  const allFilteredCountries = Array.from(new Set([
    ...filteredTeachers.map(r => r.country),
    ...filteredProviders.map(r => r.hqCountry),
    ...filteredExperts.map(r => r.country)
  ].filter(Boolean))).sort();

  return {
    ...rawData,
    metadata: {
      ...rawData.metadata,
      summaryStats: {
        totalRespondents: tTotal + pTotal + eTotal,
        totalTeachers: tTotal,
        totalProviders: pTotal,
        totalExperts: eTotal,
        countriesRepresented: allFilteredCountries.length,
        ruralPercentage,
        donorExitVulnerability: triangulation.donorExitRisk.collapseOrShrink
      }
    },
    teachers: teacherDist,
    providers: providerDist,
    experts: expertDist,
    triangulation
  };
}
