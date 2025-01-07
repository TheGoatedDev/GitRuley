'use server';

import { auth } from '@/shared/auth';
import { getRepositoryRulesets } from './getRepositoryRulesets';

export const deleteRepositoryRulesets = async (owner: string, repo: string) => {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error('Not authenticated');
    }

    // First get all rulesets
    const rulesets = await getRepositoryRulesets(owner, repo);

    // Delete each ruleset
    await Promise.all(
        rulesets.map(async (ruleset) => {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/rulesets/${ruleset.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        Accept: 'application/vnd.github.v3+json',
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                }
            );

            if (!response.ok && response.status !== 404) {
                throw new Error(
                    `Failed to delete ruleset ${ruleset.id}: ${response.status} ${response.statusText}`
                );
            }
        })
    );

    return rulesets.length;
};
