import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Zap, Wifi, Clock, MessageSquare, ShieldCheck, Filter, Quote } from 'lucide-react';

export default function TeacherTab({ data, currentBloc, currentCountry, currentSchoolType }) {
  const { teachers } = data;
  const [filterType, setFilterType] = useState('All');

  // Dynamic calculated insights
  const ruralElec = teachers.elecByLocation?.find(l => l.location.toLowerCase().includes('rural'));
  const ruralOutagePct = ruralElec ? Number((ruralElec.unreliable + ruralElec.none).toFixed(1)) : 74;

  const reduceWorkload = (teachers.workloadDist || [])
    .filter(w => w.name.toLowerCase().includes('reduce'))
    .reduce((sum, w) => sum + w.percentage, 0);
  const addWorkload = (teachers.workloadDist || [])
    .filter(w => w.name.toLowerCase().includes('add'))
    .reduce((sum, w) => sum + w.percentage, 0);

  const schoolProcedurePct = teachers.harmReportingDist?.find(h => h.name.toLowerCase().includes('procedure'))?.percentage ?? 31;
  const informalPct = teachers.harmReportingDist?.find(h => h.name.toLowerCase().includes('informally'))?.percentage ?? 44;

  // Colors for Workload
  const WORKLOAD_COLORS = {
    'Reduce it a lot': '#059669',
    'Reduce it a little': '#10b981',
    'No difference': '#94a3b8',
    'Add a little': '#f59e0b',
    'Add a lot': '#ef4444',
  };

  const filteredQuotes = teachers.quotes.filter(q => {
    if (filterType === 'All') return true;
    if (filterType === 'Infrastructure') return q.toLowerCase().includes('solar') || q.toLowerCase().includes('power') || q.toLowerCase().includes('wifi') || q.toLowerCase().includes('offline');
    if (filterType === 'AI & Prep') return q.toLowerCase().includes('chatgpt') || q.toLowerCase().includes('ai') || q.toLowerCase().includes('curriculum');
    if (filterType === 'Phones & Policy') return q.toLowerCase().includes('phone') || q.toLowerCase().includes('whatsapp') || q.toLowerCase().includes('banned');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Teacher Voice & Classroom Realities</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Examining the actual classroom environment: power, connectivity, devices, workload impact, and safeguarding.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg border border-sky-100 self-start sm:self-auto">
            <span>N = {teachers.total} Teachers Across SSA</span>
          </div>
        </div>
      </div>

      {/* Grid: Infrastructure (Power by Location) & Workload Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Electricity Reliability by Urban / Rural Location */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Electricity Reliability by School Location</h3>
                <p className="text-xs text-slate-500">The severe rural infrastructure gap</p>
              </div>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teachers.elecByLocation} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                  <YAxis unit="%" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="always" name="Always Reliable" fill="#10b981" stackId="a" />
                  <Bar dataKey="mostly" name="Mostly Reliable" fill="#38bdf8" stackId="a" />
                  <Bar dataKey="unreliable" name="Unreliable / Frequent Cuts" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="none" name="No Electricity at All" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Key Finding:</span> In rural schools, over <strong>{ruralOutagePct}%</strong> face either frequent power outages or zero electricity at all, making cloud-only EdTech tools completely unviable.
          </div>
        </div>

        {/* Workload Impact */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Overall Workload Impact of Digital Tools</h3>
                <p className="text-xs text-slate-500">Does EdTech reduce teacher burden or create new admin overhead?</p>
              </div>
              <Clock className="w-4 h-4 text-sky-600" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teachers.workloadDist} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                  <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10.5 }} width={120} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Share of Teachers']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {teachers.workloadDist.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={WORKLOAD_COLORS[entry.name] || '#0284c7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-800">
            <strong>{reduceWorkload.toFixed(0)}% Net Workload Reduction:</strong> When tools function well (e.g., auto-marking, prepared lesson plans), a majority of teachers report workload reductions, though {addWorkload.toFixed(0)}% experience added friction from reporting mandates.
          </div>
        </div>
      </div>

      {/* Grid: Tools in Use & Safety/Phone Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Most Commonly Used Digital Tools */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Digital Tools Most Commonly Used by Teachers</h3>
              <p className="text-xs text-slate-500">Multi-select options (% of teachers reporting active use)</p>
            </div>
            <MessageSquare className="w-4 h-4 text-sky-600" />
          </div>

          <div className="space-y-3 pt-2">
            {teachers.digitalToolsDist.map((tool, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{tool.name}</span>
                  <span className="text-sky-700 font-bold">{tool.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-sky-600 h-2 rounded-full" 
                    style={{ width: `${tool.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Harm Reporting & Safeguarding Readiness */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Harm Reporting & Online Safeguarding Protocol</h3>
                <p className="text-xs text-slate-500">"If a student had a harmful digital experience, would you know how to report it?"</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3 pt-3">
              {teachers.harmReportingDist.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.count} respondents</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.name.includes('school procedure') ? 'bg-emerald-100 text-emerald-700' :
                    item.name.includes('informally') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900">
            <strong>Procedural Vulnerability:</strong> Only {schoolProcedurePct}% have an established formal protocol at school. {informalPct}% rely solely on informal notification to the head teacher, leaving serious child protection gaps.
          </div>
        </div>
      </div>

      {/* Qualitative Voices from the Field */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Verbatim Teacher Testimonials & Classroom Reality</h3>
              <p className="text-xs text-slate-500">Unfiltered remarks from teachers across urban, peri-urban, and rural SSA</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {['All', 'Infrastructure', 'AI & Prep', 'Phones & Policy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-2.5 py-1 rounded-full font-medium transition ${
                  filterType === cat 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQuotes.slice(0, 6).map((quote, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition text-xs leading-relaxed flex flex-col justify-between">
              <p className="text-slate-700 italic">"{quote}"</p>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Teacher Voice</span>
                <span className="font-medium text-sky-600">Sub-Saharan Africa</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
