export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get('channelId')
  const username = searchParams.get('username')

  if (!channelId && !username) {
    return Response.json(
      { error: 'Channel ID or username is required' },
      { status: 400 }
    )
  }

  try {
    // For now, return mock data since YouTube API requires authentication
    // In production, configure YOUTUBE_API_KEY environment variable
    const data = {
      channel: {
        snippet: {
          title: username,
          description: 'YouTube Channel',
        },
        statistics: {
          subscriberCount: '12500',
          videoCount: '150',
        },
      },
      videos: [],
    }
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch YouTube data' },
      { status: 500 }
    )
  }
}
