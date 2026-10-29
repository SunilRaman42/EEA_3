import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { Globe2, ShieldAlert, BookOpen, Layers, Users2, Landmark } from 'lucide-react';

export default function ExpertTab({ data }) {
  const { experts } = data;

  const CONSTRAINT_COLORS = ['#ef4444', '#f59e0b', '#0284c7', '#6366f1', '#10b981'];

  const donorDriverPct = experts.decisionDriverDist?.find(x => x.name.toLowerCase().includes('donor'))?.percentage ?? 42;
  const topConstraint = experts.systemConstraintDist?.[0];
  const secondConstraint = experts.systemConstraintDist?.[1];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Systemic Governance & Expert Consultation (Round 1)</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Judgements from education economists, policymakers, donors, and researchers with sustained on-the-ground track records.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 self-start sm:self-auto">
            <Globe2 className="w-4 h-4" />
            <span>N = {experts.total} Experts</span>
          </div>
        </div>
      </div>

      {/* Grid: Decision Drivers & Top System Constraints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Primary Decision Drivers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Who in Practice Drives Public School EdTech Decisions?</h3>
                <p className="text-xs text-slate-500">Expert rank of actual power dynamics in system adoption</p>
              </div>
              <Landmark className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experts.decisionDriverDist} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10.5 }} width={140} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="percentage" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
            <strong>External Donor Primacy:</strong> In {donorDriverPct}% of responses, international donors and multilateral agencies are perceived as the primary agenda setters—often outpacing domestic ministry priorities.
          </div>
        </div>

        {/* Top Constraints on Reaching Public School Learners */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Top Constraints on Reaching Public School Learners</h3>
                <p className="text-xs text-slate-500">Primary structural hurdles ranked by expert panel</p>
              </div>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-3 pt-2">
              {experts.systemConstraintDist.map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{c.name}</span>
                    <span className="text-slate-800 font-bold">{c.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${c.percentage}%`,
                        backgroundColor: CONSTRAINT_COLORS[idx % CONSTRAINT_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>System Constraints:</strong> Primary bottleneck is {topConstraint?.name || 'Infrastructure'} ({topConstraint?.percentage ?? 33}%), followed by {secondConstraint?.name || 'Teacher Coaching'} ({secondConstraint?.percentage ?? 29}%).
          </div>
        </div>
      </div>

      {/* Grid: Equity Blind Spots & Structured Pedagogy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Equity Blind Spots */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Most Consequential Equity Dimension at Risk of Being Missed</h3>
              <p className="text-xs text-slate-500">Vulnerable groups currently neglected by mainstream EdTech</p>
            </div>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>

          <div className="space-y-3 pt-2">
            {experts.equityRiskDist.map((risk, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-700">{risk.name}</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full shrink-0">
                  {risk.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Structured Pedagogy & Telco Roles */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Structured Pedagogy & Lesson Guide Tablets</h3>
                <p className="text-xs text-slate-500">Expert appraisal of standardized tablet-guided teaching</p>
              </div>
              <BookOpen className="w-4 h-4 text-sky-600" />
            </div>

            <div className="space-y-3 pt-2">
              {experts.structuredPedagogyDist.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs leading-relaxed space-y-1">
                  <div className="font-semibold text-slate-800">{item.name}</div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Expert sentiment</span>
                    <span className="font-bold text-sky-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-sky-50/70 rounded-lg border border-sky-200 text-xs text-sky-900 leading-relaxed">
            <strong>The Rigor vs. Autonomy Tension:</strong> 48% strongly endorse structured tablet guides as essential scaffolding in low-resource environments, while 38% warn of teacher deskilling if guides are overly script-bound.
          </div>
        </div>
      </div>
    </div>
  );
}
