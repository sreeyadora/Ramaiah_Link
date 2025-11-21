import { User, UserRole, JobOpportunity, MentorshipRequest, AnalyticsData } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Aditi Rao',
    email: 'aditi@ruas.edu.in',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/200/200?random=1',
    department: 'Computer Science',
    skills: ['React', 'JavaScript', 'HTML'],
    isVerified: true,
    trustScore: 95
  },
  {
    id: 'u2',
    name: 'Rahul Verma',
    email: 'rahul.v@techcorp.com',
    role: UserRole.ALUMNI,
    avatar: 'https://picsum.photos/200/200?random=2',
    department: 'Computer Science',
    location: 'Bangalore, India',
    skills: ['System Design', 'Cloud Architecture', 'Python', 'Mentoring'],
    isVerified: true,
    trustScore: 98
  },
  {
    id: 'u3',
    name: 'Dr. S. Patil',
    email: 'hod.cs@ruas.edu.in',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/200/200?random=3',
    department: 'Administration',
    skills: ['Management', 'Curriculum'],
    isVerified: true,
    trustScore: 100
  },
  {
    id: 'u4',
    name: 'Priya Sharma',
    email: 'priya.s@start.up',
    role: UserRole.ALUMNI,
    avatar: 'https://picsum.photos/200/200?random=4',
    department: 'Design',
    location: 'London, UK',
    skills: ['UX Research', 'Figma', 'Product Strategy'],
    isVerified: true,
    trustScore: 92
  }
];

export const MOCK_JOBS: JobOpportunity[] = [
  {
    id: 'j1',
    title: 'Frontend Intern',
    company: 'TechFlow',
    type: 'INTERNSHIP',
    location: 'Remote / Bangalore',
    postedBy: 'u2',
    datePosted: '2024-05-10',
    skillsRequired: ['React', 'Tailwind']
  },
  {
    id: 'j2',
    title: 'Junior Data Analyst',
    company: 'DataMinds',
    type: 'FULL_TIME',
    location: 'Mumbai',
    postedBy: 'u4',
    datePosted: '2024-05-12',
    skillsRequired: ['Python', 'SQL', 'Tableau']
  }
];

export const MOCK_MENTORSHIP_REQUESTS: MentorshipRequest[] = [
  {
    id: 'm1',
    studentId: 'u1',
    studentName: 'Aditi Rao',
    mentorId: 'u2',
    topic: 'Career Path in Cloud Computing',
    status: 'PENDING',
    message: 'Hi Rahul, I admire your work in Cloud. Could you guide me?',
    date: '2024-05-14'
  }
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Active Mentorships', value: 45 },
  { name: 'Job Placements', value: 12 },
  { name: 'Skill Gaps Identified', value: 78 },
  { name: 'Alumni Onboarded', value: 150 },
];

export const ALUMNI_LOCATIONS = [
    { name: 'Bangalore', value: 400 },
    { name: 'Mumbai', value: 120 },
    { name: 'San Francisco', value: 45 },
    { name: 'London', value: 30 },
    { name: 'Singapore', value: 25 },
];