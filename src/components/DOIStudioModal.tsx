import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Book, DOIMetadataState } from '../types';

interface DOIStudioModalProps {
  initialBook?: Book | null;
  onClose: () => void;
  onAssignToBook?: (doiString: string) => void;
}

export const DOIStudioModal: React.FC<DOIStudioModalProps> = ({
  initialBook,
  onClose,
  onAssignToBook,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'crossref_xml' | 'datacite_json' | 'resolution'>('form');
  const [copied, setCopied] = useState<string | null>(null);

  const [metadata, setMetadata] = useState<DOIMetadataState>({
    prefix: '10.20372', // Official Haramaya University DOI prefix
    suffix: initialBook ? `wki.mono.${initialBook.id}` : 'eajs.v18i2.04',
    title: initialBook?.title || 'Genetic Diversity and Quality Attributes of Harar Coffee Varieties',
    subtitle: initialBook?.subtitle || 'An Agro-Morphological and Biochemical Characterization',
    publicationType: initialBook ? 'book_monograph' : 'journal_article',
    journalOrBookTitle: initialBook ? 'WKI Haramaya Academic Monographs Series' : 'East African Journal of Sciences (EAJS)',
    volume: '18',
    issue: '2',
    firstPage: '105',
    lastPage: '124',
    publicationDate: new Date().toISOString().split('T')[0],
    authors: [
      {
        givenName: initialBook?.author.split(' ')[0] || 'Abebe',
        familyName: initialBook?.author.split(' ').slice(1).join(' ') || 'Tadesse',
        orcid: '0000-0002-1825-0097',
        affiliation: 'Department of Plant Sciences, College of Agriculture, Haramaya University',
      },
      {
        givenName: 'Gemechu',
        familyName: 'Keneni',
        orcid: '0000-0003-4921-8812',
        affiliation: 'Haramaya University Research Directorate, P.O. Box 138, Dire Dawa, Ethiopia',
      },
    ],
    funderName: 'Ethiopian Ministry of Innovation & Technology (MInT) / HU RGD',
    grantNumber: 'HU-RGD-2025-AGRO-09',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    abstract:
      initialBook?.abstract ||
      'This study assesses the phenotypic diversity and cup quality traits among 42 arabica coffee accessions collected across the Hararghe highlands. Significant variations were detected in caffeine content, chlorogenic acids, and organoleptic fragrance profiles, supporting selective breeding for regional specialty exports.',
    targetUrl: `https://publishing.haramaya.edu.et/doi/10.20372/${initialBook ? `wki.mono.${initialBook.id}` : 'eajs.v18i2.04'}`,
  });

  const fullDOI = useMemo(() => {
    const cleanPrefix = metadata.prefix.trim().replace(/\/$/, '');
    const cleanSuffix = metadata.suffix.trim().replace(/^\//, '');
    return `${cleanPrefix}/${cleanSuffix}`;
  }, [metadata.prefix, metadata.suffix]);

  // Generate official CrossRef 5.3.1 XML
  const crossrefXML = useMemo(() => {
    const timestamp = Date.now();
    const authorsXML = metadata.authors
      .map(
        (a, i) => `        <person_name sequence="${i === 0 ? 'first' : 'additional'}" contributor_role="author">
          <given_name>${a.givenName}</given_name>
          <surname>${a.familyName}</surname>
          ${a.orcid ? `<ORCID>https://orcid.org/${a.orcid}</ORCID>` : ''}
          <affiliation>${a.affiliation}</affiliation>
        </person_name>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch version="5.3.1" xmlns="http://www.crossref.org/schema/5.3.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.crossref.org/schema/5.3.1 https://www.crossref.org/schemas/crossref5.3.1.xsd">
  <head>
    <doi_batch_id>HU-WKI-${timestamp}</doi_batch_id>
    <timestamp>${timestamp}</timestamp>
    <depositor>
      <depositor_name>WKI Haramaya University Press Office</depositor_name>
      <email_address>press-registry@haramaya.edu.et</email_address>
    </depositor>
    <registrant>Haramaya University Directorate of Research</registrant>
  </head>
  <body>
    <journal>
      <journal_metadata language="en">
        <full_title>${metadata.journalOrBookTitle}</full_title>
        <abbrev_title>EAJS</abbrev_title>
        <issn media_type="electronic">1992-0407</issn>
        <issn media_type="print">0257-2524</issn>
      </journal_metadata>
      <journal_issue>
        <publication_date media_type="online">
          <year>${metadata.publicationDate.split('-')[0]}</year>
          <month>${metadata.publicationDate.split('-')[1] || '06'}</month>
          <day>${metadata.publicationDate.split('-')[2] || '01'}</day>
        </publication_date>
        <journal_volume>
          <volume>${metadata.volume || '18'}</volume>
        </journal_volume>
        <issue>${metadata.issue || '2'}</issue>
      </journal_issue>
      <journal_article publication_type="full_text">
        <titles>
          <title>${metadata.title}</title>
          ${metadata.subtitle ? `<subtitle>${metadata.subtitle}</subtitle>` : ''}
        </titles>
        <contributors>
${authorsXML}
        </contributors>
        <abstract xmlns="http://www.ncbi.nlm.nih.gov/JATS1">
          <p>${metadata.abstract}</p>
        </abstract>
        <publication_date media_type="online">
          <year>${metadata.publicationDate.split('-')[0]}</year>
          <month>${metadata.publicationDate.split('-')[1] || '06'}</month>
          <day>${metadata.publicationDate.split('-')[2] || '01'}</day>
        </publication_date>
        <pages>
          <first_page>${metadata.firstPage || '1'}</first_page>
          <last_page>${metadata.lastPage || '20'}</last_page>
        </pages>
        <program xmlns="http://www.crossref.org/fundref.xsd">
          <assertion name="funder_name">${metadata.funderName}</assertion>
          <assertion name="award_number">${metadata.grantNumber}</assertion>
        </program>
        <program xmlns="http://www.crossref.org/AccessIndicators.xsd">
          <free_to_read/>
          <license_ref applies_to="vor">${metadata.licenseUrl}</license_ref>
        </program>
        <doi_data>
          <doi>${fullDOI}</doi>
          <resource>${metadata.targetUrl}</resource>
        </doi_data>
      </journal_article>
    </journal>
  </body>
</doi_batch>`;
  }, [metadata, fullDOI]);

  // Generate DataCite JSON-LD
  const dataciteJSON = useMemo(() => {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        '@id': `https://doi.org/${fullDOI}`,
        identifier: fullDOI,
        name: metadata.title,
        headline: metadata.title,
        isPartOf: {
          '@type': 'Periodical',
          name: metadata.journalOrBookTitle,
          volumeNumber: metadata.volume,
          issueNumber: metadata.issue,
        },
        author: metadata.authors.map((a) => ({
          '@type': 'Person',
          name: `${a.givenName} ${a.familyName}`,
          givenName: a.givenName,
          familyName: a.familyName,
          sameAs: a.orcid ? `https://orcid.org/${a.orcid}` : undefined,
          affiliation: {
            '@type': 'Organization',
            name: a.affiliation,
          },
        })),
        datePublished: metadata.publicationDate,
        description: metadata.abstract,
        license: metadata.licenseUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Haramaya University Press (WKI)',
          url: 'https://publishing.haramaya.edu.et',
        },
        funder: {
          '@type': 'Organization',
          name: metadata.funderName,
        },
        url: metadata.targetUrl,
      },
      null,
      2
    );
  }, [metadata, fullDOI]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleAddAuthor = () => {
    setMetadata({
      ...metadata,
      authors: [
        ...metadata.authors,
        {
          givenName: '',
          familyName: '',
          orcid: '',
          affiliation: 'Haramaya University',
        },
      ],
    });
  };

  const handleRemoveAuthor = (index: number) => {
    if (metadata.authors.length <= 1) return;
    setMetadata({
      ...metadata,
      authors: metadata.authors.filter((_, i) => i !== index),
    });
  };

  return (
    <div
      id="doi-studio-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-6xl h-[92vh] max-h-[920px] bg-surface-container-lowest dark:bg-surface rounded-2xl shadow-2xl border border-outline/20 flex flex-col overflow-hidden text-on-surface"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-outline/15 flex items-center justify-between bg-surface-container/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">tag</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif truncate">
                  Digital Object Identifier (DOI) & CrossRef Schema Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-on-primary">
                  IDF / CrossRef 5.3.1
                </span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">
                Official metadata schema, ORCID linking, funder registry & XML deposit packager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'form' ? 'bg-surface shadow-xs font-bold text-primary' : 'text-on-surface-variant'
                }`}
              >
                Metadata
              </button>
              <button
                onClick={() => setActiveTab('crossref_xml')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'crossref_xml' ? 'bg-surface shadow-xs font-bold text-primary' : 'text-on-surface-variant'
                }`}
              >
                CrossRef XML
              </button>
              <button
                onClick={() => setActiveTab('datacite_json')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'datacite_json' ? 'bg-surface shadow-xs font-bold text-primary' : 'text-on-surface-variant'
                }`}
              >
                DataCite JSON-LD
              </button>
              <button
                onClick={() => setActiveTab('resolution')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'resolution' ? 'bg-surface shadow-xs font-bold text-primary' : 'text-on-surface-variant'
                }`}
              >
                Resolver Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* TAB 1: Metadata Form */}
          {activeTab === 'form' && (
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 cols: Metadata inputs */}
              <div className="lg:col-span-8 space-y-4">
                {/* Live DOI Preview Banner */}
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">link</span>
                    <span className="text-xs text-on-surface-variant font-bold">Assigned DOI:</span>
                    <span className="font-mono font-bold text-sm text-primary truncate">
                      https://doi.org/{fullDOI}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`https://doi.org/${fullDOI}`, 'doi')}
                    className="px-2.5 py-1 rounded-md bg-surface text-xs font-mono font-bold hover:bg-surface-container transition-colors cursor-pointer border border-outline/20 flex-shrink-0"
                  >
                    {copied === 'doi' ? 'Copied!' : 'Copy DOI'}
                  </button>
                </div>

                {/* Prefix & Suffix Generator */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      HU DOI Prefix
                    </label>
                    <input
                      type="text"
                      value={metadata.prefix}
                      onChange={(e) => setMetadata({ ...metadata, prefix: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Unique Suffix Key
                    </label>
                    <input
                      type="text"
                      value={metadata.suffix}
                      onChange={(e) => setMetadata({ ...metadata, suffix: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-surface border border-outline/20"
                      placeholder="e.g. eajs.v18i2.04 or wki.mono.soil-2026"
                    />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Scholarly Title
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-surface border border-outline/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={metadata.subtitle || ''}
                    onChange={(e) => setMetadata({ ...metadata, subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                  />
                </div>

                {/* Journal / Book Series & Issue Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Container Publication / Journal
                    </label>
                    <input
                      type="text"
                      value={metadata.journalOrBookTitle}
                      onChange={(e) => setMetadata({ ...metadata, journalOrBookTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Volume / Issue
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Vol"
                        value={metadata.volume || ''}
                        onChange={(e) => setMetadata({ ...metadata, volume: e.target.value })}
                        className="w-1/2 px-2 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                      />
                      <input
                        type="text"
                        placeholder="No."
                        value={metadata.issue || ''}
                        onChange={(e) => setMetadata({ ...metadata, issue: e.target.value })}
                        className="w-1/2 px-2 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Page Range
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Start"
                        value={metadata.firstPage || ''}
                        onChange={(e) => setMetadata({ ...metadata, firstPage: e.target.value })}
                        className="w-1/2 px-2 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                      />
                      <input
                        type="text"
                        placeholder="End"
                        value={metadata.lastPage || ''}
                        onChange={(e) => setMetadata({ ...metadata, lastPage: e.target.value })}
                        className="w-1/2 px-2 py-2 text-xs rounded-lg bg-surface border border-outline/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Author List & ORCIDs */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">fingerprint</span>
                      Authors & ORCID Registry ({metadata.authors.length})
                    </label>
                    <button
                      onClick={handleAddAuthor}
                      className="text-xs text-primary font-bold hover:underline cursor-pointer"
                    >
                      + Add Author
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {metadata.authors.map((author, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface border border-outline/20 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                      >
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Given Name"
                            value={author.givenName}
                            onChange={(e) => {
                              const list = [...metadata.authors];
                              list[idx].givenName = e.target.value;
                              setMetadata({ ...metadata, authors: list });
                            }}
                            className="w-full px-2 py-1 text-xs rounded-md bg-surface border border-outline/20"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Surname"
                            value={author.familyName}
                            onChange={(e) => {
                              const list = [...metadata.authors];
                              list[idx].familyName = e.target.value;
                              setMetadata({ ...metadata, authors: list });
                            }}
                            className="w-full px-2 py-1 text-xs rounded-md bg-surface border border-outline/20"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="ORCID (0000-0002-...)"
                            value={author.orcid || ''}
                            onChange={(e) => {
                              const list = [...metadata.authors];
                              list[idx].orcid = e.target.value;
                              setMetadata({ ...metadata, authors: list });
                            }}
                            className="w-full px-2 py-1 text-xs font-mono rounded-md bg-surface border border-outline/20 text-emerald-700 dark:text-emerald-400"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="HU Department"
                            value={author.affiliation}
                            onChange={(e) => {
                              const list = [...metadata.authors];
                              list[idx].affiliation = e.target.value;
                              setMetadata({ ...metadata, authors: list });
                            }}
                            className="w-full px-2 py-1 text-xs rounded-md bg-surface border border-outline/20"
                          />
                        </div>
                        <div className="sm:col-span-1 text-center">
                          {metadata.authors.length > 1 && (
                            <button
                              onClick={() => handleRemoveAuthor(idx)}
                              className="text-error hover:bg-error/10 p-1 rounded-sm cursor-pointer"
                              title="Remove author"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Abstract (JATS / CrossRef format)
                  </label>
                  <textarea
                    rows={3}
                    value={metadata.abstract}
                    onChange={(e) => setMetadata({ ...metadata, abstract: e.target.value })}
                    className="w-full p-3 text-xs leading-relaxed rounded-lg bg-surface border border-outline/20"
                  />
                </div>
              </div>

              {/* Right 4 cols: Funder Registry & Open Access */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-xl bg-surface-container/60 border border-outline/15 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
                    Funder Registry (Crossref FundRef)
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Funder / Sponsor Name:
                    </label>
                    <input
                      type="text"
                      value={metadata.funderName || ''}
                      onChange={(e) => setMetadata({ ...metadata, funderName: e.target.value })}
                      className="w-full p-2 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Grant / Award Identifier:
                    </label>
                    <input
                      type="text"
                      value={metadata.grantNumber || ''}
                      onChange={(e) => setMetadata({ ...metadata, grantNumber: e.target.value })}
                      className="w-full p-2 text-xs font-mono rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                </div>

                {/* Open Access License */}
                <div className="p-4 rounded-xl bg-surface-container/60 border border-outline/15 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[18px]">lock_open</span>
                    Open Access & Licensing
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      License URI:
                    </label>
                    <select
                      value={metadata.licenseUrl}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          licenseUrl: e.target.value as DOIMetadataState['licenseUrl'],
                        })
                      }
                      className="w-full p-2 text-xs rounded-lg bg-surface border border-outline/20"
                    >
                      <option value="https://creativecommons.org/licenses/by/4.0/">
                        CC BY 4.0 (Creative Commons Attribution)
                      </option>
                      <option value="https://creativecommons.org/licenses/by-nc/4.0/">
                        CC BY-NC 4.0 (Non-Commercial)
                      </option>
                      <option value="https://creativecommons.org/licenses/by-sa/4.0/">
                        CC BY-SA 4.0 (ShareAlike)
                      </option>
                      <option value="https://creativecommons.org/publicdomain/zero/1.0/">
                        CC0 1.0 (Public Domain Dedication)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Landing Page URL Target:
                    </label>
                    <input
                      type="url"
                      value={metadata.targetUrl}
                      onChange={(e) => setMetadata({ ...metadata, targetUrl: e.target.value })}
                      className="w-full p-2 text-xs font-mono rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                </div>

                {/* Assign to Current Book Action */}
                {onAssignToBook && (
                  <button
                    onClick={() => {
                      onAssignToBook(fullDOI);
                      alert(`DOI ${fullDOI} assigned to monograph catalog entry!`);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    <span>Assign DOI to Monograph Entry</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CrossRef XML Schema View */}
          {activeTab === 'crossref_xml' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-primary">CrossRef 5.3.1 Deposit Payload</h3>
                  <p className="text-xs text-on-surface-variant">
                    Ready for batch upload to the CrossRef HTTPS Deposit API (doi.crossref.org)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(crossrefXML, 'xml')}
                    className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-bold border border-outline/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>{copied === 'xml' ? 'Copied!' : 'Copy XML'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([crossrefXML], { type: 'application/xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `crossref-deposit-${metadata.suffix.replace(/[^a-zA-Z0-9]/g, '_')}.xml`;
                      a.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download .XML</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline/20 font-mono text-xs overflow-x-auto max-h-[520px]">
                <pre className="text-on-surface leading-relaxed whitespace-pre">{crossrefXML}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: DataCite JSON-LD */}
          {activeTab === 'datacite_json' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-secondary">DataCite / Schema.org JSON-LD</h3>
                  <p className="text-xs text-on-surface-variant">
                    Embedding format for Google Scholar and institutional repository indexers
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(dataciteJSON, 'json')}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{copied === 'json' ? 'Copied!' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline/20 font-mono text-xs overflow-x-auto max-h-[520px]">
                <pre className="text-on-surface leading-relaxed whitespace-pre">{dataciteJSON}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: Resolver Preview */}
          {activeTab === 'resolution' && (
            <div className="p-5 sm:p-8 max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-surface border border-outline/20 shadow-lg space-y-4">
                <div className="flex items-center gap-3 border-b border-outline/10 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    DOI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-serif">{metadata.title}</h3>
                    <p className="text-xs font-mono text-primary">https://doi.org/{fullDOI}</p>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-on-surface leading-relaxed">
                  <p>
                    <strong>Published in:</strong> {metadata.journalOrBookTitle}, Vol. {metadata.volume}, No. {metadata.issue}, pp. {metadata.firstPage}-{metadata.lastPage}
                  </p>
                  <p>
                    <strong>Authors:</strong>{' '}
                    {metadata.authors.map((a) => `${a.givenName} ${a.familyName}`).join(', ')}
                  </p>
                  <p>
                    <strong>Publisher:</strong> Haramaya University Directorate of Research / WKI Press
                  </p>
                  <p>
                    <strong>License:</strong>{' '}
                    <span className="text-primary underline">{metadata.licenseUrl}</span>
                  </p>
                  <div className="p-3 rounded-lg bg-surface-container border border-outline/10 text-[11px] italic">
                    {metadata.abstract}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
