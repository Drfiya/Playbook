export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  keyTakeaways: string[];
  exercises: Exercise[];
  quizQuestions: QuizQuestion[];
  relatedChapters: number[];
  content: ChapterContent;
  icon: string;
  color: string;
}

export interface ChapterContent {
  introduction: string;
  sections: ContentSection[];
  summary: string;
  actionItems: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  visualElements?: VisualElement[];
  caseStudy?: CaseStudy;
}

export interface VisualElement {
  type: 'diagram' | 'checklist' | 'infographic' | 'quote';
  content: string;
  caption?: string;
}

export interface CaseStudy {
  title: string;
  scenario: string;
  challenge: string;
  solution: string;
  outcome: string;
  lessons: string[];
}

export interface Exercise {
  id: string;
  type: 'reflection' | 'practical' | 'scenario' | 'template';
  title: string;
  description: string;
  instructions: string[];
  deliverable: string;
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  relatedConcept: string;
}

export const chaptersData: Chapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'Why Most AI Consultants Will Fail',
    subtitle: '(And How You Can Win)',
    description: 'Master the honest positioning that separates premium consultants from hype-driven vendors.',
    keyTakeaways: [
      'AI is a luxury, not a right - clients must earn readiness',
      'The 4-Point Readiness Assessment framework',
      'Three-tier service strategy (Education, Prep, Implementation)',
      'Premium consultants give clients what they need, not what they want',
      'The most profitable work is in Tier 2 (Preparation)'
    ],
    exercises: [
      {
        id: 'ex-1-1',
        type: 'template',
        title: 'Create Your Readiness Assessment Checklist',
        description: 'Build a customized version of the 4-point readiness assessment for your target market.',
        instructions: [
          'List the four key checkpoints: Processes, Data, Buy-in, Systems',
          'For each checkpoint, write 3-5 specific questions for your industry',
          'Create scoring criteria (Ready vs Not Ready)',
          'Design a visual scorecard for client presentations'
        ],
        deliverable: 'A complete readiness assessment template',
        estimatedTime: 30,
        difficulty: 'intermediate'
      },
      {
        id: 'ex-1-2',
        type: 'scenario',
        title: 'The Hostile Room Challenge',
        description: 'Practice handling skeptical stakeholders using the "Buy-In Technique".',
        instructions: [
          'Review the hostile room scenario from the chapter',
          'Write your own version of the disarming script',
          'Identify three types of skeptics in your experience',
          'Create responses for each skeptic type'
        ],
        deliverable: 'A personalized script for handling skepticism',
        estimatedTime: 20,
        difficulty: 'advanced'
      },
      {
        id: 'ex-1-3',
        type: 'practical',
        title: 'Design Your Three-Tier Service Offering',
        description: 'Structure your consulting services into Education, Prep, and Implementation tiers.',
        instructions: [
          'Define your Tier 3 (Education) offerings and pricing',
          'Define your Tier 2 (Prep) offerings and pricing',
          'Define your Tier 1 (Implementation) offerings and pricing',
          'Create transition paths between tiers'
        ],
        deliverable: 'A complete three-tier service menu',
        estimatedTime: 45,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-1-1',
        question: 'What is the core positioning shift that separates premium consultants from hype consultants?',
        type: 'multiple-choice',
        options: [
          'Charging higher prices for the same services',
          'Giving clients what they need, not what they want',
          'Using the latest AI tools and technologies',
          'Working with enterprise clients only'
        ],
        correctAnswer: 1,
        explanation: 'Premium consultants diagnose what clients actually need to succeed, rather than just delivering what clients ask for.',
        relatedConcept: 'Honest vs Hype Positioning'
      },
      {
        id: 'q-1-2',
        question: 'If a client fails 2 or more readiness checkpoints, what should you sell them?',
        type: 'multiple-choice',
        options: [
          'Tier 1 (Implementation)',
          'Tier 2 (Prep) or Tier 3 (Education)',
          'A discounted pilot project',
          'Nothing - walk away'
        ],
        correctAnswer: 1,
        explanation: 'Clients who fail multiple checkpoints need foundation work (Tier 2) or education (Tier 3) before they can successfully implement AI.',
        relatedConcept: 'Three-Tier Strategy'
      },
      {
        id: 'q-1-3',
        question: 'True or False: The most profitable consulting work is in Tier 1 (Implementation).',
        type: 'true-false',
        correctAnswer: 'false',
        explanation: 'The chapter reveals that Tier 2 (Prep) is actually where consultants make the most money - it\'s high-value, long-term, critical work.',
        relatedConcept: 'Tier 2 Profitability'
      }
    ],
    relatedChapters: [2, 3, 4],
    content: {
      introduction: 'The Zoom call lit up. It was the CEO of a $50 million logistics company, excited about AI. He had $30,000 ready to spend. And I told him no. This is the story of why that "no" led to more business, not less.',
      sections: [
        {
          id: 'section-1-1',
          title: 'The $30,000 Misunderstanding',
          content: 'Most consultants would jump at a $30,000 project. But taking money for a project destined to fail isn\'t consulting - it\'s theft. The client wanted a custom GPT for their SOPs, but they lacked the foundation to make it work.',
          caseStudy: {
            title: 'The Logistics CEO Wake-Up Call',
            scenario: 'A $50M logistics company CEO wants to build a custom GPT after seeing OpenAI DevDay.',
            challenge: 'The company has no documented processes, messy data, and no automation infrastructure.',
            solution: 'Instead of taking the money, diagnose their actual readiness and propose a foundation-building engagement.',
            outcome: 'Client realizes they need preparation work first, leading to a larger, more successful engagement.',
            lessons: [
              'Saying no to the wrong project builds trust',
              'Diagnostic honesty leads to bigger opportunities',
              'Foundation work prevents future failure'
            ]
          }
        },
        {
          id: 'section-1-2',
          title: 'AI is a Luxury, Not a Right',
          content: 'This provocative statement filters bad clients and attracts good ones. You earn the ability to use AI through proper preparation - documented processes, clean data, executive buy-in, and existing systems.',
          visualElements: [
            {
              type: 'quote',
              content: 'AI is a luxury, not a right. You earn the ability to use AI. You don\'t just get it.',
              caption: 'The core positioning statement that defines your consulting approach'
            }
          ]
        },
        {
          id: 'section-1-3',
          title: 'The Four Readiness Checkpoints',
          content: 'Before any AI implementation, assess: Processes (documented?), Data (clean and accessible?), Buy-in (C-suite sponsor?), and Systems (existing automation?). Failure on 2+ points means the client needs preparation, not implementation.',
          visualElements: [
            {
              type: 'checklist',
              content: '☐ Processes are documented and repeatable\n☐ Data is clean with a data dictionary\n☐ C-suite is the project sponsor\n☐ Company has automation experience',
              caption: 'The AI Readiness Assessment Checklist'
            }
          ]
        },
        {
          id: 'section-1-4',
          title: 'The Three-Tier Strategy',
          content: 'Structure your services into three tiers: Tier 3 (Education) for the curious but confused, Tier 2 (Prep) for the willing but unready, and Tier 1 (Implementation) for those truly ready. Tier 2 is where the real money is.',
          visualElements: [
            {
              type: 'infographic',
              content: 'Tier 3: Education (Workshops, Training) → Tier 2: Prep (Process Mapping, Data Cleaning) → Tier 1: Implementation (Custom Solutions)',
              caption: 'The progression path from education to implementation'
            }
          ]
        }
      ],
      summary: 'Success in AI consulting comes from honest positioning, not hype. Use the 4-point readiness assessment to diagnose client needs, then prescribe the appropriate tier of service. The most profitable work is in preparing clients for AI, not just implementing it.',
      actionItems: [
        'Memorize and practice the "AI is a luxury" positioning statement',
        'Create your customized 4-point readiness assessment',
        'Design your three-tier service offerings with clear pricing',
        'Prepare a "hostile room" script for skeptical stakeholders',
        'Develop a small "trust builder" offer like a $5k subscription audit'
      ]
    },
    icon: '🎯',
    color: '#1e40af'
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Art of the Discovery Call',
    subtitle: 'Be the Doctor, Not the Drug Dealer',
    description: 'Master the discovery call framework that positions you as a trusted advisor, not a vendor.',
    keyTakeaways: [
      'Be the doctor who diagnoses, not the drug dealer who pushes solutions',
      'The 80/20 listening rule for discovery calls',
      'How to uncover the real problem behind the stated problem',
      'Building trust through strategic vulnerability',
      'Converting discovery into paid strategy work'
    ],
    exercises: [
      {
        id: 'ex-2-1',
        type: 'template',
        title: 'Discovery Call Question Bank',
        description: 'Build your arsenal of diagnostic questions for discovery calls.',
        instructions: [
          'Create 5 questions about current processes',
          'Create 5 questions about pain points and costs',
          'Create 5 questions about future vision',
          'Create 5 questions about decision-making and budget'
        ],
        deliverable: 'A complete discovery call question template',
        estimatedTime: 30,
        difficulty: 'beginner'
      }
    ],
    quizQuestions: [
      {
        id: 'q-2-1',
        question: 'What is the key difference between being a "doctor" vs a "drug dealer" consultant?',
        type: 'multiple-choice',
        options: [
          'Doctors charge more than drug dealers',
          'Doctors diagnose problems; drug dealers push pre-made solutions',
          'Doctors work with enterprises; drug dealers work with SMBs',
          'Doctors use AI; drug dealers use traditional tools'
        ],
        correctAnswer: 1,
        explanation: 'The doctor consultant focuses on diagnosing the real problem, while the drug dealer just pushes their favorite solutions regardless of fit.',
        relatedConcept: 'Diagnostic Consulting'
      }
    ],
    relatedChapters: [1, 3, 4],
    content: {
      introduction: 'The choice is simple: be the AI drug dealer who pushes the sexiest solutions, or be the doctor who diagnoses the real problem. One builds a temporary hustle; the other builds a real business.',
      sections: [
        {
          id: 'section-2-1',
          title: 'The Doctor vs Drug Dealer Framework',
          content: 'Drug dealers hear a pain point and immediately offer their go-to solution. Doctors listen, diagnose, and prescribe what\'s actually needed - even if it means walking away from immediate revenue.'
        }
      ],
      summary: 'Master the art of diagnostic discovery by listening 80% of the time, asking strategic questions, and positioning yourself as the trusted advisor who will tell the truth - even when it\'s uncomfortable.',
      actionItems: [
        'Practice the 80/20 listening rule in your next call',
        'Develop your discovery call question bank',
        'Create a "strategic vulnerability" moment for building trust'
      ]
    },
    icon: '🔍',
    color: '#059669'
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'Reading the Room & Red Flags',
    subtitle: 'The Morning After the Call',
    description: 'Learn to identify and navigate client red flags before they become project disasters.',
    keyTakeaways: [
      'The 15 red flags that predict project failure',
      'How to decode client language and behavior',
      'When to walk away vs when to educate',
      'The "spaghetti backend" diagnostic',
      'Converting red flags into premium opportunities'
    ],
    exercises: [
      {
        id: 'ex-3-1',
        type: 'reflection',
        title: 'Red Flag Retrospective',
        description: 'Analyze past client engagements to identify missed red flags.',
        instructions: [
          'List 3 past challenging clients',
          'Identify the red flags you missed',
          'Write what you would do differently',
          'Create your personal red flag checklist'
        ],
        deliverable: 'Personal red flag identification guide',
        estimatedTime: 25,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-3-1',
        question: 'What does "Needs AI agents NOW. Saw on LinkedIn" indicate?',
        type: 'multiple-choice',
        options: [
          'A well-prepared client ready for implementation',
          'A client driven by FOMO without understanding',
          'A technical leader with clear vision',
          'An ideal Tier 1 opportunity'
        ],
        correctAnswer: 1,
        explanation: 'This is a classic red flag indicating the client is driven by hype and FOMO rather than genuine business need or understanding.',
        relatedConcept: 'FOMO-Driven Decisions'
      }
    ],
    relatedChapters: [1, 2, 4],
    content: {
      introduction: 'It\'s 7 AM. Your coffee is cold. In front of you is a legal pad from yesterday\'s discovery calls - a chaotic mess of frantic scribbles revealing the truth about your prospects.',
      sections: [
        {
          id: 'section-3-1',
          title: 'Decoding the Client Chaos',
          content: 'Learn to read between the lines of client requests. "Gmail/Notion/Slack. Broke. Budget: $2k MAX" tells you everything about their readiness and expectations.'
        }
      ],
      summary: 'Master the art of reading client signals early. Red flags aren\'t deal-breakers - they\'re opportunities to provide the right type of value at the right price point.',
      actionItems: [
        'Create your red flag identification checklist',
        'Practice decoding client language patterns',
        'Develop responses for common red flag scenarios'
      ]
    },
    icon: '🚩',
    color: '#dc2626'
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'Solution Design & Pricing That Scales',
    subtitle: 'From Chaos to Calm',
    description: 'Design solutions that bring calm to chaos and price them for sustainable growth.',
    keyTakeaways: [
      'Positioning as a source of calm, not agitation',
      'The psychology of value-based pricing',
      'Creating scalable solution frameworks',
      'The "Partner vs Vendor" positioning',
      'Pricing for outcomes, not hours'
    ],
    exercises: [
      {
        id: 'ex-4-1',
        type: 'practical',
        title: 'Design Your Signature Solution',
        description: 'Create a repeatable solution framework for your most common client problem.',
        instructions: [
          'Identify the #1 problem you solve',
          'Map the step-by-step solution process',
          'Create deliverables for each step',
          'Design three pricing tiers'
        ],
        deliverable: 'Complete solution framework with pricing',
        estimatedTime: 60,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-4-1',
        question: 'What should be your primary positioning with overwhelmed clients?',
        type: 'multiple-choice',
        options: [
          'The expert who knows all the latest tools',
          'The source of calmness, not agitation',
          'The cheapest option available',
          'The fastest implementation partner'
        ],
        correctAnswer: 1,
        explanation: 'Clients come to you overwhelmed and lost. Your job is to be the one source of calm and clarity, not to add to the noise.',
        relatedConcept: 'Calm Leadership'
      }
    ],
    relatedChapters: [1, 5, 8],
    content: {
      introduction: 'When clients first come to you, they aren\'t just confused - they\'re overwhelmed and lost. Your job is not to add to the noise, but to be the one person they come to for calmness.',
      sections: [
        {
          id: 'section-4-1',
          title: 'The Chaos to Calm Framework',
          content: 'Position yourself as a partner, not a vendor. You\'re not selling products; you\'re providing peace of mind and strategic clarity in a chaotic landscape.'
        }
      ],
      summary: 'Success in solution design comes from simplifying complexity, not adding to it. Price for the value of calm and clarity you provide, not the hours you work.',
      actionItems: [
        'Define your "chaos to calm" value proposition',
        'Create scalable solution templates',
        'Develop outcome-based pricing models'
      ]
    },
    icon: '💡',
    color: '#7c3aed'
  },
  {
    id: 'chapter-5',
    number: 5,
    title: 'The Call Autopsy Protocol',
    subtitle: 'The Mirror Never Lies',
    description: 'Use AI-powered call analysis to dramatically improve your sales conversations.',
    keyTakeaways: [
      'Recording and analyzing every sales call',
      'The 47 filler words killing your credibility',
      'Body language and confusion detection',
      'The 80/20 talk-time ratio rule',
      'Converting analysis into improvement'
    ],
    exercises: [
      {
        id: 'ex-5-1',
        type: 'practical',
        title: 'Perform Your First Call Autopsy',
        description: 'Record and analyze your next discovery call using AI tools.',
        instructions: [
          'Record your next client call',
          'Transcribe using AI tools',
          'Count filler words and talk time',
          'Identify 3 improvement areas',
          'Create an action plan'
        ],
        deliverable: 'Call analysis report with improvements',
        estimatedTime: 45,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-5-1',
        question: 'What is the ideal talk-time ratio for discovery calls?',
        type: 'multiple-choice',
        options: [
          '50/50 - Equal talking time',
          '80/20 - You talk 80%, client talks 20%',
          '20/80 - You talk 20%, client talks 80%',
          '60/40 - You talk 60%, client talks 40%'
        ],
        correctAnswer: 2,
        explanation: 'In discovery calls, you should be listening 80% of the time and talking only 20%, allowing the client to reveal their real needs.',
        relatedConcept: 'Active Listening'
      }
    ],
    relatedChapters: [2, 7],
    content: {
      introduction: 'You think you nailed that call. But the reality? 47 filler words in 15 minutes. A client showing confusion you completely missed. And you talked for 45 minutes of a 60-minute "discovery" call.',
      sections: [
        {
          id: 'section-5-1',
          title: 'The Unblinking Mirror',
          content: 'AI call analysis reveals the brutal truth about your communication. Every "um," every missed signal, every moment you should have shut up and listened.'
        }
      ],
      summary: 'Use AI as your personal communication coach. Record, analyze, and systematically improve every client interaction until excellence becomes automatic.',
      actionItems: [
        'Set up call recording for all client calls',
        'Run your first AI-powered call analysis',
        'Create a filler word elimination plan',
        'Practice the 20/80 talk ratio'
      ]
    },
    icon: '🎙️',
    color: '#0891b2'
  },
  {
    id: 'chapter-6',
    number: 6,
    title: 'The $20,000 X-Ray',
    subtitle: 'Building the Audit Automation',
    description: 'Create high-value audit products that diagnose client problems and justify premium pricing.',
    keyTakeaways: [
      'Positioning audits as diagnostic X-rays',
      'The automation audit framework',
      'Finding $3,000/month in savings',
      'Converting audits to larger engagements',
      'Productizing your expertise'
    ],
    exercises: [
      {
        id: 'ex-6-1',
        type: 'template',
        title: 'Build Your Audit Framework',
        description: 'Create a systematic audit process for your specialty.',
        instructions: [
          'Define audit scope and deliverables',
          'Create assessment criteria',
          'Build scoring methodology',
          'Design report template',
          'Set pricing structure'
        ],
        deliverable: 'Complete audit framework and templates',
        estimatedTime: 90,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-6-1',
        question: 'Why is the audit compared to an "X-ray"?',
        type: 'multiple-choice',
        options: [
          'Because it\'s expensive',
          'Because it reveals hidden problems clients can\'t see',
          'Because it uses AI technology',
          'Because it\'s quick and painless'
        ],
        correctAnswer: 1,
        explanation: 'Like an X-ray, the audit reveals hidden problems and inefficiencies that clients cannot see on their own, justifying the premium price.',
        relatedConcept: 'Diagnostic Value'
      }
    ],
    relatedChapters: [1, 4, 10],
    content: {
      introduction: 'The CEO leans forward with arms crossed. "Everyone talks about AI, but no one can show me exactly where it fits." This is the moment where most consultants die. Unless you have the $20,000 X-ray.',
      sections: [
        {
          id: 'section-6-1',
          title: 'The X-Ray Positioning',
          content: 'An audit isn\'t just an assessment - it\'s a diagnostic tool that reveals hidden value, like an X-ray showing fractures invisible to the naked eye.'
        }
      ],
      summary: 'Transform your expertise into a high-value diagnostic product. The audit becomes your trust-builder, revenue generator, and gateway to larger engagements.',
      actionItems: [
        'Design your signature audit offering',
        'Create audit templates and tools',
        'Practice the X-ray value proposition',
        'Set premium audit pricing'
      ]
    },
    icon: '🔬',
    color: '#ea580c'
  },
  {
    id: 'chapter-7',
    number: 7,
    title: 'The Human Multiplier',
    subtitle: 'Why Communication is Everything',
    description: 'Master the communication skills that multiply your technical expertise into consulting success.',
    keyTakeaways: [
      'Communication beats coding ability every time',
      'The proper verbiage for different stakeholders',
      'Active listening and acknowledgment',
      'Framing problems vs presenting solutions',
      'Building trust through communication'
    ],
    exercises: [
      {
        id: 'ex-7-1',
        type: 'reflection',
        title: 'Communication Style Assessment',
        description: 'Evaluate and improve your communication approach.',
        instructions: [
          'Record yourself explaining a technical concept',
          'Identify jargon and complex terms',
          'Rewrite in plain language',
          'Test with non-technical person',
          'Refine based on feedback'
        ],
        deliverable: 'Improved explanation with feedback',
        estimatedTime: 30,
        difficulty: 'beginner'
      }
    ],
    quizQuestions: [
      {
        id: 'q-7-1',
        question: 'According to the chapter, what beats technical ability every time?',
        type: 'multiple-choice',
        options: [
          'Industry connections',
          'Lower pricing',
          'Communication skills',
          'Certification credentials'
        ],
        correctAnswer: 2,
        explanation: 'Communication beats coding and technical ability every single time. Without proper communication, your technical skills don\'t matter.',
        relatedConcept: 'Communication Primacy'
      }
    ],
    relatedChapters: [2, 5, 14],
    content: {
      introduction: 'There is a fundamental, uncomfortable truth: Communication beats coding and technical ability. Every. Single. Time. If you can\'t communicate, none of your technical skill matters.',
      sections: [
        {
          id: 'section-7-1',
          title: 'The Brutal Truth',
          content: 'It doesn\'t matter how smart you are or how well you can code. If you lack proper verbiage, cannot frame problems, or cannot demonstrate active listening, you will fail.'
        }
      ],
      summary: 'Technical skills get you in the door, but communication skills build the house. Master both, but prioritize the one that actually closes deals and retains clients.',
      actionItems: [
        'Practice explaining technical concepts simply',
        'Develop stakeholder-specific communication styles',
        'Master active listening techniques',
        'Build your business vocabulary'
      ]
    },
    icon: '💬',
    color: '#0ea5e9'
  },
  {
    id: 'chapter-8',
    number: 8,
    title: 'The Chinese Menu Technique',
    subtitle: 'Packaging Services for Fortune 500',
    description: 'Learn the sophisticated service packaging technique that Fortune 500 companies expect.',
    keyTakeaways: [
      'The Chinese Menu pricing strategy',
      'Modular service packaging',
      'The "light version of 8" phenomenon',
      'Enterprise procurement psychology',
      'Creating choice architectures'
    ],
    exercises: [
      {
        id: 'ex-8-1',
        type: 'practical',
        title: 'Create Your Chinese Menu',
        description: 'Package your services into a modular menu format.',
        instructions: [
          'List all your service components',
          'Group into logical categories',
          'Create 3-5 options per category',
          'Design combinations and packages',
          'Price each component and bundle'
        ],
        deliverable: 'Complete Chinese Menu service catalog',
        estimatedTime: 60,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-8-1',
        question: 'What is the Chinese Menu Technique?',
        type: 'multiple-choice',
        options: [
          'Offering services in multiple languages',
          'Providing modular service options clients can mix and match',
          'Pricing services based on complexity',
          'Focusing on Asian markets'
        ],
        correctAnswer: 1,
        explanation: 'The Chinese Menu Technique involves packaging services as modular options that clients can select and combine, like ordering from a restaurant menu.',
        relatedConcept: 'Modular Packaging'
      }
    ],
    relatedChapters: [4, 11],
    content: {
      introduction: 'After a recent Fortune 500 engagement, we were educated by the client on a new way to package services - one they not only prefer but expect from vendors.',
      sections: [
        {
          id: 'section-8-1',
          title: 'We Want the Light Version of 8',
          content: 'Enterprise clients think in terms of modular components. They want to see options, pick what fits, and have the flexibility to adjust.'
        }
      ],
      summary: 'Stop selling monolithic packages. Create modular, flexible service menus that give enterprise clients the control and choice they expect.',
      actionItems: [
        'Modularize your current services',
        'Create your Chinese Menu structure',
        'Design package combinations',
        'Test with enterprise prospects'
      ]
    },
    icon: '📋',
    color: '#f59e0b'
  },
  {
    id: 'chapter-9',
    number: 9,
    title: 'The Golden Parrot',
    subtitle: 'The $300 Tuition Fee',
    description: 'Transform mistakes and failures into valuable learning opportunities and content.',
    keyTakeaways: [
      'Every failure is a $300 tuition payment',
      'Converting mistakes into case studies',
      'The value of documented failures',
      'Building resilience through reframing',
      'Creating content from chaos'
    ],
    exercises: [
      {
        id: 'ex-9-1',
        type: 'reflection',
        title: 'Failure to Fortune Analysis',
        description: 'Transform a recent failure into valuable insight.',
        instructions: [
          'Describe a recent project failure',
          'Identify the key lessons learned',
          'Calculate the "tuition cost"',
          'Write the case study',
          'Extract 3 preventable mistakes'
        ],
        deliverable: 'Failure case study and prevention guide',
        estimatedTime: 40,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-9-1',
        question: 'How should consultants view project failures?',
        type: 'multiple-choice',
        options: [
          'As career-ending disasters',
          'As tuition payments for valuable lessons',
          'As client relationship enders',
          'As reasons to lower prices'
        ],
        correctAnswer: 1,
        explanation: 'Every failure is a tuition payment that teaches valuable lessons you can apply to future engagements and share with others.',
        relatedConcept: 'Failure as Tuition'
      }
    ],
    relatedChapters: [13, 14],
    content: {
      introduction: 'I was in the Dominican Republic, relaxed and happy, when the Fiverr notification came through. What followed was a $300 disaster that became a golden teaching moment.',
      sections: [
        {
          id: 'section-9-1',
          title: 'The Unexpected Order',
          content: 'A fluke order slipped through my supposedly blocked Fiverr account, leading to a cascade of problems and ultimately, valuable insights.'
        }
      ],
      summary: 'Every consultant failure is tuition for a lesson you needed to learn. The key is to extract maximum value from each "payment" and never pay for the same lesson twice.',
      actionItems: [
        'Document your recent failures',
        'Extract lessons from each failure',
        'Create prevention frameworks',
        'Share lessons as content'
      ]
    },
    icon: '🦜',
    color: '#84cc16'
  },
  {
    id: 'chapter-10',
    number: 10,
    title: 'The 1-Hour Workshop Cheat Code',
    subtitle: 'The 11 PM Deck',
    description: 'Create compelling workshop presentations in under an hour using AI and templates.',
    keyTakeaways: [
      'The 1-hour workshop creation system',
      'AI-powered research and content generation',
      'Customization without starting from scratch',
      'The psychology of workshop delivery',
      'Converting workshops to consulting engagements'
    ],
    exercises: [
      {
        id: 'ex-10-1',
        type: 'practical',
        title: 'Build Your Workshop Template',
        description: 'Create a reusable workshop framework you can customize quickly.',
        instructions: [
          'Design your workshop structure',
          'Create slide templates',
          'Build research prompts for AI',
          'Develop customization checklist',
          'Time yourself creating a sample'
        ],
        deliverable: 'Complete workshop template system',
        estimatedTime: 75,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-10-1',
        question: 'What enables the creation of a workshop deck in under an hour?',
        type: 'multiple-choice',
        options: [
          'Having a team of designers',
          'Using AI tools and proven templates',
          'Copying from previous clients',
          'Keeping content generic'
        ],
        correctAnswer: 1,
        explanation: 'The 1-hour workshop system combines AI-powered research and content generation with proven templates to create customized presentations quickly.',
        relatedConcept: 'AI-Powered Efficiency'
      }
    ],
    relatedChapters: [14, 11],
    content: {
      introduction: 'It\'s 11:03 PM. An urgent email arrives: a high-value prospect needs a customized workshop for tomorrow morning. Instead of panic, you smile. You\'ll be in bed by midnight.',
      sections: [
        {
          id: 'section-10-1',
          title: 'The Cheat Code System',
          content: 'Combine AI research, proven templates, and strategic customization to create workshops that look like they took weeks, not hours.'
        }
      ],
      summary: 'Master the art of rapid workshop creation. Use AI and templates to handle the heavy lifting while you focus on customization and value delivery.',
      actionItems: [
        'Build your workshop template library',
        'Create AI research prompts',
        'Practice the 1-hour challenge',
        'Develop your workshop persona'
      ]
    },
    icon: '⚡',
    color: '#6366f1'
  },
  {
    id: 'chapter-11',
    number: 11,
    title: 'The AI 90% Don\'t Know',
    subtitle: 'Beyond Generative AI',
    description: 'Master the machine learning and technical skills that separate real consultants from pretenders.',
    keyTakeaways: [
      'The importance of ML fundamentals',
      'Understanding beyond generative AI',
      'Statistical models and predictions',
      'NLP and data processing skills',
      'Technical depth as differentiation'
    ],
    exercises: [
      {
        id: 'ex-11-1',
        type: 'practical',
        title: 'ML Fundamentals Assessment',
        description: 'Test and improve your machine learning knowledge.',
        instructions: [
          'Complete an ML basics quiz',
          'Identify knowledge gaps',
          'Create a learning plan',
          'Build a simple prediction model',
          'Document your learning'
        ],
        deliverable: 'ML knowledge assessment and plan',
        estimatedTime: 60,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-11-1',
        question: 'What separates six-figure consultants from pretenders?',
        type: 'multiple-choice',
        options: [
          'Better marketing and sales skills',
          'Understanding ML and statistics beyond just generative AI',
          'More expensive pricing',
          'Better client relationships'
        ],
        correctAnswer: 1,
        explanation: 'Real consulting expertise requires understanding machine learning, statistics, and data science - not just knowing how to prompt ChatGPT.',
        relatedConcept: 'Technical Depth'
      }
    ],
    relatedChapters: [12, 4],
    content: {
      introduction: 'Machine learning used to be my one true nerdy love. Then Generative AI was born, and most people stopped caring about the fundamentals that actually matter.',
      sections: [
        {
          id: 'section-11-1',
          title: 'The Hidden 90%',
          content: 'While everyone obsesses over ChatGPT, the real value lies in understanding regression, classification, clustering, and the statistical models that power business decisions.'
        }
      ],
      summary: 'Don\'t be a prompt engineer cosplaying as a consultant. Build real technical depth that lets you solve problems others can\'t even diagnose.',
      actionItems: [
        'Study ML fundamentals',
        'Learn basic statistics and regression',
        'Practice with real datasets',
        'Build prediction models',
        'Differentiate from prompt engineers'
      ]
    },
    icon: '🧠',
    color: '#991b1b'
  },
  {
    id: 'chapter-12',
    number: 12,
    title: 'The Architect and the Minefield',
    subtitle: 'Becoming Irreplaceable',
    description: 'Navigate the complexities of AI consulting while building irreplaceable value.',
    keyTakeaways: [
      'Managing overwhelmed and scattered clients',
      'The FOMO epidemic and how to cure it',
      'Building trust in chaos',
      'Becoming the irreplaceable advisor',
      'Creating calm in the storm'
    ],
    exercises: [
      {
        id: 'ex-12-1',
        type: 'scenario',
        title: 'FOMO Client Intervention',
        description: 'Practice handling clients driven by fear of missing out.',
        instructions: [
          'Create a FOMO diagnostic checklist',
          'Develop calming responses',
          'Build a reality-check framework',
          'Design a focus protocol',
          'Practice with role-play'
        ],
        deliverable: 'FOMO intervention playbook',
        estimatedTime: 45,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-12-1',
        question: 'What is the primary challenge consultants face with modern clients?',
        type: 'multiple-choice',
        options: [
          'Clients don\'t have enough budget',
          'Clients are overwhelmed, scattered, and driven by FOMO',
          'Clients don\'t understand technology',
          'Clients move too slowly'
        ],
        correctAnswer: 1,
        explanation: 'Modern clients are bombarded daily with new AI tools and frameworks, creating overwhelming FOMO and scattered attention.',
        relatedConcept: 'Client Overwhelm'
      }
    ],
    relatedChapters: [4, 7, 13],
    content: {
      introduction: 'Picture a client in a Zoom window, eyes wide, overwhelmed and scattered. They have terminal FOMO, believing AI is the magic bullet for everything. You\'re their last hope for sanity.',
      sections: [
        {
          id: 'section-12-1',
          title: 'The Drowning Consultant and the FOMO Client',
          content: 'Both consultant and client are drowning in the same flood of information. The difference is who becomes the life raft.'
        }
      ],
      summary: 'Become irreplaceable by being the architect who can navigate the minefield, not just another voice adding to the noise. Be the calm in their storm.',
      actionItems: [
        'Develop your "calm in chaos" approach',
        'Create FOMO intervention strategies',
        'Build trust through consistency',
        'Become the filtering mechanism'
      ]
    },
    icon: '🏗️',
    color: '#3730a3'
  },
  {
    id: 'chapter-13',
    number: 13,
    title: 'The Introvert\'s Playbook',
    subtitle: 'How to Get Clients to Chase You',
    description: 'Build an inbound client acquisition system that works for introverts.',
    keyTakeaways: [
      'Inbound vs outbound strategies',
      'Content that attracts ideal clients',
      'Building authority without cold calling',
      'The referral multiplication system',
      'Passive lead generation that works'
    ],
    exercises: [
      {
        id: 'ex-13-1',
        type: 'practical',
        title: 'Build Your Inbound System',
        description: 'Create a client attraction system that doesn\'t require cold outreach.',
        instructions: [
          'Define your ideal client profile',
          'Choose your content channels',
          'Create your first 10 pieces',
          'Design your funnel',
          'Set up tracking'
        ],
        deliverable: 'Complete inbound marketing system',
        estimatedTime: 90,
        difficulty: 'advanced'
      }
    ],
    quizQuestions: [
      {
        id: 'q-13-1',
        question: 'What is the key to introvert-friendly client acquisition?',
        type: 'multiple-choice',
        options: [
          'Force yourself to make cold calls',
          'Build systems that attract clients to you',
          'Partner with extroverted salespeople',
          'Focus only on referrals'
        ],
        correctAnswer: 1,
        explanation: 'Introverts succeed by building inbound systems - content, authority, and value that makes clients come to them instead of chasing.',
        relatedConcept: 'Inbound Strategy'
      }
    ],
    relatedChapters: [9, 14],
    content: {
      introduction: 'Of 43 businesses started since high school, not one was built on cold calling. "I hate bothering people. I\'m shy, introverted, and feel like I\'m burdening people just by speaking."',
      sections: [
        {
          id: 'section-13-1',
          title: 'The Confession',
          content: 'The uncomfortable truth: many successful consultants are introverts who built systems to avoid the traditional sales hustle.'
        }
      ],
      summary: 'You don\'t need to be an extrovert to succeed in consulting. Build systems that align with your personality and let your expertise draw clients to you.',
      actionItems: [
        'Accept your introverted strengths',
        'Build your content strategy',
        'Create passive lead magnets',
        'Develop referral systems',
        'Automate initial qualifying'
      ]
    },
    icon: '🧲',
    color: '#c026d3'
  },
  {
    id: 'chapter-14',
    number: 14,
    title: 'The Art of the Workshop',
    subtitle: 'From Boring Parrot to 3D Human',
    description: 'Transform your workshops from boring presentations into engaging, transformative experiences.',
    keyTakeaways: [
      'Pre-flight workshop design checklist',
      'Engaging passive audiences',
      'The teaching skills framework',
      'Converting workshops to consulting',
      'Building interactive experiences'
    ],
    exercises: [
      {
        id: 'ex-14-1',
        type: 'practical',
        title: 'Workshop Transformation Exercise',
        description: 'Redesign a boring presentation into an engaging workshop.',
        instructions: [
          'Take an existing presentation',
          'Add 3 interactive elements',
          'Create participant activities',
          'Build engagement triggers',
          'Test with a small group'
        ],
        deliverable: 'Transformed workshop design',
        estimatedTime: 60,
        difficulty: 'intermediate'
      }
    ],
    quizQuestions: [
      {
        id: 'q-14-1',
        question: 'What is the worst fear in workshop delivery?',
        type: 'multiple-choice',
        options: [
          'Technical difficulties',
          'Running out of time',
          'Blank stares and radio silence from participants',
          'Difficult questions'
        ],
        correctAnswer: 2,
        explanation: 'The worst fear is facing blank stares and radio silence - signs that you\'ve lost the audience and failed to engage them.',
        relatedConcept: 'Audience Engagement'
      }
    ],
    relatedChapters: [7, 10],
    content: {
      introduction: 'Twenty minutes into your workshop, you look out at a sea of passive, dispassionate faces. Blank stares. Radio silence. You\'re losing them - in fact, you never had them.',
      sections: [
        {
          id: 'section-14-1',
          title: 'The Room of Blank Stares',
          content: 'This is every presenter\'s nightmare, amplified in high-stakes consulting. But teaching, like any skill, can be systematically acquired and improved.'
        }
      ],
      summary: 'Transform from a boring information parrot into a three-dimensional human who creates experiences, not just presentations. Make your workshops unforgettable.',
      actionItems: [
        'Design pre-workshop engagement',
        'Create interactive elements',
        'Build energy management systems',
        'Develop your teaching persona',
        'Practice audience reading'
      ]
    },
    icon: '🎭',
    color: '#065f46'
  }
];

// Helper function to get chapter by ID
export const getChapterById = (id: string): Chapter | undefined => {
  return chaptersData.find(chapter => chapter.id === id);
};

// Helper function to get chapter by number
export const getChapterByNumber = (number: number): Chapter | undefined => {
  return chaptersData.find(chapter => chapter.number === number);
};

// Helper function to get related chapters
export const getRelatedChapters = (chapterNumber: number): Chapter[] => {
  const chapter = getChapterByNumber(chapterNumber);
  if (!chapter) return [];
  
  return chapter.relatedChapters
    .map(num => getChapterByNumber(num))
    .filter(Boolean) as Chapter[];
};

// Helper function to calculate total exercises
export const getTotalExercises = (): number => {
  return chaptersData.reduce((total, chapter) => total + chapter.exercises.length, 0);
};

// Helper function to calculate total quiz questions
export const getTotalQuizQuestions = (): number => {
  return chaptersData.reduce((total, chapter) => total + chapter.quizQuestions.length, 0);
};