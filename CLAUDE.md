# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Dr. Lutfiya Miller's AI Consulting Playbook** - an interactive learning platform that transforms 14 chapters of AI consulting wisdom into an immersive self-paced learning experience. Each chapter combines written content, exercises, quizzes, reflections, and an AI mentor.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally (uses wrangler pages dev)
- `npm run deploy` - Build and deploy to Cloudflare Pages (runs build + wrangler pages deploy)
- `npm run cf-typegen` - Generate Cloudflare TypeScript types

**Note**: No lint, test, or typecheck commands are configured in package.json

### Process Management (PM2)
- `pm2 start ecosystem.config.cjs` - Start the application
- `pm2 restart ai-playbook` - Restart the application
- `pm2 logs ai-playbook` - View application logs
- `pm2 status` - Check PM2 status

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript/JavaScript (mixed) + Vite 6
- **Styling**: Tailwind CSS 3.4 with custom theme (navy/silver palette) 
- **State Management**: React hooks + LocalStorage + Context (ThemeContext)
- **Backend**: Hono framework (minimal setup, configured for SSR in tsconfig.json)
- **Deployment**: Cloudflare Pages (wrangler) + PM2 for local hosting
- **Content**: Markdown-style formatting in JavaScript modules
- **Build Tools**: Vite with React plugin, PostCSS, Autoprefixer
- **Video**: Loom integration for chapter videos
- **TypeScript**: Configured with strict mode, ESNext target, Hono JSX source

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
- `Navigation.jsx` - Top navigation component
- `LoomVideoPlayer.jsx` - Embedded Loom video player for chapter videos
- `ThemeContext.jsx` - Dark/light theme management context

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

### Primary Task: Complete Remaining Chapter Content
The main development focus is migrating remaining content from `/content/*.docx` files into `src/data/fullChapters.js`.

**Current Status**:
- Chapters 1-11: ✅ Fully integrated (comprehensive content with video URLs)  
- Chapters 12-14: ⏳ Awaiting content extraction from `/content/*.docx` files

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

**Content Guidelines** (see `CONTENT_UPDATE_GUIDE.md` for detailed formatting):
- Extract content from DOCX/PDF files in `/content/` directory
- Maintain formatting integrity (headers, lists, callouts, emphasis)
- Match section titles with `chapters.js` metadata
- Use markdown-style syntax for consistent rendering

## File Structure

```
├── content/                    # Source DOCX/PDF files (14 chapters)
├── src/
│   ├── data/
│   │   ├── chapters.js        # Chapter metadata and structure
│   │   ├── fullChapters.js    # Complete chapter content
│   │   └── chapters.ts        # TypeScript type definitions
│   ├── components/            # React components
│   │   ├── ChapterContent.jsx # Markdown-style content renderer
│   │   ├── ChapterView.jsx    # Individual chapter display
│   │   ├── Dashboard.jsx      # Chapter overview and progress
│   │   └── ProgressTracker.jsx # Sidebar navigation and progress
│   ├── utils/
│   │   ├── storage.ts         # LocalStorage progress tracking
│   │   └── aiCoach.ts         # AI Coach functionality
│   └── App.jsx               # Main application shell
├── public/static/            # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind customization
├── wrangler.jsonc           # Cloudflare Pages configuration
├── ecosystem.config.cjs     # PM2 process configuration
├── CONTENT_UPDATE_GUIDE.md  # Detailed content formatting guide
└── GITHUB_WORKFLOW.md       # GitHub workflow documentation
```

## Development Guidelines

### Content Management
- All chapter content should be stored in data files, never hardcoded in components
- Maintain consistency between `chapters.js` metadata and `fullChapters.js` content
- Each chapter includes Loom video URL in `chapters.js` for embedded video playback
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

**Note**: No automated test suite is configured. Manual testing is the current approach.

## Deployment

### Local Hosting
- Uses PM2 for process management (`ecosystem.config.cjs`)
- Serves on port 3000 with host 0.0.0.0
- Command: `pm2 start ecosystem.config.cjs`
- Preview mode runs via `npx vite preview --host 0.0.0.0 --port 3000`

### Cloudflare Pages
- Configuration in `wrangler.jsonc`
- Build output in `./dist`
- Uses wrangler pages for deployment and local preview
- Supports nodejs compatibility flags
- Vite config includes allowed hosts for sandbox deployment

## Future Enhancements

### Planned Features
- Dark mode toggle (ThemeContext already implemented, needs UI toggle)
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
1. Extract content from corresponding DOCX/PDF file in `/content/`
2. Format according to guidelines in `CONTENT_UPDATE_GUIDE.md`
3. Add to `src/data/fullChapters.js` using chapter ID from `chapters.js`
4. Test rendering: `npm run dev` and navigate to the chapter
5. Verify formatting, progress tracking, and AI Coach context

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
**Framework**: React 19 + Vite 6 + Tailwind CSS 3.4  
**Last Updated**: November 2025  
**Recent Progress**: Chapters 1-11 fully integrated (as of latest commits)