import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ANALYTICS_DATA, ALUMNI_LOCATIONS, MOCK_USERS } from '../constants';
import { verifyUserProfile } from '../services/geminiService';
import { ShieldCheck, AlertTriangle, CheckCircle, Search, Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AdminDashboard: React.FC = () => {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{[key: string]: any}>({});

  const handleVerify = async (userId: string) => {
    setVerifying(userId);
    const user = MOCK_USERS.find(u => u.id === userId); // In real app, fetch from backend
    if (!user) return;

    try {
        const result = await verifyUserProfile(user);
        setVerificationResult(prev => ({ ...prev, [userId]: result }));
    } catch (e) {
        alert("Verification failed");
    } finally {
        setVerifying(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">Pending Verifications</h3>
                <ShieldCheck className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">12</div>
            <p className="text-xs text-slate-400 mt-1">+2 from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">Fake Profiles Detected</h3>
                <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-400 mt-1">Auto-blocked by ML</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">System Health</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900">98%</div>
            <p className="text-xs text-slate-400 mt-1">Optimal Performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Analytics Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Platform Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alumni Geo Map Simulation */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Alumni Distribution (Geo-Map Data)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALUMNI_LOCATIONS}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ALUMNI_LOCATIONS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

        {/* Verification Queue with AI */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Verification Queue</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">AI Enhanced</span>
            </div>
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Trust Score</th>
                        <th className="px-6 py-3">AI Analysis</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="px-6 py-4">Amit Patel</td>
                        <td className="px-6 py-4">Alumni (2019)</td>
                        <td className="px-6 py-4"><span className="text-orange-500 font-bold">45/100</span></td>
                        <td className="px-6 py-4">
                             {verificationResult['u2'] ? (
                                <div className={verificationResult['u2'].isSuspicious ? "text-red-600" : "text-green-600"}>
                                    {verificationResult['u2'].isSuspicious ? "Suspicious" : "Verified"} ({verificationResult['u2'].confidenceScore}%)
                                </div>
                             ) : (
                                <button 
                                    onClick={() => handleVerify('u2')} // Mocking Amit as u2 for demo
                                    disabled={verifying === 'u2'}
                                    className="text-indigo-600 flex items-center gap-1 hover:underline"
                                >
                                    {verifying === 'u2' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                                    Run AI Check
                                </button>
                             )}
                        </td>
                        <td className="px-6 py-4">
                            <button className="text-green-600 hover:text-green-800 mr-3 font-medium">Approve</button>
                            <button className="text-red-600 hover:text-red-800 font-medium">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
};