export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // For now, return mock data since Instagram API requires authentication
    // In production, configure INSTAGRAM_ACCESS_TOKEN environment variable
    const data = {
      profile: {
        username,
        name: username,
        followers_count: 5000,
        media_count: 100,
      },
      posts: [],
    }
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch Instagram data' },
      { status: 500 }
    )
  }
}
