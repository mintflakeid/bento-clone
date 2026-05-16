export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // For now, return mock data since Dribbble API requires authentication
    // In production, configure DRIBBBLE_ACCESS_TOKEN environment variable
    const data = {
      user: {
        username,
        name: username,
        shots_count: 48,
      },
      shots: [],
    }
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch Dribbble data' },
      { status: 500 }
    )
  }
}
