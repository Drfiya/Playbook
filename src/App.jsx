import React, { useState, useEffect } from 'react';
import { chaptersData, getOverallProgress, getTotalPoints } from './data/chapters';
import Dashboard from './components/Dashboard';
import ChapterView from './components/ChapterView';
import ProgressTracker from './components/ProgressTracker';
import AICoach from './components/AICoach';
import Navigation from './components/Navigation';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showCoach, setShowCoach] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    setOverallProgress(getOverallProgress());
    setTotalPoints(getTotalPoints());
  }, [currentView]);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedChapter(null);
  };

  const updateProgress = () => {
    setOverallProgress(getOverallProgress());
    setTotalPoints(getTotalPoints());
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${focusMode ? 'focus-mode' : ''}`}>
      <Navigation 
        currentView={currentView}
        onNavigate={setCurrentView}
        onBack={handleBackToDashboard}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(!focusMode)}
      />

      <div className="flex">
        {!focusMode && (
          <aside className="w-64 bg-white border-r border-silver-200 h-screen sticky top-0 overflow-y-auto">
            <ProgressTracker 
              progress={overallProgress}
              points={totalPoints}
              chapters={chaptersData}
              onChapterSelect={handleChapterSelect}
              currentChapter={selectedChapter}
            />
          </aside>
        )}

        <main className={`flex-1 ${focusMode ? 'max-w-4xl mx-auto' : ''}`}>
          {currentView === 'dashboard' && (
            <Dashboard 
              chapters={chaptersData}
              onChapterSelect={handleChapterSelect}
              progress={overallProgress}
              points={totalPoints}
            />
          )}

          {currentView === 'chapter' && selectedChapter && (
            <ChapterView 
              chapter={selectedChapter}
              onComplete={updateProgress}
              onBack={handleBackToDashboard}
            />
          )}
        </main>
      </div>

      {!focusMode && (
        <AICoach 
          isVisible={showCoach}
          onToggle={() => setShowCoach(!showCoach)}
          currentChapter={selectedChapter}
        />
      )}
    </div>
  );
}

export default App;