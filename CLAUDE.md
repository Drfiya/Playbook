# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Dr. Lutfiya Miller's AI Consulting Playbook** - an interactive learning platform that transforms 14 chapters of AI consulting wisdom into an immersive self-paced learning experience. Each chapter combines written content, exercises, quizzes, reflections, and an AI mentor.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Cloudflare Pages

### Process Management (PM2)
- `pm2 start ecosystem.config.cjs` - Start the application
- `pm2 restart ai-playbook` - Restart the application
- `pm2 logs ai-playbook` - View application logs
- `pm2 status` - Check PM2 status

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme (navy/silver palette)
- **State Management**: React hooks + LocalStorage
- **Deployment**: Cloudflare Pages + PM2 for local hosting
- **Content**: Markdown-style formatting in JavaScript modules

### Core Data Flow
1. Chapter metadata defined in `src/data/chapters.js` (titles, overviews, exercises, quizzes)
2. Full chapter content stored in `src/data/fullChapters.js` (detailed sections with markdown formatting)
3. Progress tracking via `src/utils/storage.ts` using LocalStorage
4. AI Coach context managed through `src/utils/aiCoach.ts`

### Key Components
- `App.jsx` - Main application shell with routing and state
- `Dashboard.jsx` - Chapter overview and progress visualization
- `ChapterView.jsx` - Individual chapter display with navigation
- `ChapterContent.jsx` - Renders markdown-style content with formatting
- `ProgressTracker.jsx` - Sidebar progress display and chapter navigation
- `AICoach.jsx` - Contextual AI assistance interface

### Content System
The app uses a dual-layer content system:
- **chapters.js**: Chapter metadata, brief overviews, exercises, and quiz definitions
- **fullChapters.js**: Complete chapter content with markdown-style formatting

Content rendering supports:
- Headers (`###`), bold (`**text**`), italic (`*text*`)
- Lists (`- item`), checklists (`- [ ] task`)
- Callouts (emoji prefixes: 🎓, 🔧, ⚠️, 💎, etc.)
- Code blocks (`` `code` ``)
- Blockquotes (`*"quote"`)

## Content Integration Workflow

### Primary Task: Chapter Content Population
The main development focus is migrating content from `/content/*.docx` files into `src/data/fullChapters.js`.

**Current Status**:
- Chapter 1: ✅ Fully integrated (6 sections)
- Chapters 2-14: ⏳ Awaiting content extraction

**Content Structure**:
```javascript
export const fullChapterContent = {
  [chapterId]: {
    sections: [
      {
        title: "Section Title",
        content: `Markdown-formatted content here...`
      }
    ]
  }
}
```

**Content Guidelines** (see `CONTENT_UPDATE_GUIDE.md`):
- Extract content from DOCX files in `/content/` directory
- Maintain formatting integrity (headers, lists, callouts, emphasis)
- Match section titles with `chapters.js` metadata
- Use markdown-style syntax for consistent rendering

## File Structure

```
├── content/                    # Source DOCX files (14 chapters)
├── src/
│   ├── data/
│   │   ├── chapters.js        # Chapter metadata and structure
│   │   ├── fullChapters.js    # Complete chapter content
│   │   └── chapters.ts        # TypeScript type definitions
│   ├── components/            # React components
│   ├── utils/
│   │   ├── storage.ts         # LocalStorage progress tracking
│   │   └── aiCoach.ts         # AI Coach functionality
│   └── App.jsx               # Main application
├── public/static/            # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind customization
├── wrangler.jsonc           # Cloudflare Pages configuration
└── ecosystem.config.cjs     # PM2 process configuration
```

## Development Guidelines

### Content Management
- All chapter content should be stored in data files, never hardcoded in components
- Maintain consistency between `chapters.js` metadata and `fullChapters.js` content
- Use atomic commits for content updates: "Add chapter X content", "Fix rendering in section Y"

### Component Patterns
- Follow existing JSX style: `className="btn-primary disabled:opacity-50"`
- Use Tailwind's navy/silver color palette for consistency
- Maintain responsive design patterns already established
- Keep components focused on presentation, business logic in utils/

### State Management
- Progress tracking uses LocalStorage via `storage.ts`
- Chapter progress includes: completion status, sections read, exercises completed, quiz scores
- Points and achievements calculated dynamically from stored progress

### Testing Workflow
1. `npm run dev` - Start development server
2. Navigate through chapters to verify:
   - Content renders correctly with formatting
   - Progress tracking works
   - Exercises and quizzes function
   - AI Coach contextual responses
   - Focus mode toggle
3. `npm run build && npm run preview` - Test production build

## Deployment

### Local Hosting
- Uses PM2 for process management
- Serves on port 3000 with host 0.0.0.0
- Configuration in `ecosystem.config.cjs`

### Cloudflare Pages
- Configuration in `wrangler.jsonc`
- Build output in `./dist`
- Supports nodejs compatibility flags

## Future Enhancements

### Planned Features
- Dark mode toggle (extend Tailwind config + localStorage persistence)
- Search across all chapters
- Bookmarking system for sections
- PDF export functionality
- Content automation scripts for DOCX ingestion

### Content Pipeline
- Consider building automated DOCX → fullChapters.js conversion
- Potential script location: `/scripts/syncContent.js`
- Integration with build process for content updates

## Common Development Tasks

### Adding New Chapter Content
1. Extract content from corresponding DOCX file in `/content/`
2. Format according to guidelines in `CONTENT_UPDATE_GUIDE.md`
3. Add to `src/data/fullChapters.js` using chapter ID from `chapters.js`
4. Test rendering in ChapterView component
5. Verify progress tracking and AI Coach context

### Debugging Content Issues
- Check console for React rendering errors
- Verify markdown formatting in ChapterContent component
- Ensure chapter IDs match between data files
- Test content with different viewport sizes

### Performance Considerations
- Content is loaded on-demand per chapter
- LocalStorage used for progress persistence
- Consider lazy loading for large content sections
- Monitor bundle size as content grows

---

**Repository**: https://github.com/Drfiya/Playbook  
**Maintainer**: Dr. Lutfiya Miller, Ph.D., DABT  
**Framework**: React 18 + Vite + Tailwind CSS  
**Last Updated**: November 2025