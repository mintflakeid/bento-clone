// Dribbble API integration
// Requires DRIBBBLE_ACCESS_TOKEN environment variable

export async function getDribbbleUser(username: string) {
  try {
    const res = await fetch(`https://api.dribbble.com/v2/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.DRIBBBLE_ACCESS_TOKEN || ""}`,
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return { user: null, shots: [] }
    }

    return res.json()
  } catch (error) {
    console.error("Failed to fetch Dribbble user:", error)
    return { user: null, shots: [] }
  }
}

export async function getDribbbleShots(username: string, limit = 6) {
  try {
    const res = await fetch(
      `https://api.dribbble.com/v2/users/${username}/shots?per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.DRIBBBLE_ACCESS_TOKEN || ""}`,
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      return []
    }

    return res.json()
  } catch (error) {
    console.error("Failed to fetch Dribbble shots:", error)
    return []
  }
}

export async function getDribbbleUserData(username: string) {
  const user = await getDribbbleUser(username)
  const shots = await getDribbbleShots(username, 6)

  return {
    user,
    shots: Array.isArray(shots) ? shots : [],
  }
}
