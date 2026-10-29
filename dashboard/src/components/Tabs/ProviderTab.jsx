import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { Building2, WifiOff, Smartphone, DollarSign, AlertCircle, Cpu } from 'lucide-react';

export default function ProviderTab({ data }) {
  const { providers } = data;

  const OFFLINE_COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  const REVENUE_COLORS = ['#0284c7', '#6366f1', '#10b981', '#f59e0b'];

  const needConnectionPct = providers.offlineDist?.find(x => x.name.toLowerCase().includes('needs a connection') || x.name.toLowerCase().includes('no'))?.percentage ?? 24;
  const b2cPct = providers.revenueDist?.find(x => x.name.toLowerCase().includes('b2c') || x.name.toLowerCase().includes('families'))?.percentage ?? 34;
  const donorPct = providers.revenueDist?.find(x => x.name.toLowerCase().includes('donor') || x.name.toLowerCase().includes('grant'))?.percentage ?? 29;
  const b2gPct = providers.revenueDist?.find(x => x.name.toLowerCase().includes('b2g') || x.name.toLowerCase().includes('ministry'))?.percentage ?? 21;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">EdTech Provider Landscape & Market Dynamics</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Analysis of organisations building, selling, and deploying digital learning tools across Sub-Saharan Africa.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 self-start sm:self-auto">
            <Building2 className="w-4 h-4" />
            <span>N = {providers.total} Providers</span>
          </div>
        </div>
      </div>

      {/* Grid: Primary Offering & Delivery Channels / Offline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Primary Product Offering */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Primary Product or Service Offering</h3>
              <p className="text-xs text-slate-500">Core market focus across surveyed providers</p>
            </div>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providers.offeringDist} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10.5 }} width={140} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                />
                <Bar dataKey="percentage" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offline Capability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Offline Viability</h3>
                <p className="text-xs text-slate-500">"Can the core product be used without an active internet connection?"</p>
              </div>
              <WifiOff className="w-4 h-4 text-amber-500" />
            </div>

            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={providers.offlineDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="percentage"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {providers.offlineDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={OFFLINE_COLORS[index % OFFLINE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Providers']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '8px' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Offline Deficit:</strong> {needConnectionPct}% of products strictly require an active internet connection, automatically excluding deep rural and peri-urban schools with zero or intermittent data coverage.
          </div>
        </div>
      </div>

      {/* Grid: Revenue Models & Procurement Breakdown Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Models */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Primary Revenue Models</h3>
              <p className="text-xs text-slate-500">How EdTech ventures in SSA monetize and sustain operations</p>
            </div>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 pt-2">
            {providers.revenueDist.map((rev, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{rev.name}</span>
                  <span className="text-emerald-700 font-bold">{rev.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full" 
                    style={{ width: `${rev.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs text-slate-700">
            <strong>B2C & Donor Reliance:</strong> Direct household purchases ({b2cPct}%) and donor grants ({donorPct}%) dominate over public procurement ({b2gPct}%), reflecting the friction of selling directly to government ministries.
          </div>
        </div>

        {/* Public Procurement Breakdown Stages */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Where Public Procurement Breaks Down</h3>
                <p className="text-xs text-slate-500">Top reported bottlenecks when attempting to scale through ministries</p>
              </div>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>

            <div className="space-y-3 pt-2">
              {providers.breakdownDist.map((stage, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3">
                  <span className="text-xs text-slate-700 font-medium">{stage.name}</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded shrink-0">
                    {stage.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Procurement Paralysis:</strong> Lengthy multi-year procurement cycles and delayed release of earmarked ministry funds are identified as the number one killers of promising local EdTech innovations.
          </div>
        </div>
      </div>
    </div>
  );
}
