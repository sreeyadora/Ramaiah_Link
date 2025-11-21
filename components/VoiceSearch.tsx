import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';

interface Props {
    onSearch: (query: string) => void;
}

export const VoiceSearch: React.FC<Props> = ({ onSearch }) => {
    const [isListening, setIsListening] = useState(false);
    const [query, setQuery] = useState('');
    const [supported, setSupported] = useState(true);
    let recognition: any = null;

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSupported(false);
        }
    }, []);

    const toggleListen = () => {
        if (!supported) {
            alert("Voice search is not supported in this browser. Try Chrome.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            onSearch(transcript);
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search mentors, jobs, or skills..." 
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-100 border border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <button 
                    type="button"
                    onClick={toggleListen}
                    className={`absolute right-2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-200'}`}
                >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
            </div>
        </form>
    );
};