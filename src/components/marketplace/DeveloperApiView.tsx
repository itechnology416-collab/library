import React, { useState, useEffect } from 'react';
import { MarketplaceApiKey, MarketplaceWebhook } from '../../types/marketplace';
import { useAuth } from '../../context/AuthContext';

export const DeveloperApiView: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<MarketplaceApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<MarketplaceWebhook[]>([]);
  const [keyLabel, setKeyLabel] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchDevData = () => {
    fetch('/api/marketplace/developer')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.apiKeys)) setApiKeys(data.apiKeys);
          if (Array.isArray(data.webhooks)) setWebhooks(data.webhooks);
        }
      })
      .catch((err) => console.warn('Could not fetch developer data:', err));
  };

  useEffect(() => {
    fetchDevData();
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyLabel.trim()) return;
    try {
      const res = await fetch('/api/marketplace/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorEmail: user?.email || 'engineering@wki.edu.et',
          label: keyLabel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setKeyLabel('');
        fetchDevData();
      }
    } catch (err) {
      console.warn('Create API key error:', err);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;
    try {
      await fetch(`/api/marketplace/developer/keys/${keyId}`, { method: 'DELETE' });
      fetchDevData();
    } catch (err) {
      console.warn('Revoke key error:', err);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    try {
      const res = await fetch('/api/marketplace/developer/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorEmail: user?.email || 'engineering@wki.edu.et',
          targetUrl: webhookUrl,
          eventTypes: ['inquiry.created', 'license.purchased'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookUrl('');
        fetchDevData();
      }
    } catch (err) {
      console.warn('Create webhook error:', err);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestResult('Sending test payload...');
    try {
      const res = await fetch('/api/marketplace/developer/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookId }),
      });
      const data = await res.json();
      setTestResult(`Ping Response: ${data.status} at ${data.deliveredAt}`);
      setTimeout(() => setTestResult(null), 5000);
    } catch (err) {
      setTestResult('Webhook delivery failed.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md">
        <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary font-bold text-xs uppercase tracking-wider">
          Developer Ecosystem & Webhooks
        </span>
        <h3 className="text-xl font-extrabold text-on-surface mt-1">
          REST API Keys & Instant Event Webhooks
        </h3>
        <p className="text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
          Integrate your deployed software systems with external institutional ERPs, automated CRM pipelines, and notification bots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: API Keys */}
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">key</span>
              <span>Active REST API Keys</span>
            </h4>
            <span className="text-[10px] text-on-surface-variant font-mono">{apiKeys.length} Keys</span>
          </div>

          <form onSubmit={handleCreateApiKey} className="flex gap-2">
            <input
              type="text"
              value={keyLabel}
              onChange={(e) => setKeyLabel(e.target.value)}
              placeholder="Label (e.g. Mobile App Backend)"
              required
              className="flex-1 p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-105 cursor-pointer whitespace-nowrap"
            >
              Generate Key
            </button>
          </form>

          <div className="space-y-2">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-3 rounded-2xl bg-surface-container/40 border border-outline-variant/20 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-on-surface">{key.label}</div>
                  <div className="font-mono text-[10px] text-secondary select-all">{key.apiKey}</div>
                </div>
                <button
                  onClick={() => handleRevokeKey(key.id)}
                  className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors font-bold text-[10px] cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>

          {/* Quick cURL Example */}
          <div className="p-3 rounded-2xl bg-black/60 text-slate-200 font-mono text-[10px] space-y-1">
            <span className="text-secondary font-bold block">cURL Authentication Example:</span>
            <code>curl -H "X-WKI-API-KEY: {apiKeys[0]?.apiKey || 'your_key'}" https://press.wki.edu.et/api/marketplace/projects</code>
          </div>
        </div>

        {/* Section 2: Webhooks */}
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">webhook</span>
              <span>Event Webhooks</span>
            </h4>
            <span className="text-[10px] text-on-surface-variant font-mono">{webhooks.length} Active</span>
          </div>

          <form onSubmit={handleCreateWebhook} className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.edu.et/webhooks"
              required
              className="flex-1 p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer whitespace-nowrap"
            >
              Add Hook
            </button>
          </form>

          {testResult && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 font-bold text-[10px] animate-pulse">
              {testResult}
            </div>
          )}

          <div className="space-y-2">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-3 rounded-2xl bg-surface-container/40 border border-outline-variant/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface font-mono truncate max-w-xs">{wh.targetUrl}</span>
                  <button
                    onClick={() => handleTestWebhook(wh.id)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-[10px] cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                  <span>Secret: <b className="font-mono text-secondary">{wh.secret}</b></span>
                  <span>Events: inquiry.created, license.purchased</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
