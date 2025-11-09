// AI Coach and Context Engine for intelligent guidance and insights

import { Chapter, getChapterByNumber, getRelatedChapters } from '../data/chapters';
import { UserProgress, ChapterProgress } from './storage';

export interface CoachMessage {
  id: string;
  type: 'hint' | 'encouragement' | 'insight' | 'challenge' | 'reminder' | 'connection';
  content: string;
  context?: string;
  relatedChapters?: number[];
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ContextualDefinition {
  term: string;
  definition: string;
  examples?: string[];
  relatedConcepts?: string[];
  chapterReferences?: number[];
}

export interface CrossChapterConnection {
  sourceChapter: number;
  targetChapter: number;
  connectionType: 'builds-on' | 'contrasts-with' | 'complements' | 'applies-to';
  description: string;
  keyInsight: string;
}

// AI Coach personality and guidance system
export class AICoach {
  private progress: UserProgress;
  private currentChapter: number;
  
  constructor(progress: UserProgress, currentChapter: number) {
    this.progress = progress;
    this.currentChapter = currentChapter;
  }
  
  // Generate contextual messages based on user progress
  generateMessage(): CoachMessage {
    const messages: CoachMessage[] = [];
    const now = new Date().toISOString();
    
    // Check progress patterns
    const chapterProgress = this.progress.chaptersProgress.find(
      cp => cp.chapterNumber === this.currentChapter
    );
    
    if (!chapterProgress || chapterProgress.status === 'not-started') {
      messages.push({
        id: this.generateId(),
        type: 'encouragement',
        content: "Ready to dive in? This chapter contains game-changing insights that will transform how you approach consulting.",
        priority: 'high',
        timestamp: now
      });
    }
    
    // If struggling (low quiz scores)
    const recentQuizzes = this.progress.quizResults.filter(
      q => q.chapterId === `chapter-${this.currentChapter}`
    );
    if (recentQuizzes.length > 0) {
      const avgScore = recentQuizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions), 0) / recentQuizzes.length;
      if (avgScore < 0.7) {
        messages.push({
          id: this.generateId(),
          type: 'hint',
          content: "I notice you're working hard on this material. Try reviewing the key takeaways and then applying them to a real scenario from your experience.",
          priority: 'medium',
          timestamp: now
        });
      } else if (avgScore >= 0.9) {
        messages.push({
          id: this.generateId(),
          type: 'encouragement',
          content: "Outstanding performance! You're mastering this material. Ready for a challenge?",
          priority: 'medium',
          timestamp: now
        });
      }
    }
    
    // Suggest connections to other chapters
    const relatedChapters = getRelatedChapters(this.currentChapter);
    if (relatedChapters.length > 0 && Math.random() > 0.7) {
      const related = relatedChapters[Math.floor(Math.random() * relatedChapters.length)];
      messages.push({
        id: this.generateId(),
        type: 'connection',
        content: `This concept connects beautifully with Chapter ${related.number}: "${related.title}". Consider how these ideas work together.`,
        relatedChapters: [related.number],
        priority: 'low',
        timestamp: now
      });
    }
    
    // Time-based encouragement
    const lastActive = new Date(this.progress.lastActiveAt);
    const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceActive > 24) {
      messages.push({
        id: this.generateId(),
        type: 'reminder',
        content: "Welcome back! Let's pick up where you left off and keep building momentum.",
        priority: 'medium',
        timestamp: now
      });
    }
    
    // Learning insights
    if (this.progress.exercisesCompleted.length > 0 && Math.random() > 0.8) {
      messages.push({
        id: this.generateId(),
        type: 'insight',
        content: `Pro tip: Try mapping this framework to your last client interaction. How would it have changed your approach?`,
        priority: 'low',
        timestamp: now
      });
    }
    
    // Return a random message from the generated pool
    if (messages.length === 0) {
      // Default message
      return {
        id: this.generateId(),
        type: 'encouragement',
        content: "You're making great progress! Keep going.",
        priority: 'low',
        timestamp: now
      };
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  // Get specific hints for exercises
  getExerciseHint(exerciseId: string): string {
    const hints: Record<string, string[]> = {
      'ex-1-1': [
        "Start by thinking about your specific industry's unique challenges.",
        "Consider what 'clean data' means in your context.",
        "Remember: the assessment should reveal readiness, not create barriers."
      ],
      'ex-1-2': [
        "Acknowledge skepticism directly - don't avoid it.",
        "Use relatable examples from their industry.",
        "Position yourself as equally skeptical but experienced."
      ],
      'ex-1-3': [
        "Tier 2 is often the most profitable - focus there.",
        "Each tier should naturally lead to the next.",
        "Price based on value delivered, not time spent."
      ],
      'ex-2-1': [
        "Questions should uncover pain, not showcase your knowledge.",
        "Focus on business impact, not technical details.",
        "Always ask about the cost of doing nothing."
      ],
      'ex-3-1': [
        "Red flags often hide in casual comments.",
        "Look for patterns across multiple clients.",
        "Sometimes the biggest red flag is no red flags."
      ],
      'ex-4-1': [
        "Start with the end result and work backwards.",
        "Make each step measurable and valuable on its own.",
        "Consider offering a small pilot version."
      ],
      'ex-5-1': [
        "Be brutally honest with yourself about weaknesses.",
        "Focus on one improvement at a time.",
        "Practice with low-stakes calls first."
      ],
      'ex-6-1': [
        "The audit should pay for itself in discovered savings.",
        "Make the invisible visible with clear metrics.",
        "Always include quick wins they can implement immediately."
      ],
      'ex-7-1': [
        "Test your explanation on someone outside the industry.",
        "If they don't understand, simplify further.",
        "Use analogies and stories, not jargon."
      ],
      'ex-8-1': [
        "Think of it like a restaurant menu - clear categories and options.",
        "Allow for customization within boundaries.",
        "Price bundles to encourage larger engagements."
      ],
      'ex-9-1': [
        "Every failure has at least three lessons.",
        "Focus on what you'll do differently, not blame.",
        "Share your lessons publicly - it builds trust."
      ],
      'ex-10-1': [
        "Build modular components you can mix and match.",
        "Have a library of proven exercises ready.",
        "Always customize the examples to their industry."
      ],
      'ex-11-1': [
        "Don't just learn the 'what' - understand the 'why'.",
        "Start with simple models before complex ones.",
        "Apply ML concepts to real business problems."
      ],
      'ex-12-1': [
        "FOMO is fear - address the fear, not the symptom.",
        "Help them focus on what matters for their specific situation.",
        "Be the filter, not another source of noise."
      ],
      'ex-13-1': [
        "Play to your strengths - depth over breadth.",
        "Content should demonstrate expertise, not just claim it.",
        "Make it easy for people to share your work."
      ],
      'ex-14-1': [
        "Energy management is key - plan peaks and valleys.",
        "Get them doing something in the first 10 minutes.",
        "Always have a backup plan for low energy rooms."
      ]
    };
    
    const exerciseHints = hints[exerciseId] || ["Think about how this applies to your specific situation."];
    return exerciseHints[Math.floor(Math.random() * exerciseHints.length)];
  }
  
  // Provide contextual definitions
  getContextualDefinition(term: string): ContextualDefinition | null {
    const definitions: Record<string, ContextualDefinition> = {
      'readiness assessment': {
        term: 'Readiness Assessment',
        definition: 'A diagnostic framework to evaluate if a client has the foundational elements needed for successful AI implementation.',
        examples: [
          'Checking if processes are documented',
          'Evaluating data quality and accessibility',
          'Confirming executive buy-in'
        ],
        relatedConcepts: ['Four Checkpoints', 'Tier Strategy', 'Technical Debt'],
        chapterReferences: [1, 3]
      },
      'three-tier strategy': {
        term: 'Three-Tier Strategy',
        definition: 'A service structure that segments clients into Education (Tier 3), Preparation (Tier 2), and Implementation (Tier 1) based on readiness.',
        examples: [
          'Tier 3: Workshops for awareness building',
          'Tier 2: Process documentation and data cleanup',
          'Tier 1: Actual AI solution deployment'
        ],
        relatedConcepts: ['Readiness Assessment', 'Value Ladder'],
        chapterReferences: [1, 4]
      },
      'trojan horse': {
        term: 'Trojan Horse Situation',
        definition: 'When a mid-level manager hires you without real authority or C-suite buy-in, often to prove a point or show up their boss.',
        examples: [
          'Manager hiring consultant to push their agenda',
          'No budget authority from the sponsor',
          'Project lacks executive sponsorship'
        ],
        relatedConcepts: ['Buy-in', 'Red Flags', 'Stakeholder Management'],
        chapterReferences: [1, 3]
      },
      'technical debt': {
        term: 'Technical Debt',
        definition: 'The accumulated cost of quick fixes, outdated systems, and poor decisions that make future changes more difficult and expensive.',
        examples: [
          'Building on legacy systems without modernization',
          'Implementing AI on undocumented processes',
          'Ignoring data quality issues'
        ],
        relatedConcepts: ['Foundation Building', 'System Architecture'],
        chapterReferences: [1, 6]
      },
      'discovery call': {
        term: 'Discovery Call',
        definition: 'An initial consultation focused on diagnosing client needs rather than selling solutions, following the 80/20 listening rule.',
        examples: [
          'Asking about current pain points and costs',
          'Understanding their business model',
          'Identifying decision makers and budget'
        ],
        relatedConcepts: ['Doctor vs Drug Dealer', 'Active Listening'],
        chapterReferences: [2, 5]
      },
      'chinese menu technique': {
        term: 'Chinese Menu Technique',
        definition: 'A service packaging method that presents modular options clients can mix and match, like items on a restaurant menu.',
        examples: [
          'Bronze, Silver, Gold packages with add-ons',
          'À la carte professional services',
          'Modular training components'
        ],
        relatedConcepts: ['Value Packaging', 'Enterprise Sales'],
        chapterReferences: [8]
      },
      'fomo': {
        term: 'FOMO (Fear of Missing Out)',
        definition: 'The anxiety clients feel about not adopting the latest AI tools, often leading to poor decisions and wasted resources.',
        examples: [
          'Rushing to implement ChatGPT without use cases',
          'Buying multiple AI tools without integration plans',
          'Following competitors blindly'
        ],
        relatedConcepts: ['Hype Cycle', 'Strategic Planning'],
        chapterReferences: [12, 3]
      },
      'call autopsy': {
        term: 'Call Autopsy',
        definition: 'The practice of recording and analyzing your sales calls to identify weaknesses and improvement areas.',
        examples: [
          'Counting filler words',
          'Measuring talk-time ratio',
          'Identifying missed buying signals'
        ],
        relatedConcepts: ['Communication Skills', 'Continuous Improvement'],
        chapterReferences: [5, 7]
      }
    };
    
    const normalizedTerm = term.toLowerCase();
    for (const [key, def] of Object.entries(definitions)) {
      if (key === normalizedTerm || def.term.toLowerCase() === normalizedTerm) {
        return def;
      }
    }
    
    return null;
  }
  
  // Find cross-chapter connections
  findConnections(sourceChapter: number): CrossChapterConnection[] {
    const connections: CrossChapterConnection[] = [
      {
        sourceChapter: 1,
        targetChapter: 4,
        connectionType: 'builds-on',
        description: 'The Three-Tier Strategy from Chapter 1 directly informs how you design and price solutions in Chapter 4.',
        keyInsight: 'Your service tiers should align with your solution design methodology.'
      },
      {
        sourceChapter: 1,
        targetChapter: 6,
        connectionType: 'applies-to',
        description: 'The Readiness Assessment becomes the foundation for your $20,000 X-Ray audit product.',
        keyInsight: 'Productize your diagnostic process into a high-value offering.'
      },
      {
        sourceChapter: 2,
        targetChapter: 5,
        connectionType: 'complements',
        description: 'The Discovery Call techniques are enhanced by the Call Autopsy Protocol for continuous improvement.',
        keyInsight: 'Record and analyze your discovery calls to master the art faster.'
      },
      {
        sourceChapter: 3,
        targetChapter: 12,
        connectionType: 'builds-on',
        description: 'Red flags from Chapter 3 help you identify and handle FOMO-driven clients in Chapter 12.',
        keyInsight: 'FOMO is often the biggest red flag of all.'
      },
      {
        sourceChapter: 4,
        targetChapter: 8,
        connectionType: 'complements',
        description: 'Solution Design principles combine with the Chinese Menu Technique for enterprise packaging.',
        keyInsight: 'Modular solutions allow for flexible, scalable pricing.'
      },
      {
        sourceChapter: 7,
        targetChapter: 14,
        connectionType: 'applies-to',
        description: 'Communication mastery from Chapter 7 is essential for effective workshop delivery in Chapter 14.',
        keyInsight: 'Your communication skills determine workshop success more than content quality.'
      },
      {
        sourceChapter: 9,
        targetChapter: 13,
        connectionType: 'builds-on',
        description: 'Failures and lessons from Chapter 9 become the authentic content that drives inbound leads in Chapter 13.',
        keyInsight: 'Sharing your failures publicly builds more trust than hiding them.'
      },
      {
        sourceChapter: 10,
        targetChapter: 14,
        connectionType: 'complements',
        description: 'The 1-Hour Workshop system provides the foundation for full workshop mastery.',
        keyInsight: 'Speed of creation allows more time for engagement design.'
      },
      {
        sourceChapter: 11,
        targetChapter: 1,
        connectionType: 'contrasts-with',
        description: 'While Chapter 1 focuses on business readiness, Chapter 11 ensures you have the technical depth to deliver.',
        keyInsight: 'Business acumen without technical depth makes you a salesperson, not a consultant.'
      }
    ];
    
    return connections.filter(c => c.sourceChapter === sourceChapter || c.targetChapter === sourceChapter);
  }
  
  // Generate personalized challenges based on progress
  generateChallenge(): string {
    const completedChapters = this.progress.chaptersProgress.filter(cp => cp.status === 'completed').length;
    const exercises = this.progress.exercisesCompleted.length;
    
    const challenges = [
      "Apply the Readiness Assessment to a past client. How would the outcome have changed?",
      "Write your 'hostile room' script and practice it out loud.",
      "Design a Chinese Menu for your services this week.",
      "Record your next call and do a full autopsy.",
      "Create a workshop on a topic you're passionate about in under an hour.",
      "Identify three red flags you missed in past engagements.",
      "Build your first productized audit offering.",
      "Share a failure story publicly and track the response.",
      "Design a three-tier service structure for your niche.",
      "Create content that attracts without selling."
    ];
    
    if (completedChapters < 3) {
      return challenges[0]; // Start with fundamentals
    } else if (completedChapters < 7) {
      return challenges[Math.floor(Math.random() * 5) + 2]; // Mid-level challenges
    } else {
      return challenges[Math.floor(Math.random() * challenges.length)]; // Any challenge
    }
  }
  
  // Provide learning path recommendations
  getNextRecommendation(): { chapter: number; reason: string } {
    const completed = this.progress.chaptersProgress
      .filter(cp => cp.status === 'completed')
      .map(cp => cp.chapterNumber);
    
    const inProgress = this.progress.chaptersProgress
      .filter(cp => cp.status === 'in-progress')
      .map(cp => cp.chapterNumber);
    
    // If currently in progress, recommend continuing
    if (inProgress.length > 0) {
      return {
        chapter: inProgress[0],
        reason: "Let's finish what you started. Momentum is everything."
      };
    }
    
    // If haven't started, begin with Chapter 1
    if (completed.length === 0) {
      return {
        chapter: 1,
        reason: "Start with the foundation. Chapter 1 sets the entire framework."
      };
    }
    
    // Recommend based on dependencies
    const recommendations: { chapter: number; reason: string }[] = [
      { chapter: 2, reason: "Master discovery calls - they determine everything that follows." },
      { chapter: 3, reason: "Learn to spot red flags before they become disasters." },
      { chapter: 4, reason: "Design solutions that scale and price them properly." },
      { chapter: 5, reason: "Use AI to dramatically improve your communication." },
      { chapter: 6, reason: "Build your first high-value audit product." },
      { chapter: 7, reason: "Communication skills multiply everything else you know." },
      { chapter: 8, reason: "Learn how Fortune 500 companies want to buy." },
      { chapter: 9, reason: "Transform failures into valuable lessons and content." },
      { chapter: 10, reason: "Create compelling workshops in record time." },
      { chapter: 11, reason: "Build technical depth that separates you from pretenders." },
      { chapter: 12, reason: "Navigate client chaos and become irreplaceable." },
      { chapter: 13, reason: "Build systems that make clients come to you." },
      { chapter: 14, reason: "Master workshop delivery and engagement." }
    ];
    
    // Find the first uncompleted chapter
    for (const rec of recommendations) {
      if (!completed.includes(rec.chapter)) {
        return rec;
      }
    }
    
    // All completed - suggest review
    return {
      chapter: 1,
      reason: "You've completed everything! Review Chapter 1 to reinforce the foundation."
    };
  }
  
  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance management
let coachInstance: AICoach | null = null;

export const getAICoach = (progress: UserProgress, currentChapter: number): AICoach => {
  if (!coachInstance || coachInstance['currentChapter'] !== currentChapter) {
    coachInstance = new AICoach(progress, currentChapter);
  }
  return coachInstance;
};

// Export coach insights for dashboard
export const getCoachInsights = (progress: UserProgress): {
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
} => {
  const insights = {
    strengths: [] as string[],
    improvements: [] as string[],
    nextSteps: [] as string[]
  };
  
  // Analyze strengths
  const completedCount = progress.chaptersProgress.filter(cp => cp.status === 'completed').length;
  if (completedCount >= 7) {
    insights.strengths.push("Exceptional dedication - over halfway through!");
  }
  
  const avgQuizScore = progress.quizResults.length > 0
    ? progress.quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions), 0) / progress.quizResults.length
    : 0;
  if (avgQuizScore >= 0.8) {
    insights.strengths.push("Strong concept retention and understanding");
  }
  
  if (progress.exercisesCompleted.length >= 10) {
    insights.strengths.push("Excellent practical application through exercises");
  }
  
  if (progress.notes.length >= 15) {
    insights.strengths.push("Active learner - great note-taking habits");
  }
  
  // Identify improvements
  if (avgQuizScore < 0.7 && progress.quizResults.length > 0) {
    insights.improvements.push("Review key concepts before moving forward");
  }
  
  if (progress.exercisesCompleted.length < completedCount * 2) {
    insights.improvements.push("Try more exercises to reinforce learning");
  }
  
  const recentActivity = (Date.now() - new Date(progress.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);
  if (recentActivity > 7) {
    insights.improvements.push("Maintain momentum with consistent daily practice");
  }
  
  // Suggest next steps
  const coach = new AICoach(progress, 1);
  const recommendation = coach.getNextRecommendation();
  insights.nextSteps.push(`Continue with Chapter ${recommendation.chapter}: ${recommendation.reason}`);
  
  if (progress.exercisesCompleted.length < 5) {
    insights.nextSteps.push("Complete at least one exercise per chapter");
  }
  
  if (progress.notes.length < 5) {
    insights.nextSteps.push("Take notes on key insights for better retention");
  }
  
  insights.nextSteps.push(coach.generateChallenge());
  
  return insights;
};