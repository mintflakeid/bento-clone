import { getGithubUserData } from '@/lib/social/github'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const data = await getGithubUserData(username)
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
