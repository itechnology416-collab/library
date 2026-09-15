import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { Modal, Button } from './ui';
import { SupervisedThesis } from '../types';

interface AddSuperviseeModalProps {
  onClose: () => void;
  onSubmit: (studentData: Partial<SupervisedThesis>) => Promise<void>;
  onShowToast?: (msg: string) => void;
}

export const AddSuperviseeModal: React.FC<AddSuperviseeModalProps> = ({
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const [studentName, setStudentName] = useState('');
  const [degree, setDegree] = useState<'MSc' | 'PhD' | 'PostDoc'>('MSc');
  const [department, setDepartment] = useState('Department of Agricultural Economics');
  const [topic, setTopic] = useState('');
  const [stage, setStage] = useState<SupervisedThesis['stage']>('Proposal Defense');
  const [targetDefenseMonth, setTargetDefenseMonth] = useState('June 2027');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !topic.trim()) {
      if (onShowToast) onShowToast('Please specify the candidate name and dissertation topic.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        studentName,
        degree,
        department,
        topic,
        stage,
        targetDefenseMonth,
        notes,
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
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center border border-teal-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-on-surface">
              Enroll Postgraduate Supervisee
            </span>
            <p className="text-xs text-on-surface-variant">
              Postgraduate Directorate & Thesis Advisory Registry
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Candidate Full Name</label>
          <input
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g., Sisay Kebede"
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Degree Program</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            >
              <option value="MSc">Master of Science (MSc)</option>
              <option value="PhD">Doctor of Philosophy (PhD Fellow)</option>
              <option value="PostDoc">Postdoctoral Research Fellow</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Target Defense Month</label>
            <input
              type="text"
              required
              value={targetDefenseMonth}
              onChange={(e) => setTargetDefenseMonth(e.target.value)}
              placeholder="e.g., June 2027"
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Department / Academic Program</label>
          <input
            type="text"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Thesis / Dissertation Research Topic</label>
          <textarea
            rows={3}
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Detailed research title or empirical problem description..."
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface leading-relaxed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Initial Research Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as any)}
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          >
            <option value="Proposal Defense">Proposal Defense</option>
            <option value="Field Sampling">Field Sampling & Enumeration</option>
            <option value="Laboratory / Econometric Analysis">Laboratory / Econometric Analysis</option>
            <option value="Draft Dissertation Review">Draft Dissertation Review</option>
            <option value="Defense Slide Preparation (WKI Beamer)">Defense Slide Preparation (WKI Beamer)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Advisor Supervision Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preliminary hypothesis formulated; ethics clearance approved..."
            className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
          <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={loading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="bg-teal-700 hover:bg-teal-600 text-white text-xs cursor-pointer font-bold"
          >
            {loading ? 'Enrolling...' : 'Enroll Supervisee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
