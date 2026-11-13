import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Check, X, Search, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const ProjectConnections = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { token } = useAuthStore();

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setMessage({ type: '', text: '' });
      await axios.post(`http://localhost:5000/api/projects/${projectId}/invite`, 
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Invitation sent successfully!' });
      setInviteEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send invitation' });
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Invite Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <UserPlus className="text-indigo-600" />
            Invite to Project
          </h2>
          <form onSubmit={handleInvite} className="flex gap-4 items-start">
            <div className="flex-1">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              {message.text && (
                <p className={`mt-2 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message.text}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              Send Invite
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <UserIcon className="text-indigo-600" />
            Team Members ({members.length})
          </h2>
          
          {isLoading ? (
             <div className="text-center py-8 text-slate-500">Loading members...</div>
          ) : members.length === 0 ? (
             <div className="text-center py-8 text-slate-500">No members yet. Invite someone!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member._id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                      {member.role || 'Member'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectConnections;
