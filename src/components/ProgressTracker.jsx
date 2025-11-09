import React from 'react';
import { getChapterProgress } from '../data/chapters';

const ProgressTracker = ({ progress, points, chapters, onChapterSelect, currentChapter }) => {
  return (
    <div className="p-6">
      {/* Progress Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-navy-800 mb-4">Your Progress</h3>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-silver-600 mb-2">
            <span>Overall</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-silver-50 rounded-lg p-3">
            <p className="text-xs text-silver-600 mb-1">Points</p>
            <p className="text-lg font-bold text-navy-800">{points}</p>
          </div>
          <div className="bg-silver-50 rounded-lg p-3">
            <p className="text-xs text-silver-600 mb-1">Chapters</p>
            <p className="text-lg font-bold text-navy-800">
              {chapters.filter(ch => getChapterProgress(ch.id).completed).length}/{chapters.length}
            </p>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div>
        <h3 className="text-lg font-bold text-navy-800 mb-4">Chapters</h3>
        <div className="space-y-2">
          {chapters.map(chapter => {
            const chapterProgress = getChapterProgress(chapter.id);
            const isCompleted = chapterProgress.completed;
            const isActive = currentChapter?.id === chapter.id;
            const isUnlocked = chapter.id === 1 || getChapterProgress(chapter.id - 1).completed;

            return (
              <button
                key={chapter.id}
                onClick={() => isUnlocked && onChapterSelect(chapter)}
                disabled={!isUnlocked}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-navy-700 text-white' 
                    : isUnlocked 
                    ? 'hover:bg-silver-100' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive
                      ? 'bg-white text-navy-700'
                      : 'bg-silver-200 text-silver-600'
                  }`}>
                    {isCompleted ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      chapter.number
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      isActive ? 'text-white' : 'text-navy-800'
                    }`}>
                      {chapter.title}
                    </p>
                    {chapterProgress.sectionsRead?.length > 0 && !isCompleted && (
                      <p className={`text-xs ${isActive ? 'text-silver-300' : 'text-silver-600'}`}>
                        {chapterProgress.sectionsRead.length}/{chapter.sections.length} sections
                      </p>
                    )}
                  </div>
                  {!isUnlocked && (
                    <i className="fas fa-lock text-silver-400"></i>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-navy-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              points >= 100 ? 'bg-yellow-500 text-white' : 'bg-silver-200 text-silver-400'
            }`}>
              <i className="fas fa-star"></i>
            </div>
            <p className="text-xs mt-1">First Steps</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              points >= 500 ? 'bg-purple-500 text-white' : 'bg-silver-200 text-silver-400'
            }`}>
              <i className="fas fa-rocket"></i>
            </div>
            <p className="text-xs mt-1">Rising Star</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
              points >= 1000 ? 'bg-navy-700 text-white' : 'bg-silver-200 text-silver-400'
            }`}>
              <i className="fas fa-crown"></i>
            </div>
            <p className="text-xs mt-1">Expert</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;