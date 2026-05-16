# Bento Clone

A modern "link in bio" dashboard inspired by [Bento.me](https://bento.me). Built with Next.js, React, and Tailwind CSS, featuring a draggable Bento grid layout with real social media integrations.

## Features

- 🎨 **Draggable Bento Grid** - Customize your layout with drag-and-drop functionality
- 📱 **Social Media Cards** - Display content from:
  - GitHub repositories
  - YouTube videos
  - Instagram posts
  - Twitter/X tweets
  - Dribbble shots
- 💾 **Local Storage Persistence** - Save your custom layout automatically
- 🎯 **Responsive Design** - Works on mobile and desktop
- ⚡ **Real-time Updates** - Fetch live data from social platforms
- 🎭 **Multiple Card Modes** - Small, Wide, Tall, Large layouts

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Grid Layout**: [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **Language**: TypeScript
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bento-clone.git
cd bento-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your Bento dashboard.

## Configuration

### Social Media APIs

To display real content from social platforms, add your API credentials to `.env.local`:

```bash
# GitHub (optional - works without API key)
GITHUB_TOKEN=your_github_token

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key

# Instagram
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id

# Twitter/X
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Dribbble
DRIBBBLE_ACCESS_TOKEN=your_dribbble_token
```

See [SOCIAL_API_SETUP.md](SOCIAL_API_SETUP.md) for detailed setup instructions for each platform.

## Project Structure

```
app/
├── api/social/          # API routes for fetching social data
├── layout.tsx          # Root layout with global styles
├── page.tsx            # Main dashboard page
└── globals.css         # Global Tailwind styles

components/
├── BentoGrid.tsx       # Main grid layout component
└── cards/
    └── SocialCard.tsx  # Reusable social media card

hooks/
├── useLocalStorageState.ts  # Custom hook for localStorage
└── useSocialData.ts        # Hook for fetching social data

lib/social/
├── github.ts           # GitHub API integration
├── twitter.ts          # Twitter API integration
├── instagram.ts        # Instagram API integration
├── youtube.ts          # YouTube API integration
└── dribbble.ts         # Dribbble API integration
```

## Usage

1. **Customize Profile** - Edit your name and bio at the top
2. **Upload Avatar** - Click the avatar area to upload a profile picture
3. **Drag Cards** - Reorder cards by dragging them around
4. **Resize Layout** - Use the preset buttons (Small, Wide, Tall, Large) to change card sizes
5. **Add Social Accounts** - Update the handles in `BentoGrid.tsx` with your social media usernames

## Development

```bash
# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by [Bento.me](https://bento.me)
- Grid layout powered by [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
