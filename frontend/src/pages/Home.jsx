import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Database, Layers, ArrowRight, Hash, GitBranch, Binary, ArrowLeftRight, Network } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TOOLS = [
  { icon: Layers,         label: 'IPv4 Calculator',  desc: 'Subnet masks, CIDR, wildcard, host ranges & broadcast.',  tab: 'ipv4',     color: 'from-cyan-500/20 to-blue-500/10',    border: 'hover:border-cyan-500/30' },
  { icon: Hash,           label: 'IPv6 Calculator',  desc: 'Expand, compress & analyze IPv6 with prefix lengths.',    tab: 'ipv6',     color: 'from-violet-500/20 to-purple-500/10', border: 'hover:border-violet-500/30' },
  { icon: ShieldCheck,    label: 'IP Validator',     desc: 'Instantly verify any IPv4 or IPv6 address format.',       tab: 'validate', color: 'from-green-500/20 to-emerald-500/10', border: 'hover:border-green-500/30' },
  { icon: Network,        label: 'IP Range List',    desc: 'List every IP between two addresses (up to 1000).',       tab: 'range',    color: 'from-orange-500/20 to-amber-500/10',  border: 'hover:border-orange-500/30' },
  { icon: ArrowLeftRight, label: 'CIDR Converter',   desc: 'Convert between CIDR notation and subnet masks.',         tab: 'cidr',     color: 'from-pink-500/20 to-rose-500/10',     border: 'hover:border-pink-500/30' },
  { icon: Binary,         label: 'Binary Visualizer',desc: 'See IPs in binary, hex & decimal with bit-level detail.', tab: 'binary',   color: 'from-teal-500/20 to-cyan-500/10',     border: 'hover:border-teal-500/30' },
  { icon: GitBranch,      label: 'VLSM Calculator',  desc: 'Allocate subnets efficiently with variable-length masks.',tab: 'vlsm',     color: 'from-indigo-500/20 to-blue-500/10',   border: 'hover:border-indigo-500/30' },
  { icon: Database,       label: 'History & Reports',desc: 'Save results and track every query in your dashboard.',   tab: null,       color: 'from-slate-500/20 to-gray-500/10',    border: 'hover:border-slate-500/30' },
];

const STATS = [
  { value: '7', label: 'Powerful Tools' },
  { value: 'v4+v6', label: 'IP Versions' },
  { value: '128-bit', label: 'IPv6 Support' },
  { value: 'Free', label: 'Always' },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (searchQuery.trim()) navigate('/tools', { state: { defaultIp: searchQuery } });
  };

  return (
    <div className="space-y-28 pb-20">

      {/* ── Hero ── */}
      <section className="relative pt-16 lg:pt-28 flex flex-col items-center text-center">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[var(--accent-glow)]/10 blur-[140px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-[var(--tertiary)]/8 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          className="max-w-4xl space-y-7">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{ background: 'rgba(59,191,250,0.08)', border: '1px solid rgba(59,191,250,0.2)', color: 'var(--accent-glow)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-glow)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-glow)]" />
            </span>
            IP Navigator v1.0 — Now with 7 Tools
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-[var(--text-primary)]">The Ultimate</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-glow)] via-blue-400 to-[var(--tertiary)]">
              IP & Network Toolkit
            </span>
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Subnet calculations, binary visualization, VLSM allocation, CIDR conversion and more —
            all in one fast, beautiful interface.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-2xl mx-auto w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-glow)] transition-colors" />
              </div>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                className="block w-full pl-14 pr-36 py-5 text-base rounded-2xl outline-none transition-all placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
                style={{
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
                placeholder="Enter an IP e.g. 192.168.1.1 or 2001:db8::1"
              />
              <div className="absolute inset-y-2 right-2">
                <button onClick={handleAnalyze} className="btn-primary !py-3 !px-5 h-full flex items-center gap-2">
                  Analyze <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3">
              Try: <button onClick={() => { setSearchQuery('192.168.1.0'); }} className="text-[var(--accent-glow)] hover:underline">192.168.1.0</button>
              {' · '}
              <button onClick={() => { setSearchQuery('2001:db8::1'); }} className="text-[var(--accent-glow)] hover:underline">2001:db8::1</button>
              {' · '}
              <button onClick={() => { setSearchQuery('10.0.0.1'); }} className="text-[var(--accent-glow)] hover:underline">10.0.0.1</button>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="card text-center !p-5">
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-glow)] to-[var(--tertiary)]">{s.value}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </motion.section>

      {/* ── Tools Grid ── */}
      <section className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Everything You Need</h2>
          <p className="text-[var(--text-secondary)]">Click any tool to jump straight in</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 + 0.2 }}>
              {tool.tab ? (
                <Link to="/tools" state={{ tab: tool.tab }}
                  className={`card group block h-full cursor-pointer ${tool.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                  <ToolCardInner tool={tool} />
                </Link>
              ) : (
                <Link to="/dashboard"
                  className={`card group block h-full cursor-pointer ${tool.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                  <ToolCardInner tool={tool} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto text-center space-y-5">
        <div className="card !p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)]/5 to-[var(--tertiary)]/5 pointer-events-none" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Ready to dive in?</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">No setup needed. All tools work instantly in your browser.</p>
          <Link to="/tools" className="btn-primary inline-flex items-center gap-2">
            Open All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

const ToolCardInner = ({ tool }) => (
  <>
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'var(--accent-glow)' }}>
      <tool.icon className="w-5 h-5" />
    </div>
    <h3 className="font-bold text-[var(--text-primary)] mb-1.5 text-sm">{tool.label}</h3>
    <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{tool.desc}</p>
  </>
);

export default Home;
