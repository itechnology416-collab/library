import React, { useState } from 'react';
import { Book } from '../types';

interface BookCoverStudioModalProps {
  initialBook?: Book | null;
  onClose: () => void;
  onRequestPrintOrder?: (specs: any) => void;
}

export const BookCoverStudioModal: React.FC<BookCoverStudioModalProps> = ({
  initialBook,
  onClose,
  onRequestPrintOrder,
}) => {
  // Config state
  const [bookTitle, setBookTitle] = useState<string>(
    initialBook?.title || 'Academic Writing & Multilingual Research Publishing'
  );
  const [authorName, setAuthorName] = useState<string>(
    initialBook?.author || 'Dr. Gemechu Tadesse & Mr. Feysal Hussein'
  );
  const [subtitle, setSubtitle] = useState<string>(
    'A Practical Guide for Horn of Africa Postgraduate Scholars & Editors'
  );
  const [publisher, setPublisher] = useState<string>(
    'Wirtuu Kompiitaraa Ilillii (WKI) • Haramaya University Press'
  );
  const [isbn, setIsbn] = useState<string>(
    initialBook?.isbn || '978-99944-72-88-1'
  );
  const [pageCount, setPageCount] = useState<number>(initialBook?.pageCount || 240);
  const [paperWeight, setPaperWeight] = useState<number>(80); // 70gsm, 80gsm, 100gsm
  const [bindingType, setBindingType] = useState<'perfect' | 'hardcover' | 'saddle'>('perfect');
  const [coverTheme, setCoverTheme] = useState<'emerald' | 'navy' | 'burgundy' | 'charcoal'>('emerald');
  const [viewAngle, setViewAngle] = useState<'jacket_flat' | '3d_perspective'>('jacket_flat');
  const [blurbText, setBlurbText] = useState<string>(
    'This comprehensive monograph provides university researchers, graduate students, and peer reviewers with authoritative guidelines for multilingual typesetting in Afaan Oromoo, Amharic, and Arabic. Features verified LaTeX Beamer templates, institutional formatting rules, and digital preservation workflows certified at Haramaya University.'
  );

  // Precise Spine Calculation:
  // Caliper: 70gsm = 0.09mm, 80gsm = 0.105mm, 100gsm = 0.13mm per leaf (2 pages)
  const caliperMap: Record<number, number> = {
    70: 0.09,
    80: 0.105,
    100: 0.13,
  };
  const leafCount = Math.ceil(pageCount / 2);
  const rawSpineMm = leafCount * (caliperMap[paperWeight] || 0.105);
  const boardAllowance = bindingType === 'hardcover' ? 3.0 : 0.4;
  const spineWidthMm = Math.max(
    bindingType === 'saddle' ? 1.0 : 3.0,
    Math.round((rawSpineMm + boardAllowance) * 10) / 10
  );

  // Standard Trim Sizes (Standard Academic Royal B5: 176mm x 250mm or US Crown: 152mm x 229mm)
  const trimWidthMm = 176;
  const trimHeightMm = 250;
  const bleedMm = 3;
  const totalJacketWidthMm = Math.round((trimWidthMm * 2 + spineWidthMm + bleedMm * 2) * 10) / 10;
  const totalJacketHeightMm = trimHeightMm + bleedMm * 2;

  // Theme palettes
  const themes = {
    emerald: {
      bg: 'from-[#0b3c1e] via-[#082e16] to-[#041a0d]',
      accent: 'text-[#ffd7a8]',
      border: 'border-[#1b5e20]',
      badge: 'bg-[#1b5e20] text-[#ffd7a8]',
      hex: '#0b3c1e',
    },
    navy: {
      bg: 'from-[#0b1c30] via-[#081525] to-[#040a12]',
      accent: 'text-[#90caf9]',
      border: 'border-[#1e3a5f]',
      badge: 'bg-[#1e3a5f] text-[#90caf9]',
      hex: '#0b1c30',
    },
    burgundy: {
      bg: 'from-[#4a0e17] via-[#380910] to-[#200408]',
      accent: 'text-[#ffcdd2]',
      border: 'border-[#6a1522]',
      badge: 'bg-[#6a1522] text-[#ffcdd2]',
      hex: '#4a0e17',
    },
    charcoal: {
      bg: 'from-[#1e232a] via-[#15191e] to-[#0d1013]',
      accent: 'text-[#e0e0e0]',
      border: 'border-[#333a44]',
      badge: 'bg-[#333a44] text-white',
      hex: '#1e232a',
    },
  };

  const currentPalette = themes[coverTheme];

  const handlePrintSpecs = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-6xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[94vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">book_online</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Monograph Book Jacket & Spine Studio
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase">
                  Print Pre-Press
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Mathematical spine caliper calculator, 3D jacket visualizer & prepress PDF geometry specs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-surface-container-high p-0.5 border border-outline-variant/20">
              <button
                onClick={() => setViewAngle('jacket_flat')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewAngle === 'jacket_flat'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Flat Jacket
              </button>
              <button
                onClick={() => setViewAngle('3d_perspective')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewAngle === '3d_perspective'
                    ? 'bg-surface text-secondary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                3D Hardcover
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/20">
          
          {/* Left Parameter Panel */}
          <div className="lg:col-span-4 p-5 space-y-4 bg-surface-container-lowest overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">straighten</span>
              <span>Spine & Mechanical Parameters</span>
            </h3>

            {/* Calculated Spine Metric Pill */}
            <div className="p-4 rounded-2xl bg-surface border border-secondary/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Calculated Spine Width:</span>
                <span className="text-xl font-black font-mono text-secondary">
                  {spineWidthMm} mm
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <div>Total Spread: <strong className="text-on-surface">{totalJacketWidthMm} mm</strong></div>
                <div>Trim Height: <strong className="text-on-surface">{totalJacketHeightMm} mm</strong></div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Book Monograph Title:
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Author / Editorial Byline:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Subtitle:</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Page Count:</label>
                  <input
                    type="number"
                    min="20"
                    max="1200"
                    step="4"
                    value={pageCount}
                    onChange={(e) => setPageCount(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Paper Stock (GSM):</label>
                  <select
                    value={paperWeight}
                    onChange={(e) => setPaperWeight(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/30 text-on-surface font-mono"
                  >
                    <option value={70}>70 gsm (Standard)</option>
                    <option value={80}>80 gsm (Wood-free)</option>
                    <option value={100}>100 gsm (Art/Gloss)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Binding Style:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'perfect', label: 'Perfect Bound' },
                    { id: 'hardcover', label: 'Case Hardcover' },
                    { id: 'saddle', label: 'Saddle Stitch' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBindingType(b.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        bindingType === b.id
                          ? 'border-secondary bg-surface font-bold text-secondary shadow-xs'
                          : 'border-outline-variant/20 bg-surface/50 text-on-surface-variant hover:bg-surface'
                      }`}
                    >
                      <span className="text-[10px] block">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Jacket Color Palette:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'emerald', label: 'Emerald', bg: 'bg-[#0b3c1e]' },
                    { id: 'navy', label: 'Navy', bg: 'bg-[#0b1c30]' },
                    { id: 'burgundy', label: 'Burgundy', bg: 'bg-[#4a0e17]' },
                    { id: 'charcoal', label: 'Charcoal', bg: 'bg-[#1e232a]' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCoverTheme(c.id as any)}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        coverTheme === c.id
                          ? 'border-secondary bg-surface font-bold text-secondary shadow-xs'
                          : 'border-outline-variant/20 bg-surface/50 text-on-surface-variant hover:bg-surface'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${c.bg} mx-auto block mb-1`} />
                      <span className="text-[9px] block">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Back Cover Synopsis:</label>
                <textarea
                  rows={3}
                  value={blurbText}
                  onChange={(e) => setBlurbText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-[11px] text-on-surface focus:outline-none focus:border-secondary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Preview Viewport */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4 bg-surface">
            
            {/* VIEW 1: Flat Jacket Spread */}
            {viewAngle === 'jacket_flat' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">crop_free</span>
                    <span>Full Mechanical Jacket Spread (Back + Spine + Front)</span>
                  </span>
                  <span className="text-on-surface-variant font-mono text-[11px]">
                    {totalJacketWidthMm} × {totalJacketHeightMm} mm
                  </span>
                </div>

                {/* Flat Spread Canvas */}
                <div className="p-3 bg-surface-container-highest rounded-2xl border border-outline-variant/30 overflow-x-auto shadow-inner">
                  <div
                    className={`min-w-[620px] aspect-[2.2/1] rounded-xl bg-gradient-to-r ${currentPalette.bg} text-white p-4 grid grid-cols-12 gap-1 shadow-2xl relative border ${currentPalette.border}`}
                  >
                    {/* BACK COVER (Cols 1 to 5) */}
                    <div className="col-span-5 p-3 flex flex-col justify-between border-r border-white/15 bg-black/10 rounded-l-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-white/70">school</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                            Haramaya University Press
                          </span>
                        </div>
                        <h4 className="text-xs font-bold font-serif text-white/95">
                          About this Publication
                        </h4>
                        <p className="text-[10px] text-white/80 leading-relaxed font-sans line-clamp-6">
                          {blurbText}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                        {/* Fake Barcode graphic */}
                        <div className="bg-white p-1.5 rounded text-black font-mono text-[8px] space-y-0.5">
                          <div className="h-6 flex items-end gap-0.5">
                            {Array.from({ length: 22 }).map((_, i) => (
                              <span
                                key={i}
                                className={`bg-black h-full ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}
                              />
                            ))}
                          </div>
                          <div className="text-center font-bold tracking-tighter">
                            {isbn}
                          </div>
                        </div>

                        <div className="text-right text-[9px] text-white/70 font-mono">
                          <div>Royal B5 Edition</div>
                          <div>WKI Press 2026</div>
                        </div>
                      </div>
                    </div>

                    {/* SPINE (Col 6 - 7 center) */}
                    <div className="col-span-2 flex flex-col justify-between items-center py-3 bg-black/25 text-center border-r border-white/15 overflow-hidden">
                      <span className="text-[9px] font-bold text-white/60">WKI</span>
                      <div className="writing-mode-vertical rotate-180 text-[11px] font-serif font-bold text-white/90 tracking-wide truncate max-h-[160px]">
                        {bookTitle} — {authorName.split('&')[0]}
                      </div>
                      <span className="text-[8px] font-mono text-white/60">{spineWidthMm}mm</span>
                    </div>

                    {/* FRONT COVER (Cols 8 to 12) */}
                    <div className="col-span-5 p-4 flex flex-col justify-between bg-black/10 rounded-r-lg relative overflow-hidden">
                      {/* Decorative Seal */}
                      <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px]">auto_stories</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${currentPalette.badge}`}>
                            Scholarly Monograph
                          </span>
                          <span className="text-[9px] font-mono text-white/70">HARAMAYA</span>
                        </div>

                        <h3 className={`text-base font-black font-serif leading-tight ${currentPalette.accent}`}>
                          {bookTitle}
                        </h3>

                        <p className="text-[10px] text-white/80 font-sans italic">
                          {subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/20">
                        <div className="text-xs font-bold text-white/95">
                          {authorName}
                        </div>
                        <div className="text-[9px] text-white/70 font-medium">
                          {publisher}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: 3D Hardcover Perspective */}
            {viewAngle === '3d_perspective' && (
              <div className="space-y-4 text-center py-6">
                <div className="flex justify-center perspective-1000">
                  <div
                    className={`w-64 h-96 rounded-r-2xl rounded-l-md bg-gradient-to-br ${currentPalette.bg} text-white p-6 flex flex-col justify-between shadow-2xl relative border-t-2 border-r-4 border-b-4 border-[#ffffff20] transform rotate-y-[-15deg] rotate-x-[5deg] hover:rotate-y-[0deg] transition-all duration-300`}
                    style={{
                      boxShadow: '20px 20px 50px rgba(0,0,0,0.5), -5px 0 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Spine Ridge Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent rounded-l-md" />

                    <div className="space-y-3 pl-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                        Haramaya University Press
                      </div>
                      <h3 className={`text-lg font-black font-serif leading-tight ${currentPalette.accent}`}>
                        {bookTitle}
                      </h3>
                      <p className="text-xs text-white/80 italic font-sans line-clamp-2">
                        {subtitle}
                      </p>
                    </div>

                    <div className="pl-2 pt-4 border-t border-white/20">
                      <div className="text-xs font-bold text-white/95">{authorName}</div>
                      <div className="text-[10px] text-white/70 mt-0.5 font-mono">{isbn}</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant font-mono">
                  3D Simulation with {spineWidthMm}mm Perfect Spine & 3mm Trim Bleed
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant">
                Standard: ISO 216 B5 Academic Trim • 300 DPI Pre-Press Ready
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSpecs}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Pre-Press Spec Sheet</span>
                </button>
                {onRequestPrintOrder && (
                  <button
                    onClick={() => {
                      onClose();
                      onRequestPrintOrder({
                        title: bookTitle,
                        author: authorName,
                        spineMm: spineWidthMm,
                        pages: pageCount,
                        coverTheme,
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>Submit for Offset Printing</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
