# Real Social Content Integration

This Bento clone now supports fetching real content from social media platforms. The cards will display actual posts, videos, and repository data from the respective platforms.

## Supported Platforms

- **GitHub** - Fetch user repositories and profile data
- **YouTube** - Fetch channel info and video thumbnails  
- **Instagram** - Fetch posts (requires API access)
- **Twitter/X** - Fetch tweets (requires API access)
- **Dribbble** - Fetch design shots (requires API access)

## Setup Instructions

### GitHub (No authentication required for public data)

GitHub integration works out of the box. It will fetch:
- User public repositories
- Repository counts and stars
- Public profile information

To increase rate limits, add a personal access token:

1. Go to https://github.com/settings/tokens
2. Create a new "Fine-grained personal access token"
3. Add to `.env.local`:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

### YouTube (Requires API Key)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the YouTube Data API v3
4. Create an API key (Credentials → Create API key)
5. Add to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

### Instagram (Requires Graph API Access)

1. Go to https://developers.facebook.com/
2. Create a Meta app
3. Add Instagram Graph API product
4. Get an access token and business account ID
5. Add to `.env.local`:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here
   ```

### Twitter/X (Requires API v2)

1. Go to https://developer.twitter.com/
2. Apply for API access
3. Get your Bearer Token from the API keys page
4. Add to `.env.local`:
   ```
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

### Dribbble (Requires Access Token)

1. Go to https://dribbble.com/account/applications
2. Create a new app
3. Get your access token
4. Add to `.env.local`:
   ```
   DRIBBBLE_ACCESS_TOKEN=your_access_token_here
   ```

## How It Works

1. Each social card component uses the `useSocialData` hook to fetch data
2. API routes in `/app/api/social/` handle the backend requests
3. Real content is fetched based on the user's handle/username
4. Images and metadata are dynamically updated when data loads
5. Fallback placeholder content is shown while loading

## File Structure

```
lib/social/
├── github.ts       # GitHub API functions
├── twitter.ts      # Twitter API functions
├── instagram.ts    # Instagram API functions
├── youtube.ts      # YouTube API functions
└── dribbble.ts     # Dribbble API functions

hooks/
└── useSocialData.ts  # Hook for fetching social data

app/api/social/
├── github/route.ts   # GitHub API endpoint
├── twitter/route.ts  # Twitter API endpoint
├── instagram/route.ts # Instagram API endpoint
├── youtube/route.ts  # YouTube API endpoint
└── dribbble/route.ts # Dribbble API endpoint

components/cards/
└── SocialCard.tsx    # Updated to use real data
```

## Testing

1. Copy `.env.example` to `.env.local`
2. Add your API keys for the platforms you want to test
3. Run the development server: `npm run dev`
4. The cards will automatically fetch and display real content

## Notes

- GitHub works immediately without API keys
- Other platforms require authentication
- API responses are cached per hour (configurable via `revalidate` in API files)
- If API keys are missing, fallback placeholder content is displayed
- Rate limits apply to all APIs - monitor your usage in developer dashboards
