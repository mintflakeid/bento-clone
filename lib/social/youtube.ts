// YouTube Data API integration
// Requires YOUTUBE_API_KEY environment variable

export async function getYoutubeChannel(channelId: string) {
  if (!process.env.YOUTUBE_API_KEY) {
    return {
      channel: null,
      videos: [],
    }
  }

  try {
    // Get channel info
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    )

    const channelData = await channelRes.json()

    if (!channelData.items || !channelData.items[0]) {
      return { channel: null, videos: [] }
    }

    const channel = channelData.items[0]

    // Get recent videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=6&type=video`,
      {
        next: { revalidate: 3600 },
      }
    )

    const videosData = await videosRes.json()

    return {
      channel,
      videos: videosData.items || [],
    }
  } catch (error) {
    console.error("Failed to fetch YouTube data:", error)
    return { channel: null, videos: [] }
  }
}

export async function getYoutubeVideoThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
