import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import { Modal, Button } from './ui';
import { FacultyResearchOutput, GrantProject } from '../types';

interface AddOutputModalProps {
  grants: GrantProject[];
  onClose: () => void;
  onSubmit: (outputData: Partial<FacultyResearchOutput>) => Promise<void>;
  onShowToast?: (msg: string) => void;
}

export const AddOutputModal: React.FC<AddOutputModalProps> = ({
  grants,
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<FacultyResearchOutput['type']>('Journal Article');
  const [publicationVenue, setPublicationVenue] = useState('Haramaya Journal of Agricultural Sciences (HJAS)');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [authors, setAuthors] = useState('Desta, G., & Colleagues');
  const [doi, setDoi] = useState('10.20372/hjas.2026.');
  const [linkedGrantId, setLinkedGrantId] = useState(grants[0]?.id || '');
  const [openAccessUrl, setOpenAccessUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const venuePresets = [
    'Haramaya Journal of Agricultural Sciences (HJAS)',
    'East African Journal of Sciences (EAJS)',
    'Haramaya Law Review (HLR)',
    'Wirtuu Kompiitaraa Ilillii Academic Press Monograph Series',
    'HU Research Affairs Policy Brief Series',
    'National Conference on Climate Resilient Agriculture',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      if (onShowToast) onShowToast('Please provide a publication title.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        type,
        publicationVenue,
        publicationYear,
        authors,
        doi: doi.trim() || undefined,
        linkedGrantId: linkedGrantId || undefined,
        openAccessUrl: openAccessUrl.trim() || undefined,
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
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-on-surface">
              Log Research Output / Publication
            </span>
            <p className="text-xs text-on-surface-variant">
              Archive output in Haramaya University Faculty Research Repository
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Output Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Empirical Modeling of Soil Carbon Stocks..."
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface focus:ring-2 focus:ring-teal-500 font-serif"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Output Classification</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            >
              <option value="Journal Article">Peer-Reviewed Journal Article</option>
              <option value="University Monograph">University Research Monograph</option>
              <option value="Policy Brief">Institutional Policy Brief</option>
              <option value="Conference Proceeding">Conference Proceeding</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Publication Year</label>
            <input
              type="number"
              required
              value={publicationYear}
              onChange={(e) => setPublicationYear(parseInt(e.target.value) || 2026)}
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Publication Venue / Journal</label>
          <input
            type="text"
            required
            list="venue-suggestions"
            value={publicationVenue}
            onChange={(e) => setPublicationVenue(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
          <datalist id="venue-suggestions">
            {venuePresets.map((v, i) => (
              <option key={i} value={v} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Authors (Citation Format)</label>
          <input
            type="text"
            required
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="Desta, G., Ahmed, F., & Bekele, T."
            className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">CrossRef DOI (Optional)</label>
            <input
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.20372/hjas.2026.044"
              className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Linked Research Grant</label>
            <select
              value={linkedGrantId}
              onChange={(e) => setLinkedGrantId(e.target.value)}
              className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs text-on-surface"
            >
              <option value="">None / Independent Research</option>
              {grants.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.grantNumber} - {g.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Open Access URL (Optional)</label>
          <input
            type="url"
            value={openAccessUrl}
            onChange={(e) => setOpenAccessUrl(e.target.value)}
            placeholder="https://journals.haramaya.edu.et/index.php/..."
            className="w-full p-2 rounded-xl bg-surface border border-outline-variant/30 text-xs font-mono text-on-surface"
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
            {loading ? 'Logging...' : 'Register Output'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
