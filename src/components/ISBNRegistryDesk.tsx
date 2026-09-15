import React, { useState } from 'react';
import { ISBNRecord } from '../types';

interface ISBNRegistryDeskProps {
  records: ISBNRecord[];
  onAllocateISBN: (newRecord: Partial<ISBNRecord>) => void;
  onShowToast?: (msg: string) => void;
}

export const ISBNRegistryDesk: React.FC<ISBNRegistryDeskProps> = ({
  records,
  onAllocateISBN,
  onShowToast,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationType, setPublicationType] = useState<'Monograph' | 'Edited Volume' | 'Dissertation' | 'Conference Proceedings' | 'Journal Issue'>('Monograph');
  const [format, setFormat] = useState<'Hardcover' | 'Paperback' | 'Digital PDF' | 'EPUB'>('Hardcover');
  const [retailPriceETB, setRetailPriceETB] = useState<number>(450);

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      if (onShowToast) onShowToast('Please provide publication title and author.');
      return;
    }

    onAllocateISBN({
      title: title.trim(),
      author: author.trim(),
      publicationType,
      format,
      retailPriceETB: Number(retailPriceETB),
    });

    setShowModal(false);
    setTitle('');
    setAuthor('');
    if (onShowToast) onShowToast(`National ISBN & DOI allocated for "${title}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[11px] uppercase tracking-wider">
              Phase 6 Module
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              National Library and Archives of Ethiopia (NLAE) & Crossref Registrar
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-on-surface">
            National ISBN & Crossref DOI Allocation Registry
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Administer the institutional publisher block (Prefix 978-99944-72), mint digital persistent identifiers, and enforce legal depository mandates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 hover:brightness-105 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Allocate New ISBN / DOI</span>
        </button>
      </div>

      {/* Registry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Allocated ISBNs</span>
            <span className="material-symbols-outlined text-[20px]">barcode</span>
          </div>
          <span className="text-2xl font-black text-on-surface">{records.length}</span>
          <span className="text-[11px] text-on-surface-variant block font-medium mt-1">
            Block: 978-99944-72-XX
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Legal Depository Met</span>
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {records.filter((r) => r.depositWithNationalLibrary).length}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
            National Archives Deposit (Addis)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Active In-Print</span>
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {records.filter((r) => r.status === 'In Print / Circulating').length}
          </span>
          <span className="text-[11px] text-blue-700 dark:text-blue-400 block font-semibold mt-1">
            Distributed in Bookstores
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Crossref DOIs</span>
            <span className="material-symbols-outlined text-[20px]">fingerprint</span>
          </div>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{records.length}</span>
          <span className="text-[11px] text-purple-700 dark:text-purple-400 block font-semibold mt-1">
            Prefix 10.20372 / wki
          </span>
        </div>
      </div>

      {/* ISBN Records Table & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 transition-all space-y-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  {rec.publicationType} • {rec.format}
                </span>
                <h4 className="text-base font-bold font-serif text-on-surface pt-2">
                  {rec.title}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  By <strong className="text-on-surface">{rec.author}</strong>
                </p>
              </div>

              {/* Barcode Visualization Graphic */}
              <div className="p-2.5 rounded-xl bg-white text-black border border-slate-300 text-center shrink-0 shadow-xs">
                <div className="flex items-center justify-center gap-0.5 h-10 px-1">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1].map((w, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-black"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono font-bold tracking-tighter block mt-0.5">
                  {rec.isbn}
                </span>
              </div>
            </div>

            {/* Identifiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-surface-container">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                  Official ISBN-13
                </span>
                <span className="font-mono font-bold text-on-surface">{rec.isbn}</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                  Crossref Digital Object Identifier (DOI)
                </span>
                <span className="font-mono font-bold text-secondary">
                  {rec.doiPrefix}/{rec.doiSuffix}
                </span>
              </div>
            </div>

            {/* Status & Compliance Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-outline-variant/20">
              <span className="font-medium text-on-surface-variant">
                Allocated: <strong className="text-on-surface">{rec.allocatedDate}</strong>
                {rec.retailPriceETB && (
                  <> • Retail: <strong className="text-emerald-600 font-mono">{rec.retailPriceETB} ETB</strong></>
                )}
              </span>

              {rec.depositWithNationalLibrary ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Legal Deposit Deposited</span>
                </span>
              ) : (
                <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  <span>Pending Archival Deposit</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
                </span>
                <h3 className="text-lg font-bold font-serif text-on-surface">
                  Allocate National ISBN & Crossref DOI
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Book / Monograph Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Climate-Resilient Enset Farming Systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Author / Lead Editor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Mengistu Ketema"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Publication Type</label>
                  <select
                    value={publicationType}
                    onChange={(e) => setPublicationType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="Monograph">Scholarly Monograph</option>
                    <option value="Edited Volume">Edited Volume</option>
                    <option value="Dissertation">Postgraduate Dissertation</option>
                    <option value="Conference Proceedings">Conference Proceedings</option>
                    <option value="Journal Issue">Journal Issue</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Publication Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="Hardcover">Case-Bound Hardcover</option>
                    <option value="Paperback">Perfect Bound Paperback</option>
                    <option value="Digital PDF">Open-Access PDF</option>
                    <option value="EPUB">Reflowable EPUB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Retail Price (ETB)</label>
                <input
                  type="number"
                  value={retailPriceETB}
                  onChange={(e) => setRetailPriceETB(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[11px] text-on-surface-variant space-y-1">
                <p className="font-bold text-on-surface">Official Allocator Rule:</p>
                <p>
                  Minting allocates an ISBN from the official Haramaya Press range and associates Crossref DOI prefix <strong>10.20372/wki</strong>. Two deposit copies must be submitted to NLAE Addis Ababa within 90 days.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 transition-all cursor-pointer shadow-sm"
                >
                  Generate & Register Identifiers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
