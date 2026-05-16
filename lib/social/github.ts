export async function getGithubProfile(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 },
      headers: {
        // Optional: add Authorization header if you have GitHub token for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    })
    return res.json()
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error)
    return null
  }
}

export async function getGithubRepos(username: string, limit = 6) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&order=desc&per_page=${limit}&type=all`,
      {
        next: { revalidate: 3600 },
        headers: {
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    )
    return res.json()
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error)
    return []
  }
}

export async function getGithubUserData(username: string) {
  const profile = await getGithubProfile(username)
  const repos = await getGithubRepos(username, 6)

  return {
    profile,
    repos: Array.isArray(repos) ? repos : [],
  }
}