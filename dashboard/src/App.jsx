import React, { useState, useEffect } from 'react';
import defaultData from './data/survey_data.json';
import Header from './components/Header';
import EmbedModal from './components/EmbedModal';
import OverviewTab from './components/Tabs/OverviewTab';
import TriangulationTab from './components/Tabs/TriangulationTab';
import TeacherTab from './components/Tabs/TeacherTab';
import ProviderTab from './components/Tabs/ProviderTab';
import ExpertTab from './components/Tabs/ExpertTab';
import DataExplorerTab from './components/Tabs/DataExplorerTab';

export default function App() {
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBloc, setSelectedBloc] = useState('All Blocs');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  // Parse URL query params for initial embed or filter configuration
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('embed') === 'true') {
        setIsEmbedded(true);
      }
      if (params.get('hideHeader') === 'true') {
        setHideHeader(true);
      }
      const initialTab = params.get('tab');
      if (initialTab && ['overview', 'triangulation', 'teachers', 'providers', 'experts', 'explorer'].includes(initialTab)) {
        setActiveTab(initialTab);
      }
      const initialBloc = params.get('bloc');
      if (initialBloc && ['Anglophone', 'Francophone', 'Lusophone'].includes(initialBloc)) {
        setSelectedBloc(initialBloc);
      }
    } catch (e) {
      console.warn('URL param parse error:', e);
    }
  }, []);

  // Attempt dynamic fetch in case updated data is placed in public/data/
  useEffect(() => {
    fetch('./data/survey_data.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Network response not ok');
      })
      .then(json => {
        if (json && json.metadata) {
          setData(json);
        }
      })
      .catch(() => {
        // Fallback to imported defaultData, perfectly fine
      });
  }, []);

  // Filtered view data based on linguistic bloc
  const filteredData = React.useMemo(() => {
    if (selectedBloc === 'All Blocs') return data;
    
    // Filter teacher records
    const filteredTeachers = data.teachers.records.filter(r => r.bloc === selectedBloc);
    const filteredExperts = data.experts.records.filter(r => r.bloc === selectedBloc);
    
    return {
      ...data,
      teachers: {
        ...data.teachers,
        records: filteredTeachers,
        total: filteredTeachers.length
      },
      experts: {
        ...data.experts,
        records: filteredExperts,
        total: filteredExperts.length
      }
    };
  }, [data, selectedBloc]);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isEmbedded ? 'p-2 sm:p-4' : ''}`}>
      {/* Header */}
      <Header 
        metadata={data.metadata}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBloc={selectedBloc}
        setSelectedBloc={setSelectedBloc}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onOpenEmbed={() => setIsEmbedModalOpen(true)}
        isEmbedded={isEmbedded}
        hideHeader={hideHeader}
      />

      {/* Main Content Area */}
      <main className={`flex-1 ${isEmbedded ? 'w-full' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6'}`}>
        {activeTab === 'overview' && (
          <OverviewTab data={filteredData} onSelectTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'triangulation' && (
          <TriangulationTab data={filteredData} />
        )}
        {activeTab === 'teachers' && (
          <TeacherTab 
            data={filteredData} 
            currentBloc={selectedBloc} 
            currentCountry={selectedCountry} 
          />
        )}
        {activeTab === 'providers' && (
          <ProviderTab data={filteredData} />
        )}
        {activeTab === 'experts' && (
          <ExpertTab data={filteredData} />
        )}
        {activeTab === 'explorer' && (
          <DataExplorerTab data={filteredData} />
        )}
      </main>

      {/* Footer (Hidden when embed mode requests hideHeader) */}
      {(!isEmbedded || !hideHeader) && (
        <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span>Sub-Saharan Africa EdTech Landscape Review</span> · 
              <span className="text-slate-400 ml-1">Draft v1 Template & Analytics Engine</span>
            </div>
            <div className="flex items-center gap-4 text-sky-600">
              <button onClick={() => setIsEmbedModalOpen(true)} className="hover:underline">
                Get Embed Code
              </button>
              <button onClick={() => setActiveTab('explorer')} className="hover:underline">
                Data Dictionary
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Embed Modal */}
      <EmbedModal 
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        currentTab={activeTab}
        currentBloc={selectedBloc}
      />
    </div>
  );
}
