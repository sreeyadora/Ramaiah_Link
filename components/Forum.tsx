import React, { useState, useEffect } from 'react';
import { backend } from '../services/mockBackend';
import { User, ForumPost } from '../types';
import { MessageCircle, Heart, Tag, Shield } from 'lucide-react';

interface Props {
    currentUser: User;
}

export const Forum: React.FC<Props> = ({ currentUser }) => {
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [newContent, setNewContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadPosts = async () => {
        const data = await backend.getPosts();
        setPosts(data);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handlePost = async () => {
        if (!newContent.trim()) return;
        setLoading(true);
        await backend.createPost(currentUser, newContent, isAnonymous, ['General']);
        setNewContent('');
        await loadPosts();
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" /> Safe Student Forum
                </h2>
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Ask anything... (Select 'Post Anonymously' to hide your identity)"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                />
                <div className="flex justify-between items-center mt-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                        Post Anonymously
                    </label>
                    <button 
                        onClick={handlePost}
                        disabled={loading || !newContent}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Post Question'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${post.isAnonymous ? 'bg-slate-400' : 'bg-blue-600'}`}>
                                    {post.authorName[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{post.authorName}</h4>
                                    <p className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {post.isAnonymous && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Anonymous</span>}
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition">
                                <Heart className="w-4 h-4" /> {post.likes} Likes
                            </button>
                            <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 transition">
                                <MessageCircle className="w-4 h-4" /> {post.replies} Replies
                            </button>
                            <div className="flex gap-2 ml-auto">
                                {post.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                        <Tag className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};