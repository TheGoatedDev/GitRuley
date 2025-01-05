'use client';

import { getOrganisationRepos } from '@/actions/getOrganisationRepos';
import type { GHRepository } from '@/types/github';
import { useEffect, useState } from 'react';
import { RepositoryCard } from './repository-card';

interface RepositoryListProps {
    organisation: string;
}

export function RepositoryList({ organisation }: RepositoryListProps) {
    const [repositories, setRepositories] = useState<GHRepository[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            setIsLoading(true);
            try {
                const repos = await getOrganisationRepos(organisation);
                setRepositories(repos);
            } catch (error) {
                console.error('Failed to fetch repositories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepos();
    }, [organisation]);

    const handleRepoSelect = (repoId: number, isSelected: boolean) => {
        setSelectedRepos((prev) => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(repoId);
            } else {
                newSet.delete(repoId);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return <div>Loading repositories...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Organisation: {organisation}</h1>
                <div className="text-sm text-muted-foreground">
                    {selectedRepos.size} repositories selected
                </div>
            </div>
            <div className="space-y-4">
                {repositories.map((repo) => (
                    <RepositoryCard
                        key={repo.id}
                        organisation={organisation}
                        repo={repo}
                        isSelected={selectedRepos.has(repo.id)}
                        onSelectChange={(isSelected) => handleRepoSelect(repo.id, isSelected)}
                    />
                ))}
            </div>
        </div>
    );
}
