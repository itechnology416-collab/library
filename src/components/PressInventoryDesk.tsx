import React, { useState } from 'react';
import { PressInventoryItem } from '../types';

interface PressInventoryDeskProps {
  inventory: PressInventoryItem[];
  onUpdateInventory: (id: string, quantity: number, status: 'In Stock' | 'Low Stock' | 'Critically Depleted') => void;
  onShowToast?: (msg: string) => void;
}

export const PressInventoryDesk: React.FC<PressInventoryDeskProps> = ({
  inventory,
  onUpdateInventory,
  onShowToast,
}) => {
  const [selectedItem, setSelectedItem] = useState<PressInventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(50);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newQuantity = selectedItem.quantity + Number(restockQty);
    let newStatus: 'In Stock' | 'Low Stock' | 'Critically Depleted' = 'In Stock';
    if (newQuantity <= 0) {
      newStatus = 'Critically Depleted';
    } else if (newQuantity <= selectedItem.minReorderLevel) {
      newStatus = 'Low Stock';
    }

    onUpdateInventory(selectedItem.id, newQuantity, newStatus);
    if (onShowToast) {
      onShowToast(`Restocked ${selectedItem.name}: +${restockQty} ${selectedItem.unit}. Total: ${newQuantity}`);
    }
    setSelectedItem(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Low Stock':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 animate-pulse';
      default:
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 animate-pulse';
    }
  };

  const totalValuation = inventory.reduce((acc, i) => acc + i.quantity * i.unitCostETB, 0);
  const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critically Depleted');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold text-[11px] uppercase tracking-wider">
              Phase 6 Module
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              University Press Industrial Supplies & Bindery Consumables
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-on-surface">
            Press Shop Consumables & Raw Material Inventory
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Monitor reserve thresholds for Swedish Munken interior book papers, German gold stamping foils, Henkel spine glues, and greyboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lowStockItems.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600">warning</span>
              <span>{lowStockItems.length} Consumables Below Safe Minimum</span>
            </span>
          )}
        </div>
      </div>

      {/* Inventory KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Inventory Valuation</span>
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <span className="text-2xl font-black text-on-surface">
            {totalValuation.toLocaleString()} <span className="text-xs font-bold text-on-surface-variant">ETB</span>
          </span>
          <span className="text-[11px] text-on-surface-variant block font-medium mt-1">
            Current Stock on Hand
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Stocked SKU Types</span>
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{inventory.length}</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold mt-1">
            Active Print Materials
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Reorder Alerts</span>
            <span className="material-symbols-outlined text-[20px]">notification_important</span>
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{lowStockItems.length}</span>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 block font-semibold mt-1">
            Urgent Requisitions Needed
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <div className="flex items-center justify-between text-teal-600 mb-1">
            <span className="text-xs font-semibold text-on-surface-variant">Primary Supplier</span>
            <span className="material-symbols-outlined text-[20px]">store</span>
          </div>
          <span className="text-sm font-bold text-on-surface truncate mt-2 block">
            Berhanena Selam & NIB Import
          </span>
          <span className="text-[11px] text-teal-700 dark:text-teal-400 block font-semibold">
            Institutional Contract
          </span>
        </div>
      </div>

      {/* Inventory Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const ratio = Math.min(100, Math.round((item.quantity / (item.minReorderLevel * 2.5)) * 100));
          const isLow = item.quantity <= item.minReorderLevel;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 transition-all space-y-3.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider block w-fit mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold font-serif text-on-surface">
                    {item.name}
                  </h4>
                  <span className="text-[11px] font-mono text-on-surface-variant block">
                    SKU: {item.sku}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Progress & Quantity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">
                    Stock:{' '}
                    <strong className={`font-mono ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-on-surface'}`}>
                      {item.quantity} {item.unit}
                    </strong>
                  </span>
                  <span className="text-on-surface-variant text-[11px]">
                    Min Safe: {item.minReorderLevel} {item.unit}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>

              {/* Cost and Restocked Info */}
              <div className="p-2.5 rounded-xl bg-surface-container text-xs space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Unit Cost:</span>
                  <strong className="text-on-surface font-mono">{item.unitCostETB} ETB / {item.unit}</strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Total Value:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {(item.quantity * item.unitCostETB).toLocaleString()} ETB
                  </strong>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20">
                  <span>Last Restocked:</span>
                  <span className="text-on-surface font-mono">{item.lastRestockedDate}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setRestockQty(item.minReorderLevel);
                }}
                className="w-full py-2 rounded-xl bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>+ Log Restock Requisition</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-base font-bold font-serif text-on-surface">
                  Restock Material Consumable
                </h3>
                <p className="text-xs text-on-surface-variant">{selectedItem.name}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-container space-y-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Current Stock:</span>
                  <span className="font-mono font-bold text-on-surface">
                    {selectedItem.quantity} {selectedItem.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Unit Price:</span>
                  <span className="font-mono text-on-surface">
                    {selectedItem.unitCostETB} ETB
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">
                  Quantity Received ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30 font-mono focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <p className="font-bold">Total Restock Requisition Value:</p>
                <p className="text-base font-mono font-black mt-0.5">
                  {(restockQty * selectedItem.unitCostETB).toLocaleString()} ETB
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold hover:brightness-105 transition-all cursor-pointer shadow-sm"
                >
                  Confirm & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
