'use server';

import { auth } from '@/shared/auth';
import type { GHRuleset } from '@/types/github';

export const getRepositoryRulesets = async (owner: string, repo: string) => {
    const session = await auth();

    if (!session) {
        return [];
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/rulesets`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch rulesets: ${response.statusText}`);
    }

    const rulesets = (await response.json()) as GHRuleset[];
    return rulesets;
};
