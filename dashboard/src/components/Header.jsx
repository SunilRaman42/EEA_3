import React from 'react';
import { 
  Globe2, Layers, Code, Sparkles, Filter, 
  BarChart3, Users, Building2, Landmark, Table 
} from 'lucide-react';

export default function Header({ 
  metadata, 
  activeTab, 
  setActiveTab, 
  selectedBloc, 
  setSelectedBloc, 
  selectedCountry, 
  setSelectedCountry,
  onOpenEmbed,
  isEmbedded,
  hideHeader
}) {
  if (isEmbedded && hideHeader) {
    // Ultra compact toolbar for iframe embed mode
    return (
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeTab === 'overview' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('triangulation')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeTab === 'triangulation' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Triangulation Radar
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeTab === 'teachers' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeTab === 'providers' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Providers
          </button>
          <button
            onClick={() => setActiveTab('experts')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeTab === 'experts' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Experts
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedBloc}
            onChange={(e) => setSelectedBloc(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1 text-slate-700"
          >
            {metadata.linguisticBlocs.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shrink-0">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                Sub-Saharan Africa EdTech Landscape Review
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 tracking-wide uppercase">
                Interactive Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Global EdTech Alliance of Alliances · Incubated within UNESCO's Global Education Coalition
            </p>
          </div>
        </div>

        {/* Global Controls & Embed Button */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Linguistic Bloc Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBloc}
              onChange={(e) => setSelectedBloc(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer text-xs"
            >
              {metadata.linguisticBlocs.map(bloc => (
                <option key={bloc} value={bloc}>{bloc}</option>
              ))}
            </select>
          </div>

          {/* Embed Modal Button */}
          <button
            onClick={onOpenEmbed}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-200"
          >
            <Code className="w-3.5 h-3.5 text-sky-600" />
            <span>Embed Widget</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('triangulation')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'triangulation'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Triangulation Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'teachers'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-sky-500" />
            <span>Teacher Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'providers'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>Providers</span>
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'experts'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-4 h-4 text-indigo-500" />
            <span>Expert Panel</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'explorer'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Table className="w-4 h-4 text-slate-500" />
            <span>Data Explorer</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
