import { getTwitterUser } from '@/lib/social/twitter'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // For now, return mock data since Twitter API requires authentication
    // In production, configure TWITTER_BEARER_TOKEN environment variable
    const data = {
      data: {
        username,
        name: username,
        followers_count: 1200,
      },
      tweets: [],
    }
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch Twitter data' },
      { status: 500 }
    )
  }
}
