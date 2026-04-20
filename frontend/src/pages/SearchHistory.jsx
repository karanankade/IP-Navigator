import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2 } from 'lucide-react';

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/history');
        setHistory(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleClear = async () => {
    try {
      await axios.delete('/history');
      setHistory([]);
    } catch (err) {}
  };

  if (loading) return <div className="text-center py-10">Loading history...</div>;

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Search History</h1>
        </div>
        {history.length > 0 && (
          <button onClick={handleClear} className="btn-secondary !text-red-500 hover:!bg-red-50">Clear All</button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 card border-dashed">
          <p className="text-[var(--text-secondary)]">Your search history is empty.</p>
        </div>
      ) : (
        <div className="bg-[var(--surface-high)]  rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-low)] dark:bg-slate-800/50 border-b border-slate-200 dark:border-dark-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm">Tool</th>
                <th className="px-6 py-3 font-semibold text-sm">Query</th>
                <th className="px-6 py-3 font-semibold text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-[var(--surface-low)] dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">{item.toolName}</td>
                  <td className="px-6 py-4 font-mono text-primary-600">{item.ipAddress}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
