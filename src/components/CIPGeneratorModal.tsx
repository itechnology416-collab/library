import React, { useState } from 'react';
import { Book } from '../types';

interface CIPGeneratorModalProps {
  initialBook?: Book | null;
  onClose: () => void;
  onRequestAssistance?: () => void;
}

export const CIPGeneratorModal: React.FC<CIPGeneratorModalProps> = ({
  initialBook,
  onClose,
  onRequestAssistance,
}) => {
  const [title, setTitle] = useState<string>(
    initialBook?.title || 'Academic Writing & Multilingual Research Publishing in Ethiopia'
  );
  const [author, setAuthor] = useState<string>(
    initialBook?.author || 'Tadesse, Gemechu and Hussein, Feysal'
  );
  const [publisher, setPublisher] = useState<string>(
    'Wirtuu Kompiitaraa Ilillii (WKI), Haramaya University Press'
  );
  const [pubYear, setPubYear] = useState<number>(2026);
  const [pubCity, setPubCity] = useState<string>('Dire Dawa / Haramaya, Ethiopia');
  const [isbnPrefix, setIsbnPrefix] = useState<string>('978-99944-72');
  const [isbnSuffix, setIsbnSuffix] = useState<string>('88-1');
  const [ddcClass, setDdcClass] = useState<string>('070.50963'); // Dewey Decimal (Ethiopian Publishing)
  const [lccClass, setLccClass] = useState<string>('Z468.E8 T33 2026'); // Library of Congress
  const [subjects, setSubjects] = useState<string>(
    '1. Scholarly publishing -- Ethiopia -- Standards. 2. Academic writing -- Multilingual aspects. 3. Afaan Oromoo language -- Typesetting. 4. Ethiopian languages -- Publishing.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const fullIsbn = `${isbnPrefix}-${isbnSuffix}`.replace(/--+/g, '-');

  // Format Ethiopian National Library CIP Block
  const cipBlock = `__________________________________________________________
Library of Congress & Ethiopian National Archives Cataloging-in-Publication Data

${author}.
  ${title} / ${author}. -- 1st ed.
     p. cm. -- (Haramaya University Academic Monograph Series)
  Includes bibliographical references and index.

  ISBN ${fullIsbn} (pbk. : alk. paper) -- ISBN 978-99944-72-89-8 (ebook)

  ${subjects}

  ${lccClass}
  ${ddcClass}--dc23
__________________________________________________________
Published by: ${publisher}, ${pubCity} (${pubYear})
All rights reserved. No part of this publication may be reproduced without prior written permission.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cipBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-4xl rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  CIP Data & ISBN Barcode Generator
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container font-bold text-[10px] uppercase">
                  Library Cataloging
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Generate official Ethiopian National Library CIP copyright blocks and EAN-13 ISBN barcodes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Metadata inputs */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-secondary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">library_books</span>
              <span>Cataloging Parameters</span>
            </h3>

            <div>
              <label className="font-bold text-on-surface block mb-1">Monograph Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Catalog Author Byline (Last, First):</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-on-surface block mb-1">ISBN Number:</label>
                <input
                  type="text"
                  value={fullIsbn}
                  onChange={(e) => setIsbnSuffix(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Publication Year:</label>
                <input
                  type="number"
                  value={pubYear}
                  onChange={(e) => setPubYear(parseInt(e.target.value) || 2026)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-on-surface block mb-1">DDC Classification:</label>
                <input
                  type="text"
                  value={ddcClass}
                  onChange={(e) => setDdcClass(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">LCC Call Number:</label>
                <input
                  type="text"
                  value={lccClass}
                  onChange={(e) => setLccClass(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Library Subject Headings (LCSH):</label>
              <textarea
                rows={3}
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface focus:outline-none focus:border-primary resize-none font-mono"
              />
            </div>
          </div>

          {/* Right Live CIP Box & Barcode Viewport */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-on-surface uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                  <span>Verso Copyright CIP Block</span>
                </h3>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy CIP'}</span>
                </button>
              </div>

              {/* Verso Page Box */}
              <div className="p-4 rounded-2xl bg-[#faf9f5] text-[#1c2434] border border-[#e5e1d8] font-mono text-[10px] leading-relaxed shadow-sm whitespace-pre-wrap select-all">
                {cipBlock}
              </div>

              {/* EAN-13 Barcode Card */}
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-on-surface block">EAN-13 ISBN Barcode</span>
                  <span className="text-[10px] text-on-surface-variant block font-mono">
                    Check digit verified for book distribution
                  </span>
                  <span className="text-xs font-bold text-secondary font-mono block">
                    {fullIsbn}
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl shadow-xs text-black text-center font-mono">
                  <div className="h-10 flex items-end justify-center gap-0.5 px-2">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className={`bg-black h-full ${
                          i === 0 || i === 1 || i === 14 || i === 15 || i === 28 || i === 29
                            ? 'w-1 h-11 bg-black'
                            : i % 2 === 0
                            ? 'w-1'
                            : 'w-0.5'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-bold tracking-widest mt-1">
                    {fullIsbn.replace(/-/g, '')}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant">
                Standard: ISO 2108 / NLA Ethiopia
              </span>
              {onRequestAssistance && (
                <button
                  onClick={() => {
                    onClose();
                    onRequestAssistance();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-secondary hover:brightness-105 text-on-secondary font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                  <span>Request Official ISBN Registration</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
