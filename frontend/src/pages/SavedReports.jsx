import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Trash2, Download, FileText, Calendar, Wrench } from 'lucide-react';

const downloadReport = (report) => {
  const content = {
    title: report.title,
    tool: report.toolName,
    savedOn: new Date(report.createdAt).toLocaleString(),
    input: report.inputData || {},
    results: report.resultData || {},
  };
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.title.replace(/[^a-z0-9]/gi, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const SavedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    axios.get('/reports')
      .then(res => setReports(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
    } catch {}
    setDeletingId(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full bg-[var(--accent-glow)] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="tool-icon-wrap">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Saved Reports</h1>
            <p className="text-xs text-[var(--text-secondary)]">{reports.length} report{reports.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {reports.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card text-center py-16 space-y-3"
          style={{ borderStyle: 'dashed' }}>
          <FileText className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
          <p className="text-[var(--text-secondary)] font-medium">No reports saved yet</p>
          <p className="text-xs text-[var(--text-secondary)] opacity-60">Use any tool and click "Save Report" to store results here.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reports.map((report, i) => (
              <motion.div key={report._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card group flex items-center justify-between gap-4 !p-5 hover:border-[var(--accent-glow)]/20 transition-all">

                {/* Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(59,191,250,0.08)', border: '1px solid rgba(59,191,250,0.15)' }}>
                    <FileText className="w-4 h-4 text-[var(--accent-glow)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{report.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <Wrench className="w-3 h-3" /> {report.toolName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <Calendar className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => downloadReport(report)}
                    title="Download as JSON"
                    className="p-2 rounded-xl text-[var(--accent-glow)] transition-all hover:scale-105"
                    style={{ background: 'rgba(59,191,250,0.08)', border: '1px solid rgba(59,191,250,0.2)' }}>
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(report._id)}
                    disabled={deletingId === report._id}
                    title="Delete report"
                    className="p-2 rounded-xl text-red-400 transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SavedReports;
