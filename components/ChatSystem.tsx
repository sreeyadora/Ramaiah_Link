import React, { useState, useEffect, useRef } from 'react';
import { backend } from '../services/mockBackend';
import { User, ChatMessage } from '../types';
import { Send, User as UserIcon, Circle } from 'lucide-react';

interface Props {
    currentUser: User;
}

export const ChatSystem: React.FC<Props> = ({ currentUser }) => {
    const [contacts, setContacts] = useState<User[]>([]);
    const [activeContact, setActiveContact] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            const users = await backend.getUsers();
            // Filter out current user from contacts
            setContacts(users.filter(u => u.id !== currentUser.id));
        };
        loadData();
    }, [currentUser]);

    useEffect(() => {
        let interval: any;
        if (activeContact) {
            const fetchMessages = async () => {
                const msgs = await backend.getMessages(currentUser.id, activeContact.id);
                setMessages(msgs);
            };
            fetchMessages();
            // Poll for "real-time" updates
            interval = setInterval(fetchMessages, 2000);
        }
        return () => clearInterval(interval);
    }, [activeContact, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !activeContact) return;
        await backend.sendMessage(currentUser.id, activeContact.id, inputText);
        const msgs = await backend.getMessages(currentUser.id, activeContact.id);
        setMessages(msgs);
        setInputText('');
    };

    return (
        <div className="flex h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar Contacts */}
            <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-700">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition hover:bg-slate-100 ${activeContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                        >
                            <div className="relative">
                                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-medium text-slate-800 truncate">{contact.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{contact.role} • {contact.department}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeContact ? (
                    <>
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                            <img src={activeContact.avatar} alt={activeContact.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <h3 className="font-bold text-slate-800">{activeContact.name}</h3>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <Circle className="w-2 h-2 fill-current" /> Online
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {messages.map(msg => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <UserIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <p>Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};