import React, { useState, useMemo } from 'react';
import { Search, Download, Table, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

export default function DataExplorerTab({ data }) {
  const [activeDataset, setActiveDataset] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  const currentRecords = useMemo(() => {
    return data[activeDataset]?.records || [];
  }, [data, activeDataset]);

  const countries = useMemo(() => {
    const list = new Set(currentRecords.map(r => r.country || r.hqCountry).filter(Boolean));
    return ['All', ...Array.from(list).sort()];
  }, [currentRecords]);

  const filteredRecords = useMemo(() => {
    return currentRecords.filter(r => {
      const matchCountry = selectedCountry === 'All' || (r.country || r.hqCountry) === selectedCountry;
      const matchSearch = !searchTerm || JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase());
      return matchCountry && matchSearch;
    });
  }, [currentRecords, selectedCountry, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    const keys = Object.keys(filteredRecords[0]);
    const csvContent = [
      keys.join(','),
      ...filteredRecords.map(row => 
        keys.map(k => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SSA_EdTech_${activeDataset}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Survey Data Explorer</h2>
            <p className="text-xs text-slate-500">
              Inspect individual anonymised responses, test client-side filtering, and export subsets to CSV.
            </p>
          </div>

          {/* Dataset Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => { setActiveDataset('teachers'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition ${activeDataset === 'teachers' ? 'bg-white shadow-sm text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Teachers ({data.teachers.total})
            </button>
            <button
              onClick={() => { setActiveDataset('providers'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition ${activeDataset === 'providers' ? 'bg-white shadow-sm text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Providers ({data.providers.total})
            </button>
            <button
              onClick={() => { setActiveDataset('experts'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md transition ${activeDataset === 'experts' ? 'bg-white shadow-sm text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Experts ({data.experts.total})
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by keywords, ID, school type, driver..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCountry}
              onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold sticky top-0 z-10">
              <tr>
                {paginatedRows.length > 0 && Object.keys(paginatedRows[0]).map(key => (
                  <th key={key} className="px-4 py-3 whitespace-nowrap bg-slate-50">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {paginatedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  {Object.entries(row).map(([k, val], cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 whitespace-nowrap text-[11px]">
                      {val === null || val === undefined ? (
                        <span className="text-slate-300 italic font-sans">N/A</span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400 font-sans">
                    No matching records found for current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-700">{filteredRecords.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to{' '}
            <strong className="text-slate-700">{Math.min(currentPage * rowsPerPage, filteredRecords.length)}</strong> of{' '}
            <strong className="text-slate-700">{filteredRecords.length}</strong> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
