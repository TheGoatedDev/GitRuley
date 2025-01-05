'use server';

import { auth } from '@/shared/auth';
import type { GHRepository } from '@/types/github';

export const getOrganisationRepos = async (orgName: string) => {
    const session = await auth();

    if (!session?.accessToken) {
        return [];
    }

    // Get user info to compare with orgName
    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    const user = await userResponse.json();

    // If orgName matches the user's login, fetch user's repos
    // Otherwise fetch organization repos
    const apiUrl =
        orgName === user.login
            ? 'https://api.github.com/user/repos?per_page=100'
            : `https://api.github.com/orgs/${orgName}/repos?per_page=100`;

    const response = await fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }

    const repos = (await response.json()) as GHRepository[];
    return repos.sort((a, b) => a.name.localeCompare(b.name));
};
