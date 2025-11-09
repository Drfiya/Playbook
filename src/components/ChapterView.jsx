import React, { useState, useEffect } from 'react';
import { getChapterProgress, updateChapterProgress } from '../data/chapters';
import fullChapterContent from '../data/fullChapters';
import ChapterContent from './ChapterContent';

const ChapterView = ({ chapter, onComplete, onBack }) => {
  const [progress, setProgress] = useState(getChapterProgress(chapter.id));
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notes, setNotes] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem(`chapter_${chapter.id}_notes`);
    if (savedNotes) setNotes(savedNotes);
  }, [chapter.id]);

  const markSectionRead = (sectionIndex) => {
    const sectionTitle = chapter.sections[sectionIndex].title;
    if (!progress.sectionsRead.includes(sectionTitle)) {
      const newProgress = {
        ...progress,
        sectionsRead: [...progress.sectionsRead, sectionTitle]
      };
      setProgress(newProgress);
      updateChapterProgress(chapter.id, newProgress);

      // Check if all sections are read
      if (newProgress.sectionsRead.length === chapter.sections.length) {
        if (!showQuiz && chapter.quiz) {
          setShowQuiz(true);
        }
      }
    }
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    chapter.quiz?.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) correct++;
    });

    const score = Math.round((correct / chapter.quiz.length) * 100);
    const newProgress = {
      ...progress,
      quizScore: score
    };
    setProgress(newProgress);
    updateChapterProgress(chapter.id, newProgress);
    setShowResults(true);
  };

  const handleCompleteChapter = () => {
    const newProgress = {
      ...progress,
      completed: true
    };
    setProgress(newProgress);
    updateChapterProgress(chapter.id, newProgress);
    onComplete();
  };

  const completeExercise = (exerciseTitle) => {
    const newProgress = {
      ...progress,
      exercisesCompleted: [...(progress.exercisesCompleted || []), exerciseTitle]
    };
    setProgress(newProgress);
    updateChapterProgress(chapter.id, newProgress);
    setShowExercise(false);
    setSelectedExercise(null);
  };

  const saveNotes = () => {
    localStorage.setItem(`chapter_${chapter.id}_notes`, notes);
  };

  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setHighlightedText(selection.toString());
      // Simulate showing context or definition
      setTimeout(() => setHighlightedText(''), 3000);
    }
  };

  if (showQuiz) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">
            <i className="fas fa-brain mr-3"></i>
            Chapter {chapter.number} Quiz
          </h2>

          {!showResults ? (
            <>
              {chapter.quiz?.map((question, index) => (
                <div key={index} className="mb-6 p-4 bg-silver-50 rounded-lg">
                  <p className="font-semibold mb-3">{index + 1}. {question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optIndex}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [index]: optIndex })}
                          className="text-navy-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== chapter.quiz?.length}
                className="btn-primary w-full"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <i className={`fas ${progress.quizScore >= 80 ? 'fa-trophy text-yellow-500' : 'fa-redo text-blue-500'} text-5xl mb-4`}></i>
              <h3 className="text-2xl font-bold mb-2">
                {progress.quizScore >= 80 ? 'Excellent Work!' : 'Keep Learning!'}
              </h3>
              <p className="text-lg mb-6">Your Score: {progress.quizScore}%</p>
              
              {chapter.quiz?.map((question, index) => (
                <div key={index} className="mb-4 p-4 bg-silver-50 rounded-lg text-left">
                  <p className="font-semibold">{question.question}</p>
                  <p className={quizAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}>
                    Your answer: {question.options[quizAnswers[index]]}
                  </p>
                  {quizAnswers[index] !== question.correct && (
                    <p className="text-sm text-silver-600 mt-1">{question.explanation}</p>
                  )}
                </div>
              ))}

              <button onClick={() => setShowQuiz(false)} className="btn-secondary">
                Back to Chapter
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showExercise && selectedExercise) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">
            <i className="fas fa-pencil-alt mr-3"></i>
            {selectedExercise.title}
          </h2>
          
          <div className="mb-6">
            <p className="text-silver-600 mb-4">{selectedExercise.description}</p>
            
            <div className="bg-silver-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-silver-600 mb-2">Exercise Type: {selectedExercise.type}</p>
              <p className="text-sm text-silver-600">Points: {selectedExercise.points}</p>
            </div>

            {selectedExercise.type === 'writing' && (
              <textarea
                className="w-full h-48 p-4 border border-silver-300 rounded-lg"
                placeholder="Write your response here..."
              ></textarea>
            )}

            {selectedExercise.type === 'assessment' && (
              <div className="space-y-4">
                <div className="p-4 bg-white border border-silver-200 rounded-lg">
                  <h4 className="font-semibold mb-2">Fictional Client: TechCorp Solutions</h4>
                  <p className="text-sm text-silver-600">
                    - Processes: Some documented, mostly ad-hoc
                    <br />- Data: Siloed across 5 systems
                    <br />- Buy-in: CTO interested, CEO skeptical
                    <br />- Systems: Basic Zapier automations
                  </p>
                </div>
                <select className="w-full p-3 border border-silver-300 rounded-lg">
                  <option>Select your recommendation...</option>
                  <option>Tier 1: Ready for Implementation</option>
                  <option>Tier 2: Needs Preparation</option>
                  <option>Tier 3: Requires Education</option>
                </select>
              </div>
            )}

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => completeExercise(selectedExercise.title)}
                className="btn-primary flex-1"
              >
                Complete Exercise
              </button>
              <button
                onClick={() => {
                  setShowExercise(false);
                  setSelectedExercise(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" onMouseUp={handleTextHighlight}>
      <div className="max-w-4xl mx-auto">
        {/* Chapter Header */}
        <div className={`bg-gradient-to-r ${chapter.color} rounded-2xl p-8 text-white mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-silver-200">Chapter {chapter.number}</span>
            <span className="text-silver-200">
              <i className="fas fa-clock mr-2"></i>
              {chapter.duration}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">{chapter.title}</h1>
          <p className="text-xl text-silver-200">{chapter.subtitle}</p>
        </div>

        {/* Key Takeaways */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-navy-800 mb-4">
            <i className="fas fa-key mr-2"></i>
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {chapter.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Overview */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-navy-800 mb-4">Overview</h3>
          <p className="text-silver-700 leading-relaxed">{chapter.overview}</p>
        </div>

        {/* Sections */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-navy-800 mb-6">Chapter Content</h3>
          
          {/* Section Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {chapter.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSection(index);
                  markSectionRead(index);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentSection === index
                    ? 'bg-navy-700 text-white'
                    : progress.sectionsRead.includes(section.title)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-silver-100 text-silver-700 hover:bg-silver-200'
                }`}
              >
                {section.title}
                {progress.sectionsRead.includes(section.title) && (
                  <i className="fas fa-check ml-2"></i>
                )}
              </button>
            ))}
          </div>

          {/* Current Section Content */}
          <div className="bg-white rounded-lg p-8 border border-silver-200">
            {fullChapterContent[chapter.id] && fullChapterContent[chapter.id].sections[currentSection] ? (
              <>
                <h4 className="text-2xl font-bold text-navy-800 mb-6 pb-4 border-b-2 border-navy-200">
                  {fullChapterContent[chapter.id].sections[currentSection].title}
                </h4>
                <ChapterContent content={fullChapterContent[chapter.id].sections[currentSection].content} />
              </>
            ) : (
              <>
                <h4 className="text-lg font-bold text-navy-800 mb-3">
                  {chapter.sections[currentSection].title}
                </h4>
                <p className="text-silver-700 leading-relaxed">
                  {chapter.sections[currentSection].content}
                </p>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                if (currentSection > 0) {
                  setCurrentSection(currentSection - 1);
                  markSectionRead(currentSection - 1);
                }
              }}
              disabled={currentSection === 0}
              className="btn-secondary disabled:opacity-50"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous
            </button>
            <button
              onClick={() => {
                if (currentSection < chapter.sections.length - 1) {
                  setCurrentSection(currentSection + 1);
                  markSectionRead(currentSection + 1);
                }
              }}
              disabled={currentSection === chapter.sections.length - 1}
              className="btn-primary disabled:opacity-50"
            >
              Next
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>

        {/* Exercises */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-navy-800 mb-6">
              <i className="fas fa-tasks mr-2"></i>
              Exercises
            </h3>
            <div className="grid gap-4">
              {chapter.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    progress.exercisesCompleted?.includes(exercise.title)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-silver-200 hover:border-navy-300'
                  }`}
                  onClick={() => {
                    if (!progress.exercisesCompleted?.includes(exercise.title)) {
                      setSelectedExercise(exercise);
                      setShowExercise(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-navy-800">{exercise.title}</h4>
                      <p className="text-sm text-silver-600">{exercise.description}</p>
                    </div>
                    <div className="text-right">
                      {progress.exercisesCompleted?.includes(exercise.title) ? (
                        <i className="fas fa-check-circle text-green-500 text-2xl"></i>
                      ) : (
                        <span className="text-navy-600 font-semibold">+{exercise.points} pts</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-navy-800 mb-4">
            <i className="fas fa-sticky-note mr-2"></i>
            Your Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            className="w-full h-32 p-4 border border-silver-300 rounded-lg"
            placeholder="Take notes here..."
          ></textarea>
        </div>

        {/* Reflection */}
        {chapter.reflection && (
          <div className="card mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              <i className="fas fa-lightbulb mr-2"></i>
              Reflection
            </h3>
            <p className="text-purple-700">{chapter.reflection}</p>
          </div>
        )}

        {/* Completion Progress */}
        <div className="card mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            <i className="fas fa-tasks mr-2"></i>
            Chapter Progress
          </h3>
          
          <div className="space-y-3">
            {/* Sections Progress */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center">
                <i className={`fas fa-book-open mr-3 ${
                  progress.sectionsRead.length === chapter.sections.length ? 'text-green-500' : 'text-silver-400'
                }`}></i>
                <span className="font-medium">Read All Sections</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-silver-600 mr-3">
                  {progress.sectionsRead.length}/{chapter.sections.length}
                </span>
                {progress.sectionsRead.length === chapter.sections.length ? (
                  <i className="fas fa-check-circle text-green-500"></i>
                ) : (
                  <i className="fas fa-circle text-silver-300"></i>
                )}
              </div>
            </div>

            {/* Exercises Progress */}
            {chapter.exercises && chapter.exercises.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  <i className={`fas fa-pencil-alt mr-3 ${
                    (progress.exercisesCompleted?.length || 0) >= 1 ? 'text-green-500' : 'text-silver-400'
                  }`}></i>
                  <span className="font-medium">Complete Exercises</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-silver-600 mr-3">
                    {progress.exercisesCompleted?.length || 0}/{chapter.exercises.length}
                  </span>
                  {(progress.exercisesCompleted?.length || 0) >= 1 ? (
                    <i className="fas fa-check-circle text-green-500"></i>
                  ) : (
                    <i className="fas fa-circle text-silver-300"></i>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Progress */}
            {chapter.quiz && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  <i className={`fas fa-brain mr-3 ${
                    progress.quizScore >= 80 ? 'text-green-500' : 'text-silver-400'
                  }`}></i>
                  <span className="font-medium">Pass Quiz (80% or higher)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-silver-600 mr-3">
                    {progress.quizScore > 0 ? `${progress.quizScore}%` : 'Not taken'}
                  </span>
                  {progress.quizScore >= 80 ? (
                    <i className="fas fa-check-circle text-green-500"></i>
                  ) : (
                    <i className="fas fa-circle text-silver-300"></i>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {chapter.quiz && progress.sectionsRead.length === chapter.sections.length && !progress.completed && (
            <button onClick={() => setShowQuiz(true)} className="btn-primary flex-1">
              <i className="fas fa-brain mr-2"></i>
              {progress.quizScore > 0 ? `Retake Quiz (${progress.quizScore}%)` : 'Take Quiz'}
            </button>
          )}
          
          {!progress.completed && progress.sectionsRead.length === chapter.sections.length && (
            <button onClick={handleCompleteChapter} className="btn-primary flex-1">
              <i className="fas fa-flag-checkered mr-2"></i>
              Mark Chapter Complete
            </button>
          )}
          
          {progress.completed && (
            <div className="flex-1 text-center p-4 bg-green-100 rounded-lg text-green-700 font-semibold">
              <i className="fas fa-trophy mr-2"></i>
              Chapter Completed! 🎉
            </div>
          )}
          
          <button onClick={onBack} className="btn-secondary">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Highlighted Text Tooltip */}
      {highlightedText && (
        <div className="fixed bottom-4 right-4 bg-navy-800 text-white p-4 rounded-lg max-w-md shadow-xl">
          <p className="text-sm mb-2">Selected text:</p>
          <p className="italic">"{highlightedText.substring(0, 100)}..."</p>
          <p className="text-xs mt-2 text-silver-300">
            <i className="fas fa-info-circle mr-1"></i>
            Context and related concepts would appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterView;