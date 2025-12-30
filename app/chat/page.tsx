// src/app/chat/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFood } from '@/context/FoodContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const { userProfile, meals } = useFood();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = userProfile?.name?.split(' ')[0] || 'Friend';

  // Get recent meals (last 3 days)
  const recentMeals = meals.filter(meal => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(meal.timestamp) >= threeDaysAgo;
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hai ${firstName}! 👋 I'm Dr. Reza, your personal nutrition advisor. 

I've been looking at your food diary${recentMeals.length > 0 ? ` - I see you've logged ${recentMeals.length} meals recently, bagus!` : '.'} 

How can I help you today? You can ask me about:
• Your eating habits and nutrition
• Meal suggestions based on your goals
• Tips for your health conditions
• Or just chat about food! 🍽️`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-dr-reza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          userProfile,
          recentMeals: recentMeals.map(m => ({
            name: m.name,
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
            timestamp: m.timestamp,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm having trouble responding. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Alamak! I'm having some connection issues. Please try again in a moment. 🙏",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const quickPrompts = [
    "What should I eat for dinner?",
    "How am I doing this week?",
    "Tips for my health goals",
    "Is my diet balanced?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-slate-500 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-200">
          <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-slate-800">Dr. Reza</h1>
          <p className="text-xs text-teal-600">Your AI Nutritionist • Online</p>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-teal-200">
                <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={32} height={32} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white rounded-br-sm'
                  : 'bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-teal-200">
              <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (show only if no messages yet or few messages) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2 text-center">Quick questions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(prompt);
                  inputRef.current?.focus();
                }}
                className="text-xs bg-white border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-6">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Dr. Reza anything..."
            className="flex-1 bg-slate-100 rounded-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

