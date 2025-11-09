# AI Consulting Playbook - Interactive Learning Platform

## Project Overview
- **Name**: AI Consulting Playbook
- **Goal**: Transform 14 chapters of AI consulting wisdom into an immersive, interactive learning experience
- **Features**: 
  - 📚 14 comprehensive chapters with structured learning paths
  - 🎯 Interactive exercises and quizzes
  - 📊 Progress tracking with gamification
  - 🤖 AI Coach virtual mentor
  - 📝 Note-taking and reflection tools
  - 🏆 Achievement system with points and badges
  - 📱 Responsive design with focus mode
  - 💾 Local storage for progress persistence

## URLs
- **Live Application**: https://3000-ipxioi0x16zdyte00malr-d0b9e1e2.sandbox.novita.ai/
- **GitHub**: Not yet deployed

## Core Features

### 📖 Chapter Navigation System
- **14 Learning Modules**: Each chapter from the AI Consulting Playbook is transformed into an interactive module
- **Progressive Unlocking**: Chapters unlock sequentially to ensure foundational knowledge
- **Multi-Section Content**: Each chapter divided into digestible sections
- **Key Takeaways**: Clear learning objectives for each module

### 🎮 Interactive Learning Components

#### Exercises (3 Types)
1. **Assessment Exercises**: Practice evaluating clients using frameworks
2. **Writing Exercises**: Craft positioning statements and proposals  
3. **Role-Play Simulations**: Practice discovery calls and presentations

#### Quizzes
- Multiple choice questions with explanations
- 80% passing score required for chapter completion
- Immediate feedback with learning reinforcement

#### Reflection Prompts
- Thought-provoking questions to internalize concepts
- Personal application scenarios

### 📊 Progress & Gamification

#### Progress Tracking
- Overall course completion percentage
- Chapter-by-chapter progress indicators
- Section completion tracking
- Exercise completion status

#### Points & Achievements System
- **Points**: Earn 100-250 points per exercise
- **Badges**: 
  - Apprentice (0-499 points)
  - Rising Star (500-999 points)
  - Senior Consultant (1000-1999 points)
  - Master Consultant (2000+ points)
- **Learning Streaks**: Track consecutive days of learning

### 🤖 AI Coach Virtual Mentor
- **Context-Aware Guidance**: Provides chapter-specific tips
- **Quick Actions**: Pre-formatted help questions
- **Encouragement System**: Motivational messages based on progress
- **24/7 Availability**: Always-on assistant in the corner

### 🎯 Smart Features

#### Focus Mode
- Distraction-free reading environment
- Hides sidebar and AI Coach
- Centered content for better concentration

#### Contextual Tooltips
- Highlight text to get definitions
- Cross-chapter connections
- Related concepts display

#### Export Functionality
- Download progress summary as PDF
- Export notes and reflections
- Certificate of completion (when all chapters done)

## Data Architecture

### Chapter Data Structure
```javascript
{
  id: number,
  title: string,
  subtitle: string,
  icon: string,
  duration: string,
  keyTakeaways: string[],
  overview: string,
  sections: Section[],
  exercises: Exercise[],
  quiz: Question[],
  reflection: string
}
```

### Storage Services
- **Local Storage**: Progress tracking, notes, and user preferences
- **Session Storage**: Temporary state management
- **IndexedDB**: (Future) Offline capability and large data storage

### Progress Data Model
- Chapter completion status
- Sections read array
- Exercises completed array
- Quiz scores
- Notes per chapter
- Total points earned
- Achievement unlocks

## User Guide

### Getting Started
1. **Dashboard View**: Start at the main dashboard showing all 14 chapters
2. **Begin Learning**: Click Chapter 1 to start your journey
3. **Read Sections**: Work through each section systematically
4. **Complete Exercises**: Apply concepts through interactive exercises
5. **Take Quizzes**: Test your knowledge with chapter quizzes
6. **Track Progress**: Monitor your advancement via the sidebar tracker

### Navigation Tips
- Use **Focus Mode** for distraction-free reading
- Click the **AI Coach** icon for instant help
- **Bookmark** important sections for later review
- Use **keyboard shortcuts** (coming soon):
  - `Space` - Next section
  - `Shift+Space` - Previous section
  - `F` - Toggle focus mode

### Learning Path
1. **Foundation** (Chapters 1-3): Core positioning and discovery
2. **Skills** (Chapters 4-7): Pricing, communication, and audits
3. **Advanced** (Chapters 8-11): Specialized techniques and frameworks
4. **Mastery** (Chapters 12-14): Becoming irreplaceable and scaling

## Technical Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Build Tool**: Vite
- **State Management**: React hooks + Local Storage
- **Icons**: Font Awesome 6
- **Deployment**: PM2 process manager

## Deployment
- **Platform**: Local development server
- **Status**: ✅ Active
- **Tech Stack**: React + Vite + Tailwind CSS
- **Last Updated**: November 2024

## Currently Completed Features ✅
- Full 14-chapter content structure with data model
- Interactive dashboard with progress visualization  
- Chapter view with multi-section navigation
- Exercise system with 3 types of activities
- Quiz functionality with scoring
- Progress tracking with local storage persistence
- AI Coach virtual assistant
- Achievement/badge system
- Focus mode for distraction-free learning
- Responsive design for all devices
- Note-taking capability per chapter

## Features Not Yet Implemented 🚧
- PDF export functionality
- Keyboard shortcuts
- Dark mode toggle
- Search across all content
- Bookmarking system
- Social sharing of achievements
- Certificate generation
- Backend API for cloud sync
- Mobile app version
- Collaborative learning features

## Recommended Next Steps 📋
1. **Content Enhancement**: Add more detailed content from the actual playbook chapters
2. **Backend Integration**: Build API for user accounts and cloud progress sync
3. **Advanced Analytics**: Track learning patterns and provide personalized recommendations
4. **Community Features**: Add discussion forums or peer learning
5. **Mobile Optimization**: Create PWA or native mobile apps
6. **Certification System**: Implement formal certification upon course completion
7. **Content Updates**: Regular updates with new AI consulting trends
8. **Integration**: Connect with real consulting tools and platforms

## Installation & Setup

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
cd webapp
npm install

# Build the application
npm run build

# Start the application
npm run serve

# Or use PM2
pm2 start ecosystem.config.cjs
```

### Configuration Notes
- The `vite.config.js` includes `preview.allowedHosts` configuration for sandbox deployment
- Update the allowed hosts array if deploying to different domains
- Current configuration supports: `3000-ipxioi0x16zdyte00malr-d0b9e1e2.sandbox.novita.ai`

## Environment Variables
Currently no environment variables required. Future versions may need:
- `VITE_API_URL` - Backend API endpoint
- `VITE_AUTH_TOKEN` - Authentication token
- `VITE_ANALYTICS_ID` - Analytics tracking ID

## Contributing
This is an educational platform designed to help consultants master AI consulting skills. Contributions for content improvements and feature enhancements are welcome.

## License
Proprietary - All rights reserved

---

**Built with ❤️ for AI Consultants**