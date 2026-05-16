// Fetch latest tweets from a user using Twitter API v2
// Requires TWITTER_BEARER_TOKEN environment variable
export async function getTwitterUser(username: string) {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    // Fallback: return mock data
    return {
      data: {
        username,
        name: "Twitter User",
        followers: "1.2K",
        public_metrics: { followers_count: 1200 },
      },
      tweets: [],
    }
  }

  try {
    // Get user info
    const userRes = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,description`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    )

    const userData = await userRes.json()

    if (!userData.data) {
      return { data: null, tweets: [] }
    }

    // Get user's tweets
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userData.data.id}/tweets?max_results=5&tweet.fields=public_metrics,created_at&expansions=author_id`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    )

    const tweetsData = await tweetsRes.json()

    return {
      data: userData.data,
      tweets: tweetsData.data || [],
    }
  } catch (error) {
    console.error("Failed to fetch Twitter data:", error)
    return { data: null, tweets: [] }
  }
}

// Use oEmbed to embed a tweet (client-side friendly)
export async function getTwitterOEmbed(tweetUrl: string) {
  try {
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}`,
      {
        next: { revalidate: 86400 },
      }
    )
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch Twitter oEmbed:", error)
    return null
  }
}
