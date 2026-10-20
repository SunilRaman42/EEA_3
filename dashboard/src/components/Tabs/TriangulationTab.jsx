import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { AlertTriangle, CheckCircle, Scale, BrainCircuit, ShieldAlert, Sparkles } from 'lucide-react';

export default function TriangulationTab({ data }) {
  const { triangulation, experts, providers, teachers } = data;

  const DONOR_EXIT_DATA = [
    { name: 'Stops completely / collapses', value: 53.0, color: '#ef4444' },
    { name: 'Shrinks to token presence', value: 31.0, color: '#f59e0b' },
    { name: 'Ministry absorbs & funds core', value: 12.0, color: '#10b981' },
    { name: 'Community sustains', value: 4.0, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-800">The Triangulation Engine: Where Perceptions Diverge</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The central value of this regional review lies in systematically comparing perspectives across three vantage points: 
          <strong> Teachers</strong> (classroom ground reality), <strong> EdTech Providers</strong> (supply & commercial incentives), and 
          <strong> System Experts</strong> (macro policy, procurement & governance). The charts below highlight where these three realities diverge.
        </p>
      </div>

      {/* Grid: Evidence Tiers & Donor Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evidence Asymmetry */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Evidence Thresholds: Supply vs. Policy Feasibility</h3>
                <p className="text-xs text-slate-500">What evidence providers hold vs. what experts view as realistic for ministries</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Synthesis Anchor
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={triangulation.evidenceThresholdComparison} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <XAxis dataKey="tier" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" height={45} />
                  <YAxis unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="providers" name="Evidence Held by Providers" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expertsRealistic" name="Experts Deem Realistic for Govt" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Key Insight:</span> While donors often prioritize Gold-Standard RCTs, only 
            <strong className="text-indigo-700"> 6% of experts</strong> consider requiring RCTs realistic without shutting out local innovations. 
            The sweet spot for pragmatic adoption is robust <strong className="text-sky-700">Pre-Post learning evaluations (44%)</strong>.
          </div>
        </div>

        {/* The Donor Exit "Pilotitis" Crisis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">The "Pilotitis" Fate: When Donor Funding Concludes</h3>
                <p className="text-xs text-slate-500">Expert consensus on what typically happens when pilots wrap up</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                Critical Vulnerability
              </span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DONOR_EXIT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {DONOR_EXIT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Share of Experts']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ fontSize: '10.5px', paddingTop: '10px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-rose-50/70 rounded-lg border border-rose-200 text-xs text-rose-800 leading-relaxed">
            <span className="font-semibold">The 84% Cliff:</span> A staggering 84% of surveyed experts report that donor-funded EdTech tools either abruptly terminate or atrophy into token programs due to absence of recurrent public finance plans.
          </div>
        </div>
      </div>

      {/* Grid: AI Readiness & Local Language Concordance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Frontier Reality Check */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">AI in Education: Ambition vs. Classroom Readiness</h3>
              <p className="text-xs text-slate-500">Contrasting developer features with ground readiness and training</p>
            </div>
            <BrainCircuit className="w-4 h-4 text-sky-600" />
          </div>

          <div className="space-y-4">
            {triangulation.aiAdoptionComparison.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.metric}</span>
                  <span className="font-bold text-sky-700">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-slate-700 leading-relaxed">
            <strong>Training Disconnect:</strong> While 26% of providers embed AI and 18% of teachers use AI regularly, only 
            <strong> 11% of teachers have received formal AI training</strong>, forcing educators to navigate LLM hallucination and curriculum alignment unaided.
          </div>
        </div>

        {/* Local Language & Inclusion Reality */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Local Language & Inclusion Alignment</h3>
                <p className="text-xs text-slate-500">The mismatch between home languages and digital tool support</p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={triangulation.languageConcordance} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="dimension" type="category" tick={{ fontSize: 10 }} width={160} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" name="Share %" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Instruction Paradox:</strong> Over 68% of instruction occurs in colonial European languages (EN/FR/PT) despite deep learner comprehension gaps. Only 10% of teachers report that emerging digital/AI tools handle indigenous languages satisfactorily.
          </div>
        </div>
      </div>
    </div>
  );
}
