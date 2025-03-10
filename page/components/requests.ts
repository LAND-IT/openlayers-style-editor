export interface Contributor {
    id: number;
    avatar_url: string;
    html_url: string;
    login: string;
}

interface GitHubRelease {
    id: number;
    tag_name: string;
    name: string;
    published_at: string;
    html_url: string;
    body?: string;
}

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    updated_at: string;
    license?: {
        name: string;
        url: string;
    };
}

export interface RepoInfo {
    contributors: Contributor[];
    latestRelease: GitHubRelease;
    data: GitHubRepo;
}

export async function getContributorsAndLatestVersion(owner: string, repo: string): Promise<RepoInfo | undefined> {
    const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;
    const releasesUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;

    try {
        const [ contributorsResponse, releaseResponse, repoResponse] = await Promise.all([
            fetch(contributorsUrl),
            fetch(releasesUrl),
            fetch(repoUrl)
        ]);

        if (!repoResponse.ok) {
            throw new Error("Failed to fetch data");
        }

        const contributors = await contributorsResponse.json();
        const latestRelease = await (releaseResponse ? releaseResponse.json() : null);
        const data = await repoResponse.json();

        console.log("Data fetched:", data);

        return {contributors, latestRelease, data};
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
