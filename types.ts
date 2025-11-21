export enum UserRole {
    STUDENT = 'STUDENT',
    ALUMNI = 'ALUMNI',
    ADMIN = 'ADMIN',
    FACULTY = 'FACULTY'
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    department: string;
    location?: string;
    skills: string[];
    trustScore?: number; // 0-100
    isVerified: boolean;
  }
  
  export interface MentorshipRequest {
    id: string;
    studentId: string;
    studentName: string;
    mentorId: string;
    topic: string;
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED';
    message: string;
    date: string;
  }
  
  export interface JobOpportunity {
    id: string;
    title: string;
    company: string;
    type: 'INTERNSHIP' | 'FULL_TIME' | 'PROJECT';
    location: string;
    postedBy: string; // User ID (Alumni)
    datePosted: string;
    skillsRequired: string[];
  }
  
  export interface SkillGapReport {
    targetRole: string;
    missingSkills: string[];
    recommendations: string[];
    learningSprintPlan: string;
  }
  
  export interface AnalyticsData {
    name: string;
    value: number;
  }

  // --- New Types for Full System ---

  export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: number;
    read: boolean;
  }

  export interface ForumPost {
    id: string;
    authorId: string; // 'anonymous' if isAnonymous is true
    authorName: string; // 'Anonymous Student' if true
    content: string;
    tags: string[];
    likes: number;
    replies: number;
    timestamp: number;
    isAnonymous: boolean;
  }

  export interface ProfileAnalysisResult {
    isSuspicious: boolean;
    confidenceScore: number;
    reasons: string[];
  }