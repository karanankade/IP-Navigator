import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Hash, ShieldCheck, Network, ArrowLeftRight,
  Binary, GitBranch, Copy, Check, Save, ChevronRight, Plus, Trash2
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────── */
const copyToClipboard = async (text, setCopied) => {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

/* ─── Copy Button ─────────────────────────────────────── */
const CopyBtn = ({ value }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => copyToClipboard(String(value), setCopied)}
      className="ml-2 p-1 rounded hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-glow)]">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

/* ─── Result Card ─────────────────────────────────────── */
const ResultCard = ({ label, value, accent }) => {
  if (value === undefined || value === null) return null;
  const isBoolean = typeof value === 'boolean';
  const isArray = Array.isArray(value);
  const isObject = typeof value === 'object' && !isArray;

  return (
    <div className={`result-card ${accent ? 'result-card-accent' : ''}`}>
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-1.5 font-semibold">{label}</p>
      {isBoolean ? (
        <span className={`badge ${value ? 'badge-green' : 'badge-red'}`}>{value ? 'TRUE' : 'FALSE'}</span>
      ) : isArray ? (
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {value.length === 0
            ? <span className="text-[var(--text-secondary)] text-sm">None</span>
            : value.map((v, i) => <span key={i} className="chip">{typeof v === 'object' ? JSON.stringify(v) : v}</span>)}
        </div>
      ) : isObject ? (
        <pre className="text-xs text-[var(--accent-glow)] font-mono overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <div className="flex items-center">
          <span className="font-mono text-[var(--accent-glow)] text-sm break-all">{String(value)}</span>
          <CopyBtn value={value} />
        </div>
      )}
    </div>
  );
};

/* ─── Generic flat result grid ────────────────────────── */
const FlatResults = ({ data, skip = [] }) => {
  const formatKey = k => k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  const entries = Object.entries(data).filter(([k]) => !skip.includes(k));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map(([k, v]) => <ResultCard key={k} label={formatKey(k)} value={v} />)}
    </div>
  );
};

/* ─── Binary Octet Visual ─────────────────────────────── */
const OctetVisual = ({ octet }) => (
  <div className="bg-[var(--surface-low)] rounded-xl p-4 border border-[var(--border-color)]">
    <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">{octet.label}</p>
    <div className="flex gap-1 mb-2 flex-wrap">
      {octet.binary.split('').map((bit, i) => (
        <span key={i} className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold font-mono
          ${bit === '1' ? 'bg-[var(--accent-glow)]/20 text-[var(--accent-glow)] border border-[var(--accent-glow)]/40'
            : 'bg-[var(--surface-highest)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
          {bit}
        </span>
      ))}
    </div>
    <div className="flex gap-3 text-xs">
      <span className="text-[var(--text-secondary)]">DEC <span className="text-[var(--text-primary)] font-mono font-bold">{octet.decimal}</span></span>
      <span className="text-[var(--text-secondary)]">HEX <span className="text-[var(--accent-glow)] font-mono font-bold">{octet.hex}</span></span>
    </div>
  </div>
);

/* ─── VLSM Allocation Row ─────────────────────────────── */
const VlsmRow = ({ alloc, index }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
    className="bg-[var(--surface-low)] rounded-xl p-4 border border-[var(--border-color)] hover:border-[var(--accent-glow)]/30 transition-all">
    <div className="flex items-center justify-between mb-3">
      <span className="font-semibold text-[var(--text-primary)]">{alloc.name}</span>
      <span className="badge badge-blue">{alloc.cidr}</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
      {[
        ['Network', alloc.networkAddress], ['Mask', alloc.subnetMask],
        ['First Host', alloc.firstHost], ['Last Host', alloc.lastHost],
        ['Broadcast', alloc.broadcastAddress], ['Usable Hosts', alloc.usableHosts]
      ].map(([l, v]) => (
        <div key={l}>
          <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">{l}</p>
          <p className="font-mono text-[var(--accent-glow)] font-medium">{v}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Input Field ─────────────────────────────────────── */
const Field = ({ label, value, onChange, placeholder, type = 'text', width = 'flex-1' }) => (
  <div className={`${width} min-w-[140px]`}>
    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      className="input-field" placeholder={placeholder} />
  </div>
);

/* ─── Tool Form Wrapper ───────────────────────────────── */
const ToolForm = ({ onSubmit, children, btnLabel = 'Calculate' }) => (
  <form onSubmit={e => { e.preventDefault(); onSubmit(); }}
    className="flex gap-3 items-end flex-wrap">
    {children}
    <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
      {btnLabel} <ChevronRight className="w-4 h-4" />
    </button>
  </form>
);

/* ─── Save Button ─────────────────────────────────────── */
const SaveBtn = ({ activeTab, result }) => {
  const [saved, setSaved] = useState(false);
  return (
    <button onClick={async () => {
      try {
        await axios.post('/reports', { title: `${activeTab} — ${new Date().toLocaleDateString()}`, toolName: activeTab, resultData: result });
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      } catch { alert('Login to save reports.'); }
    }} className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs">
      {saved ? <><Check className="w-3.5 h-3.5 text-green-400" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Report</>}
    </button>
  );
};

/* ─── Main Component ──────────────────────────────────── */
const IPTools = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('ipv4');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Per-tool state
  const [ip, setIp] = useState('');
  const [cidr, setCidr] = useState('24');
  const [startIp, setStartIp] = useState('');
  const [endIp, setEndIp] = useState('');
  const [cidrInput, setCidrInput] = useState('');
  const [vlsmNetwork, setVlsmNetwork] = useState('');
  const [vlsmSubnets, setVlsmSubnets] = useState([{ name: 'Subnet A', hosts: 50 }, { name: 'Subnet B', hosts: 20 }]);

  useEffect(() => {
    if (location.state?.defaultIp) { setIp(location.state.defaultIp); setActiveTab('validate'); }
    if (location.state?.tab) { setActiveTab(location.state.tab); }
  }, [location.state]);

  const call = async (endpoint, payload) => {
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await axios.post(`/tools/${endpoint}`, payload);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Check your inputs.');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'ipv4',    label: 'IPv4 Calc',    icon: Layers },
    { id: 'ipv6',    label: 'IPv6 Calc',    icon: Hash },
    { id: 'validate',label: 'IP Validator', icon: ShieldCheck },
    { id: 'range',   label: 'IP Range',     icon: Network },
    { id: 'cidr',    label: 'CIDR Conv.',   icon: ArrowLeftRight },
    { id: 'binary',  label: 'Binary Viz',   icon: Binary },
    { id: 'vlsm',    label: 'VLSM Calc',    icon: GitBranch },
  ];

  const renderForm = () => {
    switch (activeTab) {
      case 'ipv4': return (
        <ToolForm onSubmit={() => call('ipv4-subnet', { ip, cidr })} btnLabel="Calculate">
          <Field label="IPv4 Address" value={ip} onChange={setIp} placeholder="192.168.1.0" />
          <Field label="CIDR Prefix" value={cidr} onChange={setCidr} placeholder="24" type="number" width="w-28" />
        </ToolForm>
      );
      case 'ipv6': return (
        <ToolForm onSubmit={() => call('ipv6-analyze', { ip, prefix: cidr })} btnLabel="Analyze">
          <Field label="IPv6 Address" value={ip} onChange={setIp} placeholder="2001:db8::1" />
          <Field label="Prefix Length" value={cidr} onChange={setCidr} placeholder="64" type="number" width="w-32" />
        </ToolForm>
      );
      case 'validate': return (
        <ToolForm onSubmit={() => call('validate-ip', { ip })} btnLabel="Validate">
          <Field label="IP Address (v4 or v6)" value={ip} onChange={setIp} placeholder="8.8.8.8" />
        </ToolForm>
      );
      case 'range': return (
        <ToolForm onSubmit={() => call('range-generator', { startIp, endIp })} btnLabel="Generate">
          <Field label="Start IP" value={startIp} onChange={setStartIp} placeholder="10.0.0.1" />
          <Field label="End IP" value={endIp} onChange={setEndIp} placeholder="10.0.0.20" />
        </ToolForm>
      );
      case 'cidr': return (
        <ToolForm onSubmit={() => call('cidr-converter', { input: cidrInput })} btnLabel="Convert">
          <Field label="CIDR (0–32) or Subnet Mask" value={cidrInput} onChange={setCidrInput} placeholder="24 or 255.255.255.0" />
        </ToolForm>
      );
      case 'binary': return (
        <ToolForm onSubmit={() => call('binary-visualizer', { ip })} btnLabel="Visualize">
          <Field label="IP Address (v4 or v6)" value={ip} onChange={setIp} placeholder="192.168.1.1" />
        </ToolForm>
      );
      case 'vlsm': return (
        <div className="space-y-4">
          <ToolForm onSubmit={() => call('vlsm-calculator', { network: vlsmNetwork, subnets: vlsmSubnets })} btnLabel="Allocate">
            <Field label="Base Network (CIDR)" value={vlsmNetwork} onChange={setVlsmNetwork} placeholder="192.168.1.0/24" />
          </ToolForm>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Subnets Required</p>
              <button type="button" onClick={() => setVlsmSubnets(s => [...s, { name: `Subnet ${String.fromCharCode(65 + s.length)}`, hosts: 10 }])}
                className="btn-secondary !py-1 !px-2.5 flex items-center gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Subnet
              </button>
            </div>
            {vlsmSubnets.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={s.name} onChange={e => setVlsmSubnets(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  className="input-field flex-1" placeholder="Subnet name" />
                <input type="number" value={s.hosts} onChange={e => setVlsmSubnets(prev => prev.map((x, j) => j === i ? { ...x, hosts: parseInt(e.target.value) || 0 } : x))}
                  className="input-field w-28" placeholder="Hosts needed" />
                <button type="button" onClick={() => setVlsmSubnets(s => s.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => call('vlsm-calculator', { network: vlsmNetwork, subnets: vlsmSubnets })}
              className="btn-primary flex items-center gap-2 mt-2">
              Allocate Subnets <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (activeTab === 'binary' && result.octets) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.octets.map((o, i) => <OctetVisual key={i} octet={o} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultCard label="Full Binary" value={result.binary} />
            <ResultCard label="Hexadecimal" value={result.hexadecimal} />
            <ResultCard label="Decimal (32-bit)" value={result.decimal} />
            <ResultCard label="Class" value={result.class} />
            <ResultCard label="Type" value={result.type} />
          </div>
        </div>
      );
    }
    if (activeTab === 'binary' && result.groups) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.groups.map((g, i) => (
              <div key={i} className="bg-[var(--surface-low)] rounded-xl p-3 border border-[var(--border-color)]">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">{g.label}</p>
                <p className="font-mono text-[var(--accent-glow)] font-bold text-sm">{g.hex}</p>
                <p className="font-mono text-[var(--text-secondary)] text-[10px] mt-1 break-all">{g.binary}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultCard label="Expanded" value={result.expanded} />
            <ResultCard label="Compressed" value={result.compressed} />
            <ResultCard label="Type" value={result.type} />
          </div>
        </div>
      );
    }
    if (activeTab === 'vlsm' && result.allocations) {
      return (
        <div className="space-y-3">
          <div className="flex gap-3 mb-2">
            <ResultCard label="Base Network" value={result.network} />
            <ResultCard label="Subnets Allocated" value={result.subnetsAllocated} />
          </div>
          {result.allocations.map((a, i) => <VlsmRow key={i} alloc={a} index={i} />)}
        </div>
      );
    }
    if (activeTab === 'range' && result.ips) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Total IPs" value={result.count} accent />
            <ResultCard label="Type" value={result.type} />
          </div>
          <div className="bg-[var(--surface-low)] rounded-xl p-4 border border-[var(--border-color)]">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-3 font-semibold">IP List</p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {result.ips.map((ip, i) => <span key={i} className="chip font-mono">{ip}</span>)}
            </div>
          </div>
        </div>
      );
    }
    // Generic flat display
    const flattenData = (obj) => {
      let r = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) r = { ...r, ...flattenData(v) };
        else r[k] = v;
      }
      return r;
    };
    return <FlatResults data={flattenData(result)} />;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-glow)] to-[var(--tertiary)]">Utilities</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">7 powerful tools for IPv4, IPv6, subnetting & more</p>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((t, i) => (
          <motion.button key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => { setActiveTab(t.id); setResult(null); setError(''); }}
            className={`tab-btn ${activeTab === t.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Tool Card */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }} className="tool-card">
          {/* Tool Header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border-color)]">
            <div className="tool-icon-wrap">
              {(() => { const T = tabs.find(t => t.id === activeTab); return T ? <T.icon className="w-5 h-5" /> : null; })()}
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-xs text-[var(--text-secondary)]">{
                { ipv4: 'Subnet calculation, CIDR, wildcard mask & host ranges',
                  ipv6: 'Expand, compress & analyze IPv6 addresses',
                  validate: 'Validate any IPv4 or IPv6 address instantly',
                  range: 'List all IPs between two addresses (max 1000)',
                  cidr: 'Convert between CIDR notation and subnet masks',
                  binary: 'Visualize IP addresses in binary, hex & decimal',
                  vlsm: 'Allocate subnets efficiently using VLSM' }[activeTab]
              }</p>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {renderForm()}

          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-[var(--accent-glow)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[var(--accent-glow)] to-[var(--tertiary)]" />
                    Results
                  </h3>
                  <SaveBtn activeTab={activeTab} result={result} />
                </div>
                {renderResult()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default IPTools;
