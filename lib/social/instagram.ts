// Fetch Instagram profile and posts using Instagram Graph API
// Requires INSTAGRAM_ACCESS_TOKEN environment variable

export async function getInstagramUser(username: string) {

  // Try using Graph API if token is available
  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    try {
      const userRes = await fetch(
        `https://graph.instagram.com/me?fields=id,username,name,biography,website,profile_picture_url,followers_count,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
        { next: { revalidate: 3600 } }
      )

      if (userRes.ok) {
        const userData = await userRes.json()
        const mediaRes = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&limit=9&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
          { next: { revalidate: 3600 } }
        )

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json()
          return {
            profile: userData,
            posts: mediaData.data || [],
          }
        }
      }
    } catch (error) {
      console.error("Instagram Graph API error:", error)
    }
  }

  // Fallback: Return data with embed URL for public profile
  return {
    profile: {
      id: username,
      username,
      name: username,
      biography: "Instagram Creator",
      followers_count: "Visit profile",
      media_count: "View posts",
      profile_picture_url: `https://www.instagram.com/${username}/profilepicture/?size=large`,
    },
    posts: [],
    embedUrl: `https://www.instagram.com/${username}/`,
  }
    // Search user by username
    const searchRes = await fetch(
      `https://graph.instagram.com/ig_hashtag_search?user_id=${process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}&fields=id,name&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      {
        next: { revalidate: 3600 },
      }
    )

    // Get user info and media
    const userRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,name,biography,website,profile_picture_url,followers_count,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      {
        next: { revalidate: 3600 },
      }
    )

    const userData = await userRes.json()

    if (!userData.id) {
      return { profile: null, posts: [] }
    }

    // Get media
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&limit=9&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      {
        next: { revalidate: 3600 },
      }
    )

    const mediaData = await mediaRes.json()

    return {
      profile: userData,
      posts: mediaData.data || [],
    }
  } catch (error) {
    console.error("Failed to fetch Instagram data:", error)
    return { profile: null, posts: [] }
  }
}

// Use oEmbed for Instagram posts
export async function getInstagramOEmbed(postUrl: string) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      {
        next: { revalidate: 86400 },
      }
    )
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch Instagram oEmbed:", error)
    return null
  }
}
