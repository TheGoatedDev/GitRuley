'use server';

import { auth } from '@/shared/auth';
import type { GHRuleset } from '@/types/github';

interface CreateRulesetPayload {
    name: string;
    target: string;
    enforcement: string;
    bypass_actors?: Array<{
        actor_id: number;
        actor_type: string;
        bypass_mode: string;
    }>;
    conditions?: {
        ref_name?: {
            include: string[];
            exclude: string[];
        };
        repository_name?: {
            include: string[];
            exclude: string[];
        };
    };
    rules: Array<{
        type: string;
        parameters?: Record<string, unknown>;
    }>;
}

export const createRepositoryRuleset = async (
    owner: string,
    repo: string,
    ruleset: CreateRulesetPayload
) => {
    const session = await auth();

    if (!session?.accessToken) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/rulesets`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify(ruleset),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create ruleset: ${response.status} ${errorText}`);
    }

    const createdRuleset = (await response.json()) as GHRuleset;
    return createdRuleset;
};
