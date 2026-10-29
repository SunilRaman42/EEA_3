import React from 'react';
import { 
  Users, Building2, GraduationCap, Globe2, Zap, AlertTriangle, 
  ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function OverviewTab({ data, onSelectTab }) {
  const { metadata, teachers, providers, experts, triangulation } = data;
  const stats = metadata.summaryStats;

  // Top 10 represented countries in sample
  const countryCounts = {};
  teachers.records.forEach(r => {
    countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([country, count]) => ({ country, count }));

  const COLORS = ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Summary */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-medium mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regional Synthesis & Triangulation Framework</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Sub-Saharan Africa EdTech Landscape Review
          </h2>
          <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed mb-5">
            This dashboard synthesizes multi-stakeholder perspectives from across Sub-Saharan Africa to surface what works, what fails, and why. By contrasting ground-level teacher experiences with provider claims and expert systemic governance, it moves past hype into practical feasibility.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab('triangulation')}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition shadow-md"
            >
              Explore Triangulation Radar <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('teachers')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition border border-white/20"
            >
              Classroom Reality ({stats.totalTeachers} Teachers)
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Responses</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800">{stats.totalRespondents}</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Multi-stakeholder</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Teachers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-sky-600">{stats.totalTeachers}</span>
            <GraduationCap className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Ground classroom reality</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Providers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.totalProviders}</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Startups, NGOs, state</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Experts</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.totalExperts}</span>
            <Globe2 className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Policy, research, donors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Countries Covered</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.countriesRepresented}</span>
            <span className="text-xs text-slate-400">/ 48 SSA</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">EN, FR, PT blocs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rural Sample</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-700">{stats.ruralPercentage}%</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Critical equity focus</span>
        </div>
      </div>

      {/* Triangulation Tension Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>The "Pilotitis" Sustainability Cliff</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            <strong className="text-amber-900 font-semibold">{triangulation.donorExitRisk.collapseOrShrink}%</strong> of experts report that when donor-funded EdTech projects conclude, they either collapse completely or shrink to nominal token programs without recurrent ministry uptake.
          </p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm mb-2">
            <Globe2 className="w-4 h-4 text-sky-600" />
            <span>The Local Language Asymmetry</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            While <strong className="text-sky-900 font-semibold">{triangulation?.languageConcordance?.[0]?.value ?? 24}%</strong> of EdTech providers claim multi-lingual local language support, only <strong className="text-sky-900 font-semibold">{triangulation?.languageConcordance?.[1]?.value ?? 10}%</strong> of teachers find generative AI tools handle national/local languages well in real classroom practice.
          </p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Safeguarding & Evidence Gap</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            Only <strong className="text-emerald-900 font-semibold">{teachers.harmReportingDist?.find(x => x.name.toLowerCase().includes('procedure'))?.percentage ?? 31}%</strong> of teachers report knowing formal school procedures for reporting digital harm.
          </p>
        </div>
      </div>

      {/* Geographical Representation Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Top Represented Countries in Survey Sample</h3>
              <p className="text-xs text-slate-500">Teacher response distribution across represented SSA hub countries</p>
            </div>
            <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              {stats.countriesRepresented} Countries in Sample
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val) => [`${val} responses`, 'Responses']} 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {topCountries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stakeholder Perspective Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Three Survey Engines</h3>
            <p className="text-xs text-slate-500 mb-4">Structure of the Sub-Saharan Africa review</p>

            <div className="space-y-3">
              <div 
                onClick={() => onSelectTab('teachers')}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800">1. Teacher Survey</div>
                  <div className="text-[11px] text-slate-500">Electricity, devices, workload, AI & phones</div>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded">{teachers.total}</span>
              </div>

              <div 
                onClick={() => onSelectTab('providers')}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800">2. Provider Survey</div>
                  <div className="text-[11px] text-slate-500">Business model, offline capability, evidence</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{providers.total}</span>
              </div>

              <div 
                onClick={() => onSelectTab('experts')}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800">3. Expert Consultation</div>
                  <div className="text-[11px] text-slate-500">Adoption drivers, procurement bottlenecks, equity</div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{experts.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onSelectTab('triangulation')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            >
              View Triangulation Gap Analysis <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
