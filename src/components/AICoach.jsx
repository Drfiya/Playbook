import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI, buildChatContext, formatConversationHistory } from '../services/aiChatService';
import FormattedMessage from './FormattedMessage';
import { getChapterProgress } from '../data/chapters';

const AICoach = ({ isVisible, onToggle, currentChapter }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: 'coach',
      message: "Hi! I'm your AI Coach. I'm here to help you master the AI Consulting Playbook. Ask me anything about the concepts, exercises, or how to apply what you're learning!"
    }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const newUserMessage = { role: 'user', message: userMessage };

    // Add user message to conversation immediately
    setConversation(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Build context from current chapter and progress
      const progress = currentChapter ? getChapterProgress(currentChapter.id) : null;
      const context = buildChatContext(currentChapter, progress);
      const conversationHistory = formatConversationHistory([...conversation, newUserMessage]);

      // Send to n8n webhook
      const result = await sendMessageToAI({
        message: userMessage,
        context,
        conversationHistory,
      });

      if (result.success) {
        setConversation(prev => [
          ...prev,
          { role: 'coach', message: result.response }
        ]);
      } else {
        // Show error message
        setConversation(prev => [
          ...prev,
          {
            role: 'coach',
            message: "I'm having trouble connecting right now. Please try again in a moment.",
            isError: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setConversation(prev => [
        ...prev,
        {
          role: 'coach',
          message: "Something went wrong. Please try again.",
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (quickMessage) => {
    setMessage(quickMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-navy-700 dark:bg-navy-600 text-white rounded-full shadow-lg hover:bg-navy-800 dark:hover:bg-navy-700 transition-all hover:scale-110 z-50"
        aria-label="Open AI Coach"
      >
        <i className="fas fa-comments text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-500 text-white p-4 rounded-t-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 className="font-semibold">AI Coach</h3>
              <p className="text-xs text-silver-300">
                {isLoading ? 'Thinking...' : 'Always here to help'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close AI Coach"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[350px]">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                  ? 'bg-navy-700 text-white'
                  : msg.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    : 'bg-silver-100 dark:bg-gray-700 text-navy-800 dark:text-gray-100'
                }`}
            >
              <FormattedMessage text={msg.message} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-silver-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-silver-200 dark:border-gray-600 flex-shrink-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => handleQuickAction("What should I focus on in this chapter?")}
            className="text-xs px-3 py-1 bg-silver-100 dark:bg-gray-700 text-navy-700 dark:text-gray-200 rounded-full hover:bg-silver-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Chapter Tips
          </button>
          <button
            onClick={() => handleQuickAction("How do I apply this in real life?")}
            className="text-xs px-3 py-1 bg-silver-100 dark:bg-gray-700 text-navy-700 dark:text-gray-200 rounded-full hover:bg-silver-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Practical Application
          </button>
          <button
            onClick={() => handleQuickAction("I'm feeling stuck, can you help?")}
            className="text-xs px-3 py-1 bg-silver-100 dark:bg-gray-700 text-navy-700 dark:text-gray-200 rounded-full hover:bg-silver-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Get Unstuck
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-silver-200 dark:border-gray-600 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Please wait..." : "Ask me anything..."}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-silver-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-navy-800 dark:text-gray-100 placeholder-silver-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 dark:focus:ring-navy-400 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-navy-700 dark:bg-navy-600 text-white rounded-lg hover:bg-navy-800 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
