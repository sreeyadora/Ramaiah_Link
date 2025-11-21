import { User, JobOpportunity, MentorshipRequest, ChatMessage, ForumPost, UserRole } from '../types';
import { MOCK_USERS, MOCK_JOBS, MOCK_MENTORSHIP_REQUESTS } from '../constants';

// Keys for LocalStorage
const LS_KEYS = {
  USERS: 'rl_users',
  JOBS: 'rl_jobs',
  MENTORSHIP: 'rl_mentorship',
  CHAT: 'rl_chat',
  FORUM: 'rl_forum'
};

// Initialize Data if empty
const initializeData = () => {
  if (!localStorage.getItem(LS_KEYS.USERS)) {
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(LS_KEYS.JOBS)) {
    localStorage.setItem(LS_KEYS.JOBS, JSON.stringify(MOCK_JOBS));
  }
  if (!localStorage.getItem(LS_KEYS.MENTORSHIP)) {
    localStorage.setItem(LS_KEYS.MENTORSHIP, JSON.stringify(MOCK_MENTORSHIP_REQUESTS));
  }
  if (!localStorage.getItem(LS_KEYS.FORUM)) {
    const initialPosts: ForumPost[] = [
        {
            id: 'p1',
            authorId: 'u1',
            authorName: 'Aditi Rao',
            content: 'Does anyone have resources for the Advanced Algorithms exam?',
            tags: ['CSE', 'Exam'],
            likes: 5,
            replies: 2,
            timestamp: Date.now() - 10000000,
            isAnonymous: false
        },
        {
            id: 'p2',
            authorId: 'anonymous',
            authorName: 'Anonymous Student',
            content: 'I am feeling overwhelmed with the final year project. How do you manage stress?',
            tags: ['Mental Health', 'Advice'],
            likes: 12,
            replies: 8,
            timestamp: Date.now() - 5000000,
            isAnonymous: true
        }
    ];
    localStorage.setItem(LS_KEYS.FORUM, JSON.stringify(initialPosts));
  }
  if (!localStorage.getItem(LS_KEYS.CHAT)) {
     const initialChat: ChatMessage[] = [
         {
             id: 'c1',
             senderId: 'u2',
             receiverId: 'u1',
             text: 'Hi Aditi, I saw your mentorship request. Happy to help!',
             timestamp: Date.now() - 86400000,
             read: true
         },
         {
             id: 'c2',
             senderId: 'u1',
             receiverId: 'u2',
             text: 'Thank you so much Rahul! When are you available to connect?',
             timestamp: Date.now() - 86000000,
             read: true
         }
     ];
     localStorage.setItem(LS_KEYS.CHAT, JSON.stringify(initialChat));
  }
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const backend = {
  init: initializeData,

  // --- User Services ---
  getUsers: async (): Promise<User[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const users = JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
    return users.find((u: User) => u.id === id);
  },

  // --- Chat Services ---
  getMessages: async (userId: string, contactId: string): Promise<ChatMessage[]> => {
    await delay(100);
    const allMessages: ChatMessage[] = JSON.parse(localStorage.getItem(LS_KEYS.CHAT) || '[]');
    return allMessages.filter(m => 
        (m.senderId === userId && m.receiverId === contactId) ||
        (m.senderId === contactId && m.receiverId === userId)
    ).sort((a, b) => a.timestamp - b.timestamp);
  },

  sendMessage: async (senderId: string, receiverId: string, text: string): Promise<ChatMessage> => {
    await delay(300);
    const allMessages: ChatMessage[] = JSON.parse(localStorage.getItem(LS_KEYS.CHAT) || '[]');
    const newMessage: ChatMessage = {
        id: `c${Date.now()}`,
        senderId,
        receiverId,
        text,
        timestamp: Date.now(),
        read: false
    };
    allMessages.push(newMessage);
    localStorage.setItem(LS_KEYS.CHAT, JSON.stringify(allMessages));
    return newMessage;
  },

  // --- Forum Services ---
  getPosts: async (): Promise<ForumPost[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(LS_KEYS.FORUM) || '[]').sort((a: ForumPost, b: ForumPost) => b.timestamp - a.timestamp);
  },

  createPost: async (user: User, content: string, isAnonymous: boolean, tags: string[]): Promise<ForumPost> => {
    await delay(300);
    const allPosts: ForumPost[] = JSON.parse(localStorage.getItem(LS_KEYS.FORUM) || '[]');
    const newPost: ForumPost = {
        id: `p${Date.now()}`,
        authorId: isAnonymous ? 'anonymous' : user.id,
        authorName: isAnonymous ? 'Anonymous Student' : user.name,
        content,
        tags,
        likes: 0,
        replies: 0,
        timestamp: Date.now(),
        isAnonymous
    };
    allPosts.unshift(newPost);
    localStorage.setItem(LS_KEYS.FORUM, JSON.stringify(allPosts));
    return newPost;
  }
};