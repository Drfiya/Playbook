import React from 'react';

const Navigation = ({ currentView, onNavigate, onBack, focusMode, onToggleFocus }) => {
  return (
    <header className="bg-navy-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <i className="fas fa-book text-2xl"></i>
              <h1 className="text-xl font-bold">AI Consulting Playbook</h1>
            </div>

            {currentView === 'chapter' && (
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 text-silver-300 hover:text-white transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleFocus}
              className="px-3 py-1 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors flex items-center space-x-2"
              title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              <i className={`fas ${focusMode ? 'fa-expand' : 'fa-compress'}`}></i>
              <span className="text-sm">{focusMode ? 'Exit' : ''} Focus Mode</span>
            </button>

            <button className="px-3 py-1 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
              <i className="fas fa-download mr-2"></i>
              Export Progress
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;