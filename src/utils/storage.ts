// Local storage utilities for progress tracking and user data persistence

export interface UserProgress {
  userId: string;
  userName: string;
  startedAt: string;
  lastActiveAt: string;
  chaptersProgress: ChapterProgress[];
  exercisesCompleted: CompletedExercise[];
  quizResults: QuizResult[];
  notes: UserNote[];
  bookmarks: Bookmark[];
  achievements: Achievement[];
  totalTimeSpent: number; // in minutes
}

export interface ChapterProgress {
  chapterId: string;
  chapterNumber: number;
  status: 'not-started' | 'in-progress' | 'completed';
  percentComplete: number;
  sectionsRead: string[];
  startedAt?: string;
  completedAt?: string;
  timeSpent: number; // in minutes
}

export interface CompletedExercise {
  exerciseId: string;
  chapterId: string;
  completedAt: string;
  response: string;
  timeSpent: number;
  feedback?: string;
}

export interface QuizResult {
  quizId: string;
  chapterId: string;
  attemptedAt: string;
  score: number;
  totalQuestions: number;
  answers: QuizAnswer[];
  timeSpent: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface UserNote {
  id: string;
  chapterId: string;
  sectionId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Bookmark {
  id: string;
  chapterId: string;
  sectionId?: string;
  title: string;
  createdAt: string;
  position?: number;
}

export interface Achievement {
  id: string;
  type: 'chapter-complete' | 'exercise-streak' | 'quiz-perfect' | 'fast-learner' | 'deep-diver' | 'note-taker' | 'consistent-learner';
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'ai_playbook_progress',
  USER_PREFERENCES: 'ai_playbook_preferences',
  CURRENT_USER: 'ai_playbook_current_user',
  COMPLETED_INTRO: 'ai_playbook_intro_complete'
};

// Initialize user progress
export const initializeUserProgress = (userName: string): UserProgress => {
  const userId = generateUserId();
  const now = new Date().toISOString();
  
  const initialProgress: UserProgress = {
    userId,
    userName,
    startedAt: now,
    lastActiveAt: now,
    chaptersProgress: Array.from({ length: 14 }, (_, i) => ({
      chapterId: `chapter-${i + 1}`,
      chapterNumber: i + 1,
      status: 'not-started',
      percentComplete: 0,
      sectionsRead: [],
      timeSpent: 0
    })),
    exercisesCompleted: [],
    quizResults: [],
    notes: [],
    bookmarks: [],
    achievements: [],
    totalTimeSpent: 0
  };
  
  saveUserProgress(initialProgress);
  setCurrentUser(userId);
  
  return initialProgress;
};

// Save user progress to local storage
export const saveUserProgress = (progress: UserProgress): void => {
  try {
    progress.lastActiveAt = new Date().toISOString();
    const serialized = JSON.stringify(progress);
    localStorage.setItem(`${STORAGE_KEYS.USER_PROGRESS}_${progress.userId}`, serialized);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Load user progress from local storage
export const loadUserProgress = (userId?: string): UserProgress | null => {
  try {
    const id = userId || getCurrentUserId();
    if (!id) return null;
    
    const serialized = localStorage.getItem(`${STORAGE_KEYS.USER_PROGRESS}_${id}`);
    if (!serialized) return null;
    
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
};

// Update chapter progress
export const updateChapterProgress = (
  userId: string,
  chapterId: string,
  updates: Partial<ChapterProgress>
): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  const chapterIndex = progress.chaptersProgress.findIndex(cp => cp.chapterId === chapterId);
  if (chapterIndex === -1) return;
  
  progress.chaptersProgress[chapterIndex] = {
    ...progress.chaptersProgress[chapterIndex],
    ...updates
  };
  
  // Check if chapter is completed
  if (updates.percentComplete === 100) {
    progress.chaptersProgress[chapterIndex].status = 'completed';
    progress.chaptersProgress[chapterIndex].completedAt = new Date().toISOString();
    
    // Check for achievements
    checkForAchievements(progress, 'chapter-complete', chapterId);
  } else if (updates.percentComplete && updates.percentComplete > 0) {
    progress.chaptersProgress[chapterIndex].status = 'in-progress';
  }
  
  saveUserProgress(progress);
};

// Add completed exercise
export const addCompletedExercise = (
  userId: string,
  exercise: Omit<CompletedExercise, 'completedAt'>
): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  const completed: CompletedExercise = {
    ...exercise,
    completedAt: new Date().toISOString()
  };
  
  progress.exercisesCompleted.push(completed);
  
  // Check for achievements
  checkForAchievements(progress, 'exercise-streak');
  
  saveUserProgress(progress);
};

// Add quiz result
export const addQuizResult = (
  userId: string,
  result: Omit<QuizResult, 'attemptedAt'>
): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  const quizResult: QuizResult = {
    ...result,
    attemptedAt: new Date().toISOString()
  };
  
  progress.quizResults.push(quizResult);
  
  // Check for perfect score achievement
  if (result.score === result.totalQuestions) {
    checkForAchievements(progress, 'quiz-perfect');
  }
  
  saveUserProgress(progress);
};

// Add or update note
export const saveUserNote = (userId: string, note: Omit<UserNote, 'id' | 'updatedAt'>): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  const existingIndex = progress.notes.findIndex(
    n => n.chapterId === note.chapterId && n.sectionId === note.sectionId
  );
  
  if (existingIndex >= 0) {
    // Update existing note
    progress.notes[existingIndex] = {
      ...progress.notes[existingIndex],
      ...note,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new note
    const newNote: UserNote = {
      ...note,
      id: generateId(),
      updatedAt: new Date().toISOString()
    };
    progress.notes.push(newNote);
  }
  
  checkForAchievements(progress, 'note-taker');
  saveUserProgress(progress);
};

// Add bookmark
export const addBookmark = (userId: string, bookmark: Omit<Bookmark, 'id' | 'createdAt'>): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  const newBookmark: Bookmark = {
    ...bookmark,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  progress.bookmarks.push(newBookmark);
  saveUserProgress(progress);
};

// Remove bookmark
export const removeBookmark = (userId: string, bookmarkId: string): void => {
  const progress = loadUserProgress(userId);
  if (!progress) return;
  
  progress.bookmarks = progress.bookmarks.filter(b => b.id !== bookmarkId);
  saveUserProgress(progress);
};

// Check for and award achievements
const checkForAchievements = (
  progress: UserProgress,
  achievementType: Achievement['type'],
  context?: string
): void => {
  const achievements = progress.achievements;
  const now = new Date().toISOString();
  
  switch (achievementType) {
    case 'chapter-complete':
      const completedCount = progress.chaptersProgress.filter(cp => cp.status === 'completed').length;
      
      if (completedCount === 1 && !hasAchievement(achievements, 'first-chapter')) {
        progress.achievements.push({
          id: 'first-chapter',
          type: 'chapter-complete',
          title: 'First Steps',
          description: 'Completed your first chapter',
          earnedAt: now,
          icon: '🎯',
          rarity: 'common'
        });
      }
      
      if (completedCount === 7 && !hasAchievement(achievements, 'halfway')) {
        progress.achievements.push({
          id: 'halfway',
          type: 'chapter-complete',
          title: 'Halfway There',
          description: 'Completed half of all chapters',
          earnedAt: now,
          icon: '🌟',
          rarity: 'rare'
        });
      }
      
      if (completedCount === 14 && !hasAchievement(achievements, 'master')) {
        progress.achievements.push({
          id: 'master',
          type: 'chapter-complete',
          title: 'AI Consulting Master',
          description: 'Completed all 14 chapters',
          earnedAt: now,
          icon: '👑',
          rarity: 'legendary'
        });
      }
      break;
      
    case 'exercise-streak':
      const recentExercises = progress.exercisesCompleted.filter(e => {
        const daysAgo = (Date.now() - new Date(e.completedAt).getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7;
      });
      
      if (recentExercises.length >= 5 && !hasAchievement(achievements, 'practice-makes-perfect')) {
        progress.achievements.push({
          id: 'practice-makes-perfect',
          type: 'exercise-streak',
          title: 'Practice Makes Perfect',
          description: 'Completed 5 exercises in a week',
          earnedAt: now,
          icon: '💪',
          rarity: 'rare'
        });
      }
      break;
      
    case 'quiz-perfect':
      const perfectScores = progress.quizResults.filter(r => r.score === r.totalQuestions).length;
      
      if (perfectScores === 1 && !hasAchievement(achievements, 'perfect-score')) {
        progress.achievements.push({
          id: 'perfect-score',
          type: 'quiz-perfect',
          title: 'Perfect Score',
          description: 'Achieved 100% on a quiz',
          earnedAt: now,
          icon: '💯',
          rarity: 'common'
        });
      }
      
      if (perfectScores >= 10 && !hasAchievement(achievements, 'quiz-master')) {
        progress.achievements.push({
          id: 'quiz-master',
          type: 'quiz-perfect',
          title: 'Quiz Master',
          description: '10 perfect quiz scores',
          earnedAt: now,
          icon: '🏆',
          rarity: 'epic'
        });
      }
      break;
      
    case 'note-taker':
      if (progress.notes.length >= 20 && !hasAchievement(achievements, 'avid-note-taker')) {
        progress.achievements.push({
          id: 'avid-note-taker',
          type: 'note-taker',
          title: 'Avid Note Taker',
          description: 'Created 20 or more notes',
          earnedAt: now,
          icon: '📝',
          rarity: 'rare'
        });
      }
      break;
  }
};

// Utility functions
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const hasAchievement = (achievements: Achievement[], achievementId: string): boolean => {
  return achievements.some(a => a.id === achievementId);
};

// Current user management
export const setCurrentUser = (userId: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

export const getCurrentUserId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

// Export progress to JSON
export const exportProgress = (userId: string): string | null => {
  const progress = loadUserProgress(userId);
  if (!progress) return null;
  
  return JSON.stringify(progress, null, 2);
};

// Import progress from JSON
export const importProgress = (jsonData: string): boolean => {
  try {
    const progress = JSON.parse(jsonData) as UserProgress;
    saveUserProgress(progress);
    setCurrentUser(progress.userId);
    return true;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return false;
  }
};

// Calculate overall progress
export const calculateOverallProgress = (progress: UserProgress): number => {
  const completedChapters = progress.chaptersProgress.filter(cp => cp.status === 'completed').length;
  return Math.round((completedChapters / 14) * 100);
};

// Get learning insights
export const getLearningInsights = (progress: UserProgress): {
  totalTimeSpent: number;
  averageChapterTime: number;
  strongestChapter: string | null;
  exercisesCompleted: number;
  averageQuizScore: number;
  currentStreak: number;
} => {
  const totalTime = progress.chaptersProgress.reduce((sum, cp) => sum + cp.timeSpent, 0);
  const completedChapters = progress.chaptersProgress.filter(cp => cp.status === 'completed');
  const avgChapterTime = completedChapters.length > 0 ? totalTime / completedChapters.length : 0;
  
  // Find strongest chapter based on quiz scores
  const chapterScores = new Map<string, { total: number; count: number }>();
  progress.quizResults.forEach(result => {
    const current = chapterScores.get(result.chapterId) || { total: 0, count: 0 };
    chapterScores.set(result.chapterId, {
      total: current.total + (result.score / result.totalQuestions) * 100,
      count: current.count + 1
    });
  });
  
  let strongestChapter: string | null = null;
  let highestAvg = 0;
  chapterScores.forEach((scores, chapterId) => {
    const avg = scores.total / scores.count;
    if (avg > highestAvg) {
      highestAvg = avg;
      strongestChapter = chapterId;
    }
  });
  
  // Calculate average quiz score
  const avgQuizScore = progress.quizResults.length > 0
    ? progress.quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / progress.quizResults.length
    : 0;
  
  // Calculate current learning streak
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const hasActivity = progress.chaptersProgress.some(cp => 
      cp.startedAt && cp.startedAt.startsWith(dateStr)
    ) || progress.exercisesCompleted.some(e => 
      e.completedAt.startsWith(dateStr)
    ) || progress.quizResults.some(q => 
      q.attemptedAt.startsWith(dateStr)
    );
    
    if (hasActivity) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return {
    totalTimeSpent: totalTime,
    averageChapterTime: avgChapterTime,
    strongestChapter,
    exercisesCompleted: progress.exercisesCompleted.length,
    averageQuizScore: avgQuizScore,
    currentStreak: streak
  };
};

// Preferences management
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  readingSpeed: 'slow' | 'normal' | 'fast';
  notifications: boolean;
  autoSave: boolean;
  focusMode: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  readingSpeed: 'normal',
  notifications: true,
  autoSave: true,
  focusMode: false
};

export const savePreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

export const loadPreferences = (): UserPreferences => {
  const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return saved ? JSON.parse(saved) : defaultPreferences;
};

// Check if intro has been completed
export const hasCompletedIntro = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.COMPLETED_INTRO) === 'true';
};

export const markIntroCompleted = (): void => {
  localStorage.setItem(STORAGE_KEYS.COMPLETED_INTRO, 'true');
};