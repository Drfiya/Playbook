import React, { useState } from 'react';

const AICoach = ({ isVisible, onToggle, currentChapter }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      role: 'coach',
      message: "👋 Hi! I'm your AI Coach. I'm here to help you master the AI Consulting Playbook. Ask me anything about the concepts, exercises, or how to apply what you're learning!"
    }
  ]);

  const coachResponses = {
    greeting: [
      "Great to see you making progress! What would you like to explore today?",
      "Hello! Ready to level up your consulting skills?",
      "Welcome back! What questions can I help you with?"
    ],
    encouragement: [
      "You're doing great! Keep up the momentum.",
      "Excellent progress! Each chapter builds on the last.",
      "Remember: The real learning happens when you apply these concepts with actual clients."
    ],
    tips: [
      "Pro tip: Focus on understanding the 'why' behind each framework, not just memorizing the steps.",
      "Try applying what you learn immediately - even in small ways with current clients.",
      "The most successful consultants are those who adapt these frameworks to their unique style."
    ],
    chapterSpecific: {
      1: "The key to Chapter 1 is understanding that saying 'no' builds more trust than saying 'yes' to everything.",
      2: "In discovery calls, remember: diagnose before you prescribe. Be the doctor, not the drug dealer.",
      3: "Red flags aren't just warnings - they're opportunities to qualify out bad clients before they waste your time.",
      4: "Value-based pricing starts with understanding the client's business impact, not your time investment.",
      5: "Recording your calls is uncomfortable at first, but it's the fastest way to improve your communication.",
      6: "The $20k audit works because it provides immediate value while positioning you as the expert.",
      7: "Technical skills get you in the door, but communication skills keep you in the room.",
      8: "The Chinese Menu technique gives clients control while maintaining your premium positioning.",
      9: "Every 'failed' engagement is tuition for your education. Extract the lesson and move forward.",
      10: "Speed comes from systems. Build your templates and frameworks once, use them forever.",
      11: "Understanding ML fundamentals sets you apart from 90% of 'AI consultants' who only know ChatGPT.",
      12: "Become the calm in your client's storm. They're drowning in AI hype - be their life raft.",
      13: "Introverts can excel at consulting by building systems that attract clients instead of chasing them.",
      14: "Great workshops aren't about information transfer - they're about transformation and engagement."
    }
  };

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = { role: 'user', message };
    let coachReply = '';

    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      coachReply = getRandomResponse(coachResponses.greeting);
    } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      coachReply = "I see you're looking for help. What specific concept or exercise are you struggling with? Remember, confusion is just clarity waiting to happen.";
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('practice')) {
      coachReply = "Great question about exercises! The best approach is to complete them immediately after reading each section. Try to relate each exercise to a real client situation you've faced.";
    } else if (lowerMessage.includes('client') || lowerMessage.includes('discovery')) {
      coachReply = "Client interactions are where theory meets reality. Focus on asking 'why' questions and listening more than you speak. The 80/20 rule applies: they should talk 80% of the time.";
    } else if (lowerMessage.includes('pricing') || lowerMessage.includes('money')) {
      coachReply = "Pricing is about value, not time. Calculate the business impact of your solution, then price at 10-20% of that value. Never compete on price - compete on expertise.";
    } else if (currentChapter && lowerMessage.includes('chapter')) {
      coachReply = coachResponses.chapterSpecific[currentChapter.id] || getRandomResponse(coachResponses.tips);
    } else {
      coachReply = getRandomResponse([...coachResponses.encouragement, ...coachResponses.tips]);
    }

    setConversation([
      ...conversation,
      newUserMessage,
      { role: 'coach', message: coachReply }
    ]);
    setMessage('');
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-navy-700 text-white rounded-full shadow-lg hover:bg-navy-800 transition-all hover:scale-110"
      >
        <i className="fas fa-comments text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-500 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 className="font-semibold">AI Coach</h3>
              <p className="text-xs text-silver-300">Always here to help</p>
            </div>
          </div>
          <button onClick={onToggle} className="text-white/80 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-navy-700 text-white'
                  : 'bg-silver-100 text-navy-800'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-silver-200">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setMessage("What should I focus on in this chapter?")}
            className="text-xs px-3 py-1 bg-silver-100 rounded-full hover:bg-silver-200"
          >
            Chapter Tips
          </button>
          <button
            onClick={() => setMessage("How do I apply this in real life?")}
            className="text-xs px-3 py-1 bg-silver-100 rounded-full hover:bg-silver-200"
          >
            Practical Application
          </button>
          <button
            onClick={() => setMessage("I'm feeling stuck")}
            className="text-xs px-3 py-1 bg-silver-100 rounded-full hover:bg-silver-200"
          >
            Get Unstuck
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-silver-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-silver-300 rounded-lg text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-800"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;