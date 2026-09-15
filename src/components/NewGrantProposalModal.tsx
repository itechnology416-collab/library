import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Calendar,
  Users,
  Target,
  Sparkles,
  Save,
  X,
  Layers,
} from 'lucide-react';
import { Modal, Button } from './ui';
import { GrantProject } from '../types';

interface NewGrantProposalModalProps {
  onClose: () => void;
  onSubmit: (grantData: Partial<GrantProject>) => Promise<void>;
  onShowToast?: (msg: string) => void;
}

export const NewGrantProposalModal: React.FC<NewGrantProposalModalProps> = ({
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [funder, setFunder] = useState('Haramaya University Research & Extension Directorate (RGD)');
  const [category, setCategory] = useState<'Institutional (RGD)' | 'National (MoIT/MoE)' | 'International Bilateral'>(
    'Institutional (RGD)'
  );
  const [totalBudgetETB, setTotalBudgetETB] = useState<number>(650000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [coPIs, setCoPIs] = useState('Prof. Fatuma Ahmed, Dr. Tadesse Bekele');
  const [abstract, setAbstract] = useState('');
  const [primaryMilestone, setPrimaryMilestone] = useState('Baseline Household Survey & Inception Report');
  const [loading, setLoading] = useState(false);

  const funderPresets = [
    'Haramaya University Research & Extension Directorate (RGD)',
    'Ethiopian Ministry of Innovation & Technology (MoIT)',
    'Ethiopian Ministry of Education (MoE) Competitive Grants',
    'USAID / Feed the Future Collaborative Consortium',
    'European Commission Horizon Europe Bilateral Initiative',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) {
      if (onShowToast) onShowToast('Please provide a research title and summary abstract.');
      return;
    }

    setLoading(true);
    try {
      const coPIList = coPIs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const totalUSD = Math.round(totalBudgetETB / 135);

      await onSubmit({
        title,
        funder,
        category,
        totalBudgetETB: Number(totalBudgetETB),
        totalBudgetUSD: totalUSD,
        startDate,
        endDate,
        coPIs: coPIList,
        abstract,
        milestones: [
          {
            id: `mil-${Date.now()}-1`,
            title: primaryMilestone || 'Inception Report & Ethical Clearance',
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'In Progress',
            deliverable: 'Approved Inception Report and Institutional Clearance',
          },
        ],
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center border border-teal-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base md:text-lg text-on-surface">
              Submit Research Grant Proposal
            </span>
            <p className="text-xs text-on-surface-variant font-normal">
              Register proposal with Haramaya University Research Affairs & External Funding Registry
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Research Proposal Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Climate-Smart Agroforestry Intercropping in Eastern Hararghe Watersheds"
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-sans"
          />
        </div>

        {/* Funder & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Target Funding Agency</label>
            <select
              value={funder}
              onChange={(e) => setFunder(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              {funderPresets.map((f, i) => (
                <option key={i} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Grant Classification</label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as 'Institutional (RGD)' | 'National (MoIT/MoE)' | 'International Bilateral')
              }
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="Institutional (RGD)">Institutional (HU Research Directorate - RGD)</option>
              <option value="National (MoIT/MoE)">National Competitive (MoIT / MoE)</option>
              <option value="International Bilateral">International Collaborative Consortium</option>
            </select>
          </div>
        </div>

        {/* Budget in ETB & USD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Total Budget (ETB)</label>
            <div className="relative">
              <input
                type="number"
                min="50000"
                step="10000"
                required
                value={totalBudgetETB}
                onChange={(e) => setTotalBudgetETB(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-on-surface-variant font-bold">ETB</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">USD Equivalent (Approx 135 ETB/$)</label>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
              ≈ ${(Math.round(totalBudgetETB / 135)).toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* Project Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Proposed Start Date</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Expected Completion Date</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            />
          </div>
        </div>

        {/* Co-Investigators */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">
            Co-Principal Investigators (Co-PIs, Comma Separated)
          </label>
          <input
            type="text"
            value={coPIs}
            onChange={(e) => setCoPIs(e.target.value)}
            placeholder="Prof. Fatuma Ahmed (Soil), Dr. Sisay Lemma (GIS)"
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
        </div>

        {/* Initial Milestone */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">First Inception Milestone Deliverable</label>
          <input
            type="text"
            value={primaryMilestone}
            onChange={(e) => setPrimaryMilestone(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
        </div>

        {/* Abstract */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Research Summary & Specific Aims</label>
          <textarea
            rows={4}
            required
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Summarize the core research questions, agro-ecological hypotheses, sampling design, and anticipated scientific deliverables..."
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
          <Button variant="outline" size="sm" onClick={onClose} type="button" className="text-xs cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={loading}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-teal-700 hover:bg-teal-600 text-white text-xs cursor-pointer font-bold"
          >
            {loading ? 'Submitting...' : 'Register Grant Proposal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
