import React from 'react';
import { getChapterProgress } from '../data/chapters';

const Dashboard = ({ chapters, onChapterSelect, progress, points }) => {
  const getBadgeInfo = (points) => {
    if (points >= 2000) return { name: 'Master Consultant', icon: 'fa-crown', color: 'text-yellow-500' };
    if (points >= 1000) return { name: 'Senior Consultant', icon: 'fa-medal', color: 'text-purple-500' };
    if (points >= 500) return { name: 'Rising Star', icon: 'fa-star', color: 'text-blue-500' };
    return { name: 'Apprentice', icon: 'fa-user-graduate', color: 'text-green-500' };
  };

  const badge = getBadgeInfo(points);

  return (
    <div className="p-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-600 rounded-2xl p-8 text-white mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-silver-200 mb-6">
              Continue your journey to becoming an elite AI consultant. Master the frameworks, 
              techniques, and strategies that separate the professionals from the amateurs.
            </p>
            <button 
              onClick={() => {
                const nextChapter = chapters.find(ch => !getChapterProgress(ch.id).completed);
                if (nextChapter) onChapterSelect(nextChapter);
              }}
              className="bg-white text-navy-800 px-6 py-3 rounded-lg font-semibold hover:bg-silver-100 transition-colors"
            >
              Continue Learning <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="bg-navy-900/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-silver-300">Overall Progress</span>
                <span className="text-2xl font-bold">{progress}%</span>
              </div>
              <div className="progress-bar mb-6">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`fas ${badge.icon} text-2xl ${badge.color}`}></i>
                  <div>
                    <div className="text-sm text-silver-300">Current Rank</div>
                    <div className="font-semibold">{badge.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-silver-300">Total Points</div>
                  <div className="text-2xl font-bold">{points}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-silver-600 text-sm mb-1">Chapters Completed</p>
              <p className="text-2xl font-bold text-navy-800">
                {chapters.filter(ch => getChapterProgress(ch.id).completed).length} / {chapters.length}
              </p>
            </div>
            <i className="fas fa-book-open text-3xl text-navy-600"></i>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-silver-600 text-sm mb-1">Learning Streak</p>
              <p className="text-2xl font-bold text-navy-800">7 days</p>
            </div>
            <i className="fas fa-fire text-3xl text-orange-500"></i>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-silver-600 text-sm mb-1">Exercises Done</p>
              <p className="text-2xl font-bold text-navy-800">12</p>
            </div>
            <i className="fas fa-tasks text-3xl text-green-500"></i>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-silver-600 text-sm mb-1">Time Invested</p>
              <p className="text-2xl font-bold text-navy-800">8.5h</p>
            </div>
            <i className="fas fa-clock text-3xl text-purple-500"></i>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <h3 className="text-2xl font-bold text-navy-800 mb-6">Your Learning Modules</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map(chapter => {
          const chapterProgress = getChapterProgress(chapter.id);
          const isCompleted = chapterProgress.completed;
          const isUnlocked = chapter.id === 1 || getChapterProgress(chapter.id - 1).completed;

          return (
            <div
              key={chapter.id}
              onClick={() => isUnlocked && onChapterSelect(chapter)}
              className={`card relative overflow-hidden cursor-pointer transform transition-all duration-200 ${
                isUnlocked ? 'hover:scale-105 hover:shadow-lg' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-silver-900/10 flex items-center justify-center z-10">
                  <i className="fas fa-lock text-3xl text-silver-600"></i>
                </div>
              )}

              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${chapter.color}`}></div>
              
              <div className="flex items-start justify-between mb-4 pt-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${chapter.color} flex items-center justify-center text-white`}>
                    <i className={`fas ${chapter.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-silver-500 text-sm">Chapter {chapter.number}</span>
                    <h4 className="font-semibold text-navy-800">{chapter.title}</h4>
                  </div>
                </div>
                {isCompleted && (
                  <i className="fas fa-check-circle text-green-500 text-xl"></i>
                )}
              </div>

              <p className="text-silver-600 text-sm mb-4 line-clamp-2">{chapter.subtitle}</p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-silver-500">
                  <i className="fas fa-clock mr-1"></i>
                  {chapter.duration}
                </span>
                <span className="text-silver-500">
                  {chapter.exercises?.length || 0} exercises
                </span>
              </div>

              {chapterProgress.sectionsRead?.length > 0 && !isCompleted && (
                <div className="mt-4">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(chapterProgress.sectionsRead.length / chapter.sections.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-navy-800 mb-6">Recent Activity</h3>
        <div className="card">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b border-silver-200">
              <i className="fas fa-trophy text-yellow-500"></i>
              <div className="flex-1">
                <p className="font-semibold">Completed "The Art of the Discovery Call"</p>
                <p className="text-sm text-silver-600">2 hours ago</p>
              </div>
              <span className="text-green-500 font-semibold">+150 pts</span>
            </div>
            <div className="flex items-center space-x-4 pb-4 border-b border-silver-200">
              <i className="fas fa-check-circle text-green-500"></i>
              <div className="flex-1">
                <p className="font-semibold">Finished Client Readiness Exercise</p>
                <p className="text-sm text-silver-600">Yesterday</p>
              </div>
              <span className="text-green-500 font-semibold">+100 pts</span>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-book text-blue-500"></i>
              <div className="flex-1">
                <p className="font-semibold">Started Chapter 3: Reading the Room</p>
                <p className="text-sm text-silver-600">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;