import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { GrantProposalState, GrantBudgetItem } from '../types';

interface ResearchGrantStudioModalProps {
  onClose: () => void;
  onRequestFormatting?: (proposalSummary: string) => void;
}

const DEFAULT_BUDGET_ITEMS: GrantBudgetItem[] = [
  {
    id: 'b-1',
    category: 'personnel',
    description: 'Principal Investigator (Research Time Allocation - 20% effort)',
    unit: 'Months',
    quantity: 12,
    unitCostETB: 18000,
    exchangeRateUSD: 125,
    justification: 'Overall project leadership, statistical modeling and manuscript drafting.',
  },
  {
    id: 'b-2',
    category: 'personnel',
    description: 'Graduate Field Enumerators (4 MSc Agronomy students)',
    unit: 'Person-days',
    quantity: 60,
    unitCostETB: 1200,
    exchangeRateUSD: 125,
    justification: 'Field data collection, soil sample extraction, and farmer interviews in West Hararghe.',
  },
  {
    id: 'b-3',
    category: 'travel_dsa',
    description: 'Field DSA (Daily Subsistence Allowance) in rural Hararghe districts',
    unit: 'Days',
    quantity: 45,
    unitCostETB: 2400,
    exchangeRateUSD: 125,
    justification: 'Standard HU Directorate per-diem rate for field stays in remote pastoral kebeles.',
  },
  {
    id: 'b-4',
    category: 'equipment_consumables',
    description: 'Soil Nitrate/Phosphorus Test Kits & Spectrophotometer Reagents',
    unit: 'Sets',
    quantity: 4,
    unitCostETB: 48000,
    exchangeRateUSD: 125,
    justification: 'Central laboratory soil chemistry analysis at Haramaya Main Campus Lab.',
  },
  {
    id: 'b-5',
    category: 'fieldwork',
    description: '4WD Vehicle Fuel & Vehicle Maintenance for Rugged Field Corridors',
    unit: 'Liters',
    quantity: 1200,
    unitCostETB: 115,
    exchangeRateUSD: 125,
    justification: 'Transport across 6 targeted woredas throughout the rainy cropping cycle.',
  },
  {
    id: 'b-6',
    category: 'publication_oa',
    description: 'Open Access Journal Publishing & Monograph Printing at WKI Haramaya Press',
    unit: 'Articles / Volume',
    quantity: 2,
    unitCostETB: 65000,
    exchangeRateUSD: 125,
    justification: 'Peer-reviewed open access dissemination and institutional policy brief distribution.',
  },
  {
    id: 'b-7',
    category: 'institutional_overhead',
    description: 'Haramaya University Directorate Indirect Overhead (7%)',
    unit: 'Lump Sum',
    quantity: 1,
    unitCostETB: 45000,
    exchangeRateUSD: 125,
    justification: 'Institutional administrative support, laboratory utilities, and financial audit.',
  },
];

export const ResearchGrantStudioModal: React.FC<ResearchGrantStudioModalProps> = ({
  onClose,
  onRequestFormatting,
}) => {
  const [activeTab, setActiveTab] = useState<'narrative' | 'budget' | 'preview'>('budget');
  const [exchangeRate, setExchangeRate] = useState<number>(125); // 125 ETB = 1 USD

  const [proposal, setProposal] = useState<GrantProposalState>({
    id: 'HU-GRANT-2026-08',
    projectTitle:
      'Climate-Smart Agroforestry and Soil-Moisture Conservation in Eastern Ethiopian Highlands',
    principalInvestigator: 'Dr. Belayneh Kebede (Associate Prof., College of Agriculture)',
    coInvestigators: 'Dr. Fatima Idris (HU Soil Science), Dr. Tarekegn Assefa (Climate Modeling)',
    departmentCollege: 'College of Agriculture & Environmental Sciences, Haramaya University',
    targetAgency: 'Haramaya University RGD',
    grantDurationMonths: 24,
    summaryAbstract:
      'This multidisciplinary research project investigates the synergistic impact of indigenous shade agroforestry trees on soil microbiome preservation and climate resilience across smallholder coffee farms in Eastern Oromia. The findings will inform university extension packages and regional green legacy strategies.',
    problemStatement:
      'Land degradation and recurrent erratic rainfall in Hararghe highlands have reduced cereal and legume crop productivity by over 30%. Despite traditional agroforestry adoption, scientific optimization of tree density and nutrient cycling remains insufficiently quantified.',
    researchObjectives: [
      'Quantify soil organic carbon sequestration across stratified shade-tree densities.',
      'Assess smallholder adoption hurdles and women-led cooperative participation.',
      'Formulate and publish an evidence-based agroforestry policy framework via WKI Press.',
    ],
    budgetItems: DEFAULT_BUDGET_ITEMS,
    institutionalClearance: {
      departmentHeadSigned: true,
      researchDeanApproved: true,
      irbEthicalClearance: true,
    },
  });

  // Budget calculations
  const totalETB = useMemo(() => {
    return proposal.budgetItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCostETB,
      0
    );
  }, [proposal.budgetItems]);

  const totalUSD = useMemo(() => {
    return totalETB / (exchangeRate || 1);
  }, [totalETB, exchangeRate]);

  // Category totals
  const categoryTotals = useMemo(() => {
    const cats: Record<string, number> = {};
    proposal.budgetItems.forEach((item) => {
      cats[item.category] = (cats[item.category] || 0) + item.quantity * item.unitCostETB;
    });
    return cats;
  }, [proposal.budgetItems]);

  // Add Item state
  const [newItemDesc, setNewItemDesc] = useState<string>('');
  const [newItemCat, setNewItemCat] = useState<GrantBudgetItem['category']>('equipment_consumables');
  const [newItemUnit, setNewItemUnit] = useState<string>('Units');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemCost, setNewItemCost] = useState<number>(5000);
  const [newItemJust, setNewItemJust] = useState<string>('');

  const handleAddBudgetItem = () => {
    if (!newItemDesc.trim()) return;
    const item: GrantBudgetItem = {
      id: `b-${Date.now()}`,
      category: newItemCat,
      description: newItemDesc.trim(),
      unit: newItemUnit.trim() || 'Unit',
      quantity: Number(newItemQty) || 1,
      unitCostETB: Number(newItemCost) || 0,
      exchangeRateUSD: exchangeRate,
      justification: newItemJust.trim() || 'Necessary for project execution.',
    };
    setProposal((prev) => ({
      ...prev,
      budgetItems: [...prev.budgetItems, item],
    }));
    setNewItemDesc('');
    setNewItemJust('');
  };

  const handleRemoveItem = (id: string) => {
    setProposal((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.filter((item) => item.id !== id),
    }));
  };

  return (
    <div
      id="research-grant-studio-modal"
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
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">account_balance</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif truncate">
                  Research Grant Proposal & Budget Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-secondary text-on-secondary">
                  HU RGD / National Template
                </span>
              </div>
              <p className="text-xs text-on-surface-variant truncate">
                Multi-currency budget breakdown, DSA per-diem formulas & institutional endorsement matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Tab switchers */}
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('narrative')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'narrative'
                    ? 'bg-surface shadow-xs font-bold text-secondary'
                    : 'text-on-surface-variant'
                }`}
              >
                Narrative
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-surface shadow-xs font-bold text-secondary'
                    : 'text-on-surface-variant'
                }`}
              >
                Budget Matrix
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-surface shadow-xs font-bold text-secondary'
                    : 'text-on-surface-variant'
                }`}
              >
                Executive Dossier
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

        {/* Modal Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* TAB 1: Proposal Narrative */}
          {activeTab === 'narrative' && (
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 cols: Form fields */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Research Project Title
                  </label>
                  <input
                    type="text"
                    value={proposal.projectTitle}
                    onChange={(e) => setProposal({ ...proposal, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Principal Investigator (PI)
                    </label>
                    <input
                      type="text"
                      value={proposal.principalInvestigator}
                      onChange={(e) =>
                        setProposal({ ...proposal, principalInvestigator: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      College / Directorate
                    </label>
                    <input
                      type="text"
                      value={proposal.departmentCollege}
                      onChange={(e) =>
                        setProposal({ ...proposal, departmentCollege: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Co-Investigators & Key Collaborators
                  </label>
                  <input
                    type="text"
                    value={proposal.coInvestigators}
                    onChange={(e) =>
                      setProposal({ ...proposal, coInvestigators: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Executive Summary / Project Abstract
                  </label>
                  <textarea
                    rows={4}
                    value={proposal.summaryAbstract}
                    onChange={(e) =>
                      setProposal({ ...proposal, summaryAbstract: e.target.value })
                    }
                    className="w-full p-3 text-xs leading-relaxed rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Problem Rationale & Motivation
                  </label>
                  <textarea
                    rows={3}
                    value={proposal.problemStatement}
                    onChange={(e) =>
                      setProposal({ ...proposal, problemStatement: e.target.value })
                    }
                    className="w-full p-3 text-xs leading-relaxed rounded-lg bg-surface border border-outline/20 focus:outline-hidden focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Specific Research Objectives
                  </label>
                  <div className="space-y-2">
                    {proposal.researchObjectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => {
                            const newObjs = [...proposal.researchObjectives];
                            newObjs[i] = e.target.value;
                            setProposal({ ...proposal, researchObjectives: newObjs });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 cols: Target Funding & Clearance */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-xl bg-surface-container/60 border border-outline/15 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[18px]">domain</span>
                    Target Funding Directorate
                  </h4>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Agency / Program Call:
                    </label>
                    <select
                      value={proposal.targetAgency}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          targetAgency: e.target.value as GrantProposalState['targetAgency'],
                        })
                      }
                      className="w-full p-2 text-xs rounded-lg bg-surface border border-outline/20 focus:outline-hidden"
                    >
                      <option value="Haramaya University RGD">Haramaya University RGD (Annual Call)</option>
                      <option value="MoSHE Ethiopia">MoSHE / Ethiopian Research Council</option>
                      <option value="IDRC Canada">IDRC Canada Climate Adaptation Fund</option>
                      <option value="Horizon Europe">Horizon Europe Africa Initiative</option>
                      <option value="USAID / Feed the Future">USAID / Feed the Future East Africa</option>
                      <option value="Wellcome Trust">Wellcome Trust Global Health Discovery</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Project Duration:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={6}
                        max={60}
                        value={proposal.grantDurationMonths}
                        onChange={(e) =>
                          setProposal({ ...proposal, grantDurationMonths: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 text-xs rounded-lg bg-surface border border-outline/20"
                      />
                      <span className="text-xs text-on-surface-variant">Months (2 Years)</span>
                    </div>
                  </div>
                </div>

                {/* Institutional Endorsement Status */}
                <div className="p-4 rounded-xl bg-surface-container/40 border border-outline/15 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                    Institutional Endorsements
                  </h4>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface border border-outline/10 cursor-pointer">
                      <span>Department Head Sign-off</span>
                      <input
                        type="checkbox"
                        checked={proposal.institutionalClearance.departmentHeadSigned}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            institutionalClearance: {
                              ...proposal.institutionalClearance,
                              departmentHeadSigned: e.target.checked,
                            },
                          })
                        }
                        className="accent-secondary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface border border-outline/10 cursor-pointer">
                      <span>Dean of Research Endorsement</span>
                      <input
                        type="checkbox"
                        checked={proposal.institutionalClearance.researchDeanApproved}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            institutionalClearance: {
                              ...proposal.institutionalClearance,
                              researchDeanApproved: e.target.checked,
                            },
                          })
                        }
                        className="accent-secondary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface border border-outline/10 cursor-pointer">
                      <span>HU IRB Ethical Clearance</span>
                      <input
                        type="checkbox"
                        checked={proposal.institutionalClearance.irbEthicalClearance}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            institutionalClearance: {
                              ...proposal.institutionalClearance,
                              irbEthicalClearance: e.target.checked,
                            },
                          })
                        }
                        className="accent-secondary"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Budget Matrix & Line-Item Calculator */}
          {activeTab === 'budget' && (
            <div className="p-5 sm:p-6 space-y-6">
              {/* Financial Summary Top Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">
                    Total Requested (ETB)
                  </span>
                  <div className="text-xl font-bold font-mono text-on-surface">
                    {totalETB.toLocaleString()} ETB
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container border border-outline/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                    Equivalent (USD)
                  </span>
                  <div className="text-xl font-bold font-mono text-secondary">
                    ${Math.round(totalUSD).toLocaleString()} USD
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container border border-outline/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                    Exchange Rate
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(Number(e.target.value) || 1)}
                      className="w-20 px-2 py-0.5 text-xs font-mono font-bold rounded-sm bg-surface border border-outline/20"
                    />
                    <span className="text-[11px] text-on-surface-variant">ETB / USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container border border-outline/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                    Line Items
                  </span>
                  <div className="text-xl font-bold font-mono text-on-surface">
                    {proposal.budgetItems.length} categories
                  </div>
                </div>
              </div>

              {/* Add New Line Item Form */}
              <div className="p-4 rounded-xl bg-surface border border-outline/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add Budget Line Item
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Item Description (e.g. Field GPS Units)"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                  <div>
                    <select
                      value={newItemCat}
                      onChange={(e) =>
                        setNewItemCat(e.target.value as GrantBudgetItem['category'])
                      }
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                    >
                      <option value="personnel">Personnel</option>
                      <option value="travel_dsa">Travel / DSA</option>
                      <option value="equipment_consumables">Equipment</option>
                      <option value="fieldwork">Fieldwork</option>
                      <option value="publication_oa">Publishing / OA</option>
                      <option value="institutional_overhead">Overhead</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Unit (Days/Pcs)"
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Unit Cost (ETB)"
                      value={newItemCost}
                      onChange={(e) => setNewItemCost(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-outline/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Budget Justification / Basis of Estimation..."
                    value={newItemJust}
                    onChange={(e) => setNewItemJust(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-outline/20 flex-1"
                  />
                  <button
                    onClick={handleAddBudgetItem}
                    disabled={!newItemDesc.trim()}
                    className="px-4 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 disabled:opacity-50 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Table of Budget Items */}
              <div className="rounded-xl border border-outline/20 overflow-hidden bg-surface">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container/60 border-b border-outline/15 text-[10px] uppercase font-bold text-on-surface-variant">
                        <th className="p-3">Category</th>
                        <th className="p-3">Description & Justification</th>
                        <th className="p-3 text-center">Unit</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Cost (ETB)</th>
                        <th className="p-3 text-right">Total (ETB)</th>
                        <th className="p-3 text-right">USD ($)</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/10">
                      {proposal.budgetItems.map((item) => {
                        const lineTotalETB = item.quantity * item.unitCostETB;
                        const lineTotalUSD = lineTotalETB / exchangeRate;
                        return (
                          <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                            <td className="p-3 font-semibold text-secondary whitespace-nowrap capitalize">
                              {item.category.replace('_', ' ')}
                            </td>
                            <td className="p-3 max-w-[280px]">
                              <div className="font-semibold text-on-surface">{item.description}</div>
                              <div className="text-[11px] text-on-surface-variant italic">
                                {item.justification}
                              </div>
                            </td>
                            <td className="p-3 text-center font-mono">{item.unit}</td>
                            <td className="p-3 text-center font-mono font-bold">{item.quantity}</td>
                            <td className="p-3 text-right font-mono">
                              {item.unitCostETB.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-on-surface">
                              {lineTotalETB.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono text-secondary">
                              ${Math.round(lineTotalUSD).toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-error hover:bg-error/10 p-1 rounded-sm transition-colors cursor-pointer"
                                title="Delete line item"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-surface-container/80 font-bold border-t border-outline/20">
                        <td colSpan={5} className="p-3 text-right text-xs uppercase tracking-wider">
                          Grand Total Budget:
                        </td>
                        <td className="p-3 text-right font-mono text-sm text-on-surface">
                          {totalETB.toLocaleString()} ETB
                        </td>
                        <td className="p-3 text-right font-mono text-sm text-secondary">
                          ${Math.round(totalUSD).toLocaleString()} USD
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Executive Dossier & Export */}
          {activeTab === 'preview' && (
            <div className="p-5 sm:p-8 max-w-4xl mx-auto space-y-6">
              <div className="p-8 rounded-2xl bg-surface border border-outline/20 shadow-xl space-y-6 font-serif">
                {/* Dossier Header */}
                <div className="text-center border-b pb-4 space-y-1">
                  <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-secondary">
                    Haramaya University Directorate of Research and Extension (RGD)
                  </span>
                  <h2 className="text-xl font-bold font-serif text-on-surface">{proposal.projectTitle}</h2>
                  <p className="text-xs text-on-surface-variant font-sans">
                    Submitted by: <strong>{proposal.principalInvestigator}</strong> ({proposal.departmentCollege})
                  </p>
                </div>

                {/* Overview Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans p-3 bg-surface-container/40 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Grant ID</span>
                    <div className="font-mono font-bold">{proposal.id}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Target Agency</span>
                    <div className="font-semibold">{proposal.targetAgency}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Duration</span>
                    <div className="font-semibold">{proposal.grantDurationMonths} Months</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Total Budget</span>
                    <div className="font-mono font-bold text-secondary">
                      {totalETB.toLocaleString()} ETB (${Math.round(totalUSD).toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Abstract */}
                <div className="space-y-1 text-xs">
                  <h3 className="font-sans font-bold uppercase tracking-wider text-secondary">
                    1. Executive Summary & Abstract
                  </h3>
                  <p className="leading-relaxed text-on-surface">{proposal.summaryAbstract}</p>
                </div>

                {/* Problem Rationale */}
                <div className="space-y-1 text-xs">
                  <h3 className="font-sans font-bold uppercase tracking-wider text-secondary">
                    2. Problem Statement
                  </h3>
                  <p className="leading-relaxed text-on-surface">{proposal.problemStatement}</p>
                </div>

                {/* Objectives */}
                <div className="space-y-1 text-xs">
                  <h3 className="font-sans font-bold uppercase tracking-wider text-secondary">
                    3. Specific Objectives
                  </h3>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {proposal.researchObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Category Budget Breakdown */}
                <div className="space-y-2 text-xs font-sans">
                  <h3 className="font-sans font-bold uppercase tracking-wider text-secondary">
                    4. Financial Category Breakdown
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(categoryTotals).map(([cat, amount]) => (
                      <div key={cat} className="p-2.5 rounded-lg bg-surface-container border border-outline/10">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant capitalize block">
                          {cat.replace('_', ' ')}
                        </span>
                        <span className="font-mono font-bold text-xs text-on-surface">
                          {amount.toLocaleString()} ETB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    const text = `# ${proposal.projectTitle}\n\n**PI:** ${proposal.principalInvestigator}\n**Budget:** ${totalETB.toLocaleString()} ETB / $${Math.round(totalUSD).toLocaleString()} USD\n\n## Abstract\n${proposal.summaryAbstract}\n\n## Budget Line Items\n${proposal.budgetItems.map((b) => `- ${b.description} (${b.quantity} ${b.unit}): ${b.quantity * b.unitCostETB} ETB`).join('\n')}`;
                    navigator.clipboard.writeText(text);
                    alert('Grant Dossier copied to clipboard in Markdown format!');
                  }}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-container text-on-surface border border-outline/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Copy Markdown Dossier</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-container text-on-surface border border-outline/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Dossier</span>
                  </button>

                  {onRequestFormatting && (
                    <button
                      onClick={() =>
                        onRequestFormatting(
                          `Grant Proposal: ${proposal.projectTitle} (Budget: ${totalETB.toLocaleString()} ETB)`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                      <span>Request WKI Grant Typesetting</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
