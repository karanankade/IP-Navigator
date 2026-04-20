import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Database, Clock, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [historyCount, setHistoryCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const histRes = await axios.get('/history');
          const repRes = await axios.get('/reports');
          setHistoryCount(histRes.data.count);
          setReportsCount(repRes.data.count);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card border-t-4 border-t-primary-500 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg text-[var(--text-secondary)] ">Saved Reports</h3>
            <Database className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">{reportsCount}</p>
        </div>
        
        <div className="card border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg text-[var(--text-secondary)] ">Search History</h3>
            <Clock className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{historyCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
