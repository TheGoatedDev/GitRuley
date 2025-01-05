'use server';

import { auth } from '@/shared/auth';
import type { GHOrganisation } from '@/types/github';

export const getAllGHOrganisations = async () => {
    const session = await auth();

    if (!session?.user?.name) {
        return [];
    }

    // First get the user's profile to include as an "organization"
    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    const user = await userResponse.json();
    const userAsOrg: GHOrganisation = {
        id: user.id,
        login: user.login,
        url: user.url,
        avatar_url: user.avatar_url,
    };

    // Then get actual organizations
    const orgsResponse = await fetch('https://api.github.com/user/orgs', {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    const orgs = (await orgsResponse.json()) as GHOrganisation[];

    // Return user first, then organizations
    return [userAsOrg, ...orgs];
};
