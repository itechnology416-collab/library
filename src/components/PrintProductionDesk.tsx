import React, { useState } from 'react';
import { PrintProductionJob, PrintJobStatus } from '../types';

interface PrintProductionDeskProps {
  jobs: PrintProductionJob[];
  onUpdateJobStatus: (id: string, status: PrintJobStatus, notes?: string, operator?: string) => void;
  onCreateJob: (newJob: Partial<PrintProductionJob>) => void;
  onShowToast?: (msg: string) => void;
}

const PRODUCTION_STAGES: PrintJobStatus[] = [
  'Pre-flight Check',
  'Plate CTP & RIP',
  'Press Run Printing',
  'Folding & Gathering',
  'Hardcover Foil Bindery',
  'QC Inspection',
  'Ready for Pickup / Dispatched',
];

export const PrintProductionDesk: React.FC<PrintProductionDeskProps> = ({
  jobs,
  onUpdateJobStatus,
  onCreateJob,
  onShowToast,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [showAddJobModal, setShowAddJobModal] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [copiesRequested, setCopiesRequested] = useState<number>(4);
  const [totalPages, setTotalPages] = useState<number>(180);
  const [bindingType, setBindingType] = useState<'Hardcover Leatherette Gold Foil' | 'Perfect Bound Softcover' | 'Spiral Wire-O' | 'Saddle Stitch'>('Hardcover Leatherette Gold Foil');
  const [paperStock, setPaperStock] = useState('80gsm Premium Woodfree Bond / 300gsm C1S Cover Board');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Convocation Rush'>('Convocation Rush');
  const [assignedOperator, setAssignedOperator] = useState('Ato Birhanu Tulu & W/ro Hiwot Assefa');
  const [estimatedCostETB, setEstimatedCostETB] = useState<number>(3600);

  const filteredJobs = jobs.filter((j) => {
    if (selectedStageFilter === 'All') return true;
    return j.status === selectedStageFilter;
  });

  const handleAdvance = (job: PrintProductionJob) => {
    const currentIndex = PRODUCTION_STAGES.indexOf(job.status);
    if (currentIndex < PRODUCTION_STAGES.length - 1) {
      const nextStage = PRODUCTION_STAGES[currentIndex + 1];
      onUpdateJobStatus(job.id, nextStage, `Advanced to ${nextStage} stage by Press Supervisor.`);
      if (onShowToast) onShowToast(`Job ${job.jobCode} advanced to ${nextStage}`);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      if (onShowToast) onShowToast('Please provide manuscript title and author name.');
      return;
    }

    onCreateJob({
      title: title.trim(),
      authorName: authorName.trim(),
      copiesRequested: Number(copiesRequested),
      totalPages: Number(totalPages),
      bindingType,
      paperStock,
      priority,
      assignedOperator,
      estimatedCostETB: Number(estimatedCostETB),
      notes: 'Initial job queue registered for university press print-on-demand floor.',
    });

    setShowAddJobModal(false);
    setTitle('');
    setAuthorName('');
    if (onShowToast) onShowToast(`Production job queued for ${title}`);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Convocation Rush':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 animate-pulse';
      case 'High':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  const activeCount = jobs.filter((j) => j.status !== 'Ready for Pickup / Dispatched').length;
  const inPressCount = jobs.filter((j) => j.status === 'Press Run Printing').length;
  const inBinderyCount = jobs.filter((j) => j.status === 'Hardcover Foil Bindery').length;
  const readyCount = jobs.filter((j) => j.status === 'Ready for Pickup / Dispatched').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
              Phase 6 Module
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              University Press Industrial Bindery & Print-on-Demand Floor
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-on-surface">
            Print-on-Demand (POD) & Bindery Production Floor
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Track real-time press stages from pre-flight CTP plates to gold-embossed hardcover leatherette bindery and convocation dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowAddJobModal(true)}
          className="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-2 hover:brightness-105 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          <span>+ Queue New Print Job</span>
        </button>
      </div>

      {/* Production KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Active Floor Jobs</span>
            <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
          </div>
          <span className="text-2xl font-black text-on-surface">{activeCount}</span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-semibold mt-1">
            Currently in Pipeline
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Press Running</span>
            <span className="material-symbols-outlined text-[20px]">print</span>
          </div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{inPressCount}</span>
          <span className="text-[11px] text-blue-700 dark:text-blue-400 block font-semibold mt-1">
            Heidelberg Speedmaster
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Foil Bindery</span>
            <span className="material-symbols-outlined text-[20px]">auto_stories</span>
          </div>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{inBinderyCount}</span>
          <span className="text-[11px] text-purple-700 dark:text-purple-400 block font-semibold mt-1">
            Hot Stamping & Case-Making
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Dispatched / Ready</span>
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{readyCount}</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
            QC Passed & Packaged
          </span>
        </div>
      </div>

      {/* Production Pipeline Stage Bar */}
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">linear_scale</span>
          <span>Industrial Print Workflow Stages</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PRODUCTION_STAGES.map((stage, idx) => {
            const count = jobs.filter((j) => j.status === stage).length;
            const isSelected = selectedStageFilter === stage;
            return (
              <button
                key={stage}
                onClick={() => setSelectedStageFilter(isSelected ? 'All' : stage)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary/40 text-on-surface'
                }`}
              >
                <span className="text-[10px] font-mono opacity-70 block">Step 0{idx + 1}</span>
                <p className="text-xs font-bold truncate leading-tight">{stage}</p>
                <span className="text-[11px] font-mono font-black mt-1 inline-block">
                  {count} {count === 1 ? 'Job' : 'Jobs'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter indicator */}
      {selectedStageFilter !== 'All' && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-xs font-semibold">
          <span>Filtering by stage: <strong>{selectedStageFilter}</strong></span>
          <button
            onClick={() => setSelectedStageFilter('All')}
            className="hover:underline text-[11px] cursor-pointer"
          >
            Show All Stages
          </button>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const currentStageIndex = PRODUCTION_STAGES.indexOf(job.status);
          const isFinalStage = currentStageIndex === PRODUCTION_STAGES.length - 1;

          return (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-secondary/15 text-secondary text-xs font-mono font-bold">
                      {job.jobCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadge(job.priority)}`}>
                      {job.priority}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface text-xs font-bold">
                      {job.bindingType}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      Requested: {job.requestedDate}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-serif text-on-surface pt-1">
                    {job.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Author: <strong className="text-on-surface">{job.authorName}</strong> • {job.copiesRequested} Copies • {job.totalPages} Pages
                  </p>
                </div>

                {/* Stage Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {!isFinalStage ? (
                    <button
                      onClick={() => handleAdvance(job)}
                      className="px-3.5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-105 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Advance to Next Stage</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Dispatched & Delivered</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>
                    Current Stage: <strong className="text-secondary">{job.status}</strong>
                  </span>
                  <span>
                    Stage {currentStageIndex + 1} of {PRODUCTION_STAGES.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-secondary to-primary transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentStageIndex + 1) / PRODUCTION_STAGES.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Technical Specifications Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-surface-container text-xs">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Paper & Cover Stock
                  </span>
                  <p className="text-on-surface font-medium truncate">{job.paperStock}</p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Assigned Master Operator
                  </span>
                  <p className="text-on-surface font-medium truncate">{job.assignedOperator}</p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Production Surcharge
                  </span>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {job.estimatedCostETB ? `${job.estimatedCostETB.toLocaleString()} ETB` : 'Institutional Charge'}
                  </p>
                </div>
              </div>

              {job.notes && (
                <p className="text-xs text-on-surface-variant italic bg-surface-container-low p-2 rounded-lg border border-outline-variant/20">
                  <strong>Floor Note:</strong> {job.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Queue New Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </span>
                <h3 className="text-lg font-bold font-serif text-on-surface">
                  Queue New Print Production Job
                </h3>
              </div>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Publication / Dissertation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agronomic Optimization for Hararghe Coffee Agroforestry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Author / Candidate Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chaltu Benti"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Copies Required</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={copiesRequested}
                    onChange={(e) => setCopiesRequested(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Total Page Count</label>
                  <input
                    type="number"
                    min="10"
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Binding Style</label>
                  <select
                    value={bindingType}
                    onChange={(e) => setBindingType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="Hardcover Leatherette Gold Foil">Hardcover Leatherette Gold Foil</option>
                    <option value="Perfect Bound Softcover">Perfect Bound Softcover</option>
                    <option value="Spiral Wire-O">Spiral Wire-O</option>
                    <option value="Saddle Stitch">Saddle Stitch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Paper & Cover Stock</label>
                  <input
                    type="text"
                    value={paperStock}
                    onChange={(e) => setPaperStock(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Production Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  >
                    <option value="Convocation Rush">Convocation Rush (Urgent)</option>
                    <option value="High">High Priority</option>
                    <option value="Normal">Standard Turnaround</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Assigned Press Operator</label>
                  <input
                    type="text"
                    value={assignedOperator}
                    onChange={(e) => setAssignedOperator(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Estimated Cost (ETB)</label>
                  <input
                    type="number"
                    value={estimatedCostETB}
                    onChange={(e) => setEstimatedCostETB(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 transition-all cursor-pointer shadow-sm"
                >
                  Queue Job into Pre-flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
