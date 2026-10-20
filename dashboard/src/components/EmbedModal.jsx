import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';

export default function EmbedModal({ isOpen, onClose, currentTab, currentBloc }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [embedHeight, setEmbedHeight] = useState('800px');
  const [selectedTab, setSelectedTab] = useState(currentTab || 'overview');
  const [hideHeader, setHideHeader] = useState(true);

  const baseUrl = window.location.origin + window.location.pathname;
  const embedUrl = `${baseUrl}?embed=true&tab=${selectedTab}${hideHeader ? '&hideHeader=true' : ''}${currentBloc !== 'All Blocs' ? `&bloc=${encodeURIComponent(currentBloc)}` : ''}`;
  
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="${embedHeight}" 
  frameborder="0" 
  style="border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; min-height: ${embedHeight};"
  title="Sub-Saharan Africa EdTech Landscape Review Dashboard"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-semibold text-slate-800">Embed Dashboard into External Website</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          <p className="text-slate-600">
            Use this responsive <code className="bg-slate-100 text-sky-700 px-1.5 py-0.5 rounded">&lt;iframe&gt;</code> code snippet to embed this live interactive dashboard into any website, blog, portal, or LMS (e.g. UNESCO, policy briefs, institutional sites).
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Default View / Tab
              </label>
              <select 
                value={selectedTab} 
                onChange={(e) => setSelectedTab(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="overview">Executive Overview</option>
                <option value="triangulation">Triangulation Radar (Reality Check)</option>
                <option value="teachers">Classroom & Teacher Reality</option>
                <option value="providers">EdTech Providers & Products</option>
                <option value="experts">Governance & Expert Panel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Frame Height
              </label>
              <select 
                value={embedHeight} 
                onChange={(e) => setEmbedHeight(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="650px">Compact (650px)</option>
                <option value="800px">Standard (800px - Recommended)</option>
                <option value="1000px">Tall (1000px)</option>
                <option value="100%">Full Screen (100% viewport)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="hideHeaderCheck" 
                checked={hideHeader} 
                onChange={(e) => setHideHeader(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <label htmlFor="hideHeaderCheck" className="text-slate-700 text-xs">
                Compact embed mode (simplifies navigation banner for clean integration)
              </label>
            </div>
          </div>

          {/* Code block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Embed Code</span>
              <a 
                href={embedUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 text-xs font-medium"
              >
                Test Embed URL <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800">
                {iframeCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded text-xs font-medium transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs leading-relaxed">
            <span className="font-semibold">Deployment Tip:</span> When hosted on GitHub Pages (e.g. <code className="bg-amber-100 px-1 py-0.5 rounded">https://&lt;user&gt;.github.io/&lt;repo&gt;/</code>), all asset paths are relative, meaning this iframe works out-of-the-box on any external domain without cross-origin configuration issues.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
