import React, { useState } from 'react';
import { RegistrarClearance, ClearanceStatus } from '../types';
import { ClearanceCertificateModal } from './ClearanceCertificateModal';

interface RegistrarClearanceDeskProps {
  clearances: RegistrarClearance[];
  onUpdateStatus: (
    id: string,
    status: ClearanceStatus,
    remarks?: string,
    verifiedBy?: string,
    hardcopyDelivered?: boolean,
    copiesCount?: number
  ) => void;
  onCreateClearance: (newClearance: Partial<RegistrarClearance>) => void;
  onShowToast?: (msg: string) => void;
}

export const RegistrarClearanceDesk: React.FC<RegistrarClearanceDeskProps> = ({
  clearances,
  onUpdateStatus,
  onCreateClearance,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<RegistrarClearance | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New dossier form state
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [academicProgram, setAcademicProgram] = useState<'MSc' | 'PhD' | 'PostDoc'>('MSc');
  const [department, setDepartment] = useState('Agricultural Economics & Agribusiness');
  const [college, setCollege] = useState('College of Agriculture & Environmental Sciences');
  const [thesisTitle, setThesisTitle] = useState('');
  const [advisorName, setAdvisorName] = useState('Dr. Gemechu Desta');
  const [defenseDate, setDefenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [plagiarismSimilarityPct, setPlagiarismSimilarityPct] = useState(9.5);

  const filtered = clearances.filter((c) => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.studentName.toLowerCase().includes(q) ||
      c.studentId.toLowerCase().includes(q) ||
      c.thesisTitle.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim() || !thesisTitle.trim()) {
      if (onShowToast) onShowToast('Please complete candidate name, ID, and thesis title.');
      return;
    }

    onCreateClearance({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      academicProgram,
      department,
      college,
      thesisTitle: thesisTitle.trim(),
      advisorName: advisorName.trim(),
      defenseDate,
      plagiarismSimilarityPct: Number(plagiarismSimilarityPct),
      remarks: 'Initial clearance dossier submitted for Registrar and Library verification.',
    });

    setShowAddModal(false);
    setStudentName('');
    setStudentId('');
    setThesisTitle('');
    if (onShowToast) onShowToast(`Clearance dossier initiated for ${studentName}`);
  };

  const getStatusBadge = (status: ClearanceStatus) => {
    switch (status) {
      case 'Approved & Cleared':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Library Hardcopy Received':
        return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
      case 'Plagiarism Audit Passed':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'Department Verified':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'Revisions Required':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      default:
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
    }
  };

  const clearedCount = clearances.filter((c) => c.status === 'Approved & Cleared').length;
  const pendingCount = clearances.filter((c) => c.status !== 'Approved & Cleared' && c.status !== 'Revisions Required').length;
  const revisionsCount = clearances.filter((c) => c.status === 'Revisions Required').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[11px] uppercase tracking-wider">
              Phase 6 Module
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Postgraduate Studies Directorate & Central Library Desk
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-on-surface">
            Registrar Academic Clearance & Archival Depository Desk
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit anti-plagiarism threshold compliance, verify physical hardbound copies in the university repository, and issue official graduation clearance certificates.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 hover:brightness-105 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Initiate Candidate Clearance</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Total Candidates</span>
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <span className="text-2xl font-black text-on-surface">{clearances.length}</span>
          <span className="text-[11px] text-on-surface-variant block font-medium mt-1">
            MSc & PhD Graduating Cohort
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Officially Cleared</span>
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{clearedCount}</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
            Convocation Release Ready
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">In Progress</span>
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-semibold mt-1">
            Under Verification & Bindery
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Revisions Required</span>
            <span className="material-symbols-outlined text-[20px]">flag</span>
          </div>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{revisionsCount}</span>
          <span className="text-[11px] text-rose-700 dark:text-rose-400 block font-semibold mt-1">
            Similarity Flag / Citations
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Pending Review', 'Plagiarism Audit Passed', 'Library Hardcopy Received', 'Approved & Cleared', 'Revisions Required'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search candidate, ID, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
          />
        </div>
      </div>

      {/* Clearance Dossier Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 transition-all space-y-4 shadow-xs"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-xs font-mono font-bold">
                    {item.academicProgram}
                  </span>
                  <span className="text-xs font-mono font-semibold text-on-surface-variant">
                    ID: {item.studentId}
                  </span>
                  {item.clearanceCertNumber && (
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      {item.clearanceCertNumber}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold font-serif text-on-surface pt-1">
                  {item.studentName}
                </h4>
                <p className="text-xs text-on-surface-variant">
                  {item.department} • {item.college}
                </p>
                <p className="text-xs italic text-on-surface font-serif pt-0.5">
                  "{item.thesisTitle}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {item.status === 'Approved & Cleared' && (
                  <button
                    onClick={() => setSelectedCert(item)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                    <span>View Official Certificate</span>
                  </button>
                )}

                {item.status !== 'Approved & Cleared' && (
                  <>
                    {item.status === 'Pending Review' && (
                      <button
                        onClick={() =>
                          onUpdateStatus(
                            item.id,
                            'Plagiarism Audit Passed',
                            'Plagiarism scan verified below 19% ceiling. Candidate cleared for bindery submission.',
                            'WKI Editorial Desk'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">fact_check</span>
                        <span>Pass Plagiarism Audit</span>
                      </button>
                    )}

                    {!item.hardcopyBindingDelivered && (
                      <button
                        onClick={() =>
                          onUpdateStatus(
                            item.id,
                            'Library Hardcopy Received',
                            '4 Gold-embossed leatherette copies deposited in Haramaya Central Library archival collection.',
                            'Central Library Head',
                            true,
                            4
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        <span>Confirm Library Deposit (4 Copies)</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          item.id,
                          'Approved & Cleared',
                          'Registrar final signoff complete. Convocation eligibility confirmed.',
                          'Dr. Solomon Tadesse (University Registrar)',
                          true,
                          item.hardcopyCopiesCount || 4
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Grant Final Registrar Clearance</span>
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          item.id,
                          'Revisions Required',
                          'Originality scan or bindery specifications require immediate revision prior to clearance.',
                          'Registrar Audit Committee'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                      title="Flag revisions required"
                    >
                      <span className="material-symbols-outlined text-[16px]">error</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Verification Details Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-surface-container text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Anti-Plagiarism Score
                  </span>
                  <span className={`font-mono font-bold ${item.plagiarismSimilarityPct > 19 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {item.plagiarismSimilarityPct}% Similarity
                  </span>
                  <span className="text-[10px] text-on-surface-variant block font-mono">
                    Hash: {item.plagiarismCertHash}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 text-[18px]">auto_stories</span>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Library Hardbound Copies
                  </span>
                  <span className="font-semibold text-on-surface">
                    {item.hardcopyBindingDelivered ? (
                      <span className="text-teal-700 dark:text-teal-300 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        {item.hardcopyCopiesCount} Copies Deposited
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300 font-bold">
                        Pending Physical Delivery
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block font-mono">
                    Handle: {item.libraryRepoDepositHandle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[18px]">assignment_turned_in</span>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Advisor & Defense
                  </span>
                  <span className="font-semibold text-on-surface">{item.advisorName}</span>
                  <span className="text-[10px] text-on-surface-variant block">
                    Defended: {item.defenseDate}
                  </span>
                </div>
              </div>
            </div>

            {item.remarks && (
              <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 italic">
                <strong>Registrar Note:</strong> {item.remarks}
              </p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/40 space-y-2">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">folder_off</span>
            <p className="text-sm font-bold text-on-surface">No clearance dossiers matching criteria</p>
            <p className="text-xs text-on-surface-variant">Try resetting filters or initiating a candidate dossier.</p>
          </div>
        )}
      </div>

      {/* New Candidate Clearance Dossier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </span>
                <h3 className="text-lg font-bold font-serif text-on-surface">
                  Initiate Candidate Clearance Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Candidate Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chaltu Benti"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Student ID #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PGR-2025-412"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Academic Degree Track</label>
                  <select
                    value={academicProgram}
                    onChange={(e) => setAcademicProgram(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="MSc">MSc Degree</option>
                    <option value="PhD">PhD Doctorate</option>
                    <option value="PostDoc">PostDoctoral Fellowship</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Defense Date</label>
                  <input
                    type="date"
                    value={defenseDate}
                    onChange={(e) => setDefenseDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Approved Thesis / Dissertation Title</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Full title as approved by department graduate committee..."
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Major Advisor</label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Plagiarism Similarity Score (%): <span className="font-bold text-secondary">{plagiarismSimilarityPct}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="0.1"
                  value={plagiarismSimilarityPct}
                  onChange={(e) => setPlagiarismSimilarityPct(Number(e.target.value))}
                  className="w-full accent-secondary"
                />
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  Institutional compliance threshold ceiling: ≤ 19.0%
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 transition-all cursor-pointer shadow-sm"
                >
                  Create Clearance Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Preview Modal */}
      {selectedCert && (
        <ClearanceCertificateModal
          clearance={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
