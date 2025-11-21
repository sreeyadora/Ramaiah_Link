import React from 'react';
import { MOCK_USERS, MOCK_JOBS, MOCK_MENTORSHIP_REQUESTS } from '../constants';
import { UserRole, User } from '../types';
import { MapPin, Briefcase, Clock, UserCheck, MessageSquare } from 'lucide-react';

interface Props {
  currentUser: User;
}

export const MentorshipBoard: React.FC<Props> = ({ currentUser }) => {
  const isStudent = currentUser.role === UserRole.STUDENT;
  const mentors = MOCK_USERS.filter(u => u.role === UserRole.ALUMNI);

  return (
    <div className="space-y-8">
      {/* Opportunities Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Opportunities Board
          </h2>
          {currentUser.role === UserRole.ALUMNI && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Post Opportunity
            </button>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_JOBS.map(job => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                    <p className="text-slate-500 font-medium">{job.company}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    job.type === 'INTERNSHIP' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                }`}>
                    {job.type}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.datePosted}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-1">
                    {job.skillsRequired.map(s => (
                        <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{s}</span>
                    ))}
                </div>
                <button className="text-blue-600 text-sm font-semibold hover:underline">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentors / Requests Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            {isStudent ? 'Available Mentors' : 'Mentorship Requests'}
          </h2>
        </div>

        {isStudent ? (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {mentors.map(mentor => (
               <div key={mentor.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                 <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-700 relative">
                    <div className="absolute -bottom-8 left-4">
                        <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                    </div>
                 </div>
                 <div className="pt-10 px-4 pb-4">
                    <h3 className="font-bold text-slate-800">{mentor.name}</h3>
                    <p className="text-sm text-slate-500">{mentor.department} Alumnus</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 mb-3">
                        <MapPin className="w-3 h-3" /> {mentor.location}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                        {mentor.skills.slice(0,3).map(s => (
                            <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{s}</span>
                        ))}
                    </div>
                    <button className="w-full py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
                        Request Sprint
                    </button>
                 </div>
               </div>
             ))}
           </div>
        ) : (
            <div className="space-y-3">
                {MOCK_MENTORSHIP_REQUESTS.map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{req.topic}</h4>
                                <p className="text-sm text-slate-500">Request from <span className="font-semibold text-slate-700">{req.studentName}</span></p>
                                <p className="text-sm text-slate-400 italic mt-1">"{req.message}"</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Accept</button>
                            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50">Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>
    </div>
  );
};