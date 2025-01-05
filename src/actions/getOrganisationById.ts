'use server';

import { auth } from '@/shared/auth';
import type { GHOrganisation } from '@/types/github';

export const getOrganisationById = async (orgId: number) => {
    const session = await auth();

    if (!session?.accessToken) {
        return null;
    }

    const response = await fetch(`https://api.github.com/organizations/${orgId}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`Failed to fetch organization: ${response.statusText}`);
    }

    const org = (await response.json()) as GHOrganisation;
    return org;
};
