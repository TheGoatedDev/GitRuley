'use client';

import { createRepositoryRuleset } from '@/actions/createRepositoryRuleset';
import { deleteRepositoryRulesets } from '@/actions/deleteRepositoryRulesets';
import { getOrganisationRepos } from '@/actions/getOrganisationRepos';
import { JsonUpload } from '@/components/json-upload';
import { Button } from '@/components/ui/button';
import type { GHRepository, GHRuleset } from '@/types/github';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RepositoryCard } from './repository-card';

interface RepositoryListProps {
    organisation: string;
}

type RulesetConfig = Omit<GHRuleset, 'id' | 'created_at' | 'updated_at' | 'url' | 'node_id'>;

export function RepositoryList({ organisation }: RepositoryListProps) {
    const [repositories, setRepositories] = useState<GHRepository[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [rulesetJson, setRulesetJson] = useState<RulesetConfig | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadRepositories = useCallback(async () => {
        setIsLoading(true);
        try {
            const repos = await getOrganisationRepos(organisation);
            setRepositories(repos);
        } catch (error) {
            console.error('Failed to fetch repositories:', error);
            toast.error('Failed to fetch repositories');
        } finally {
            setIsLoading(false);
        }
    }, [organisation]);

    useEffect(() => {
        loadRepositories();
    }, [loadRepositories]);

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

    const toggleSelectAll = () => {
        if (selectedRepos.size === repositories.length) {
            // If all are selected, deselect all
            setSelectedRepos(new Set());
        } else {
            // Otherwise, select all
            setSelectedRepos(new Set(repositories.map((repo) => repo.id)));
        }
    };

    const handleJsonLoaded = (json: unknown) => {
        // Validate the JSON structure
        if (
            typeof json !== 'object' ||
            !json ||
            !('name' in json) ||
            !('target' in json) ||
            !('enforcement' in json) ||
            !('rules' in json)
        ) {
            toast.error('Invalid JSON');
            return;
        }

        setRulesetJson(json as RulesetConfig);
        toast.success('Ruleset configuration loaded successfully');
    };

    const deleteAllRulesets = async () => {
        if (selectedRepos.size === 0) {
            toast.error('Please select repositories to remove rulesets from');
            return;
        }

        setIsDeleting(true);
        const selectedRepositories = repositories.filter((repo) => selectedRepos.has(repo.id));
        const errors: string[] = [];
        let totalDeleted = 0;

        try {
            const results = await Promise.all(
                selectedRepositories.map(async (repo) => {
                    try {
                        const count = await deleteRepositoryRulesets(organisation, repo.name);
                        totalDeleted += count;
                        return { repo, success: true, count };
                    } catch (error) {
                        errors.push(`${repo.name}: ${(error as Error).message}`);
                        return { repo, success: false, count: 0 };
                    }
                })
            );

            if (errors.length > 0) {
                toast.error(
                    `Failed to remove rulesets from some repositories: ${errors.join(', ')}`
                );
            } else {
                toast.success(
                    `Successfully removed ${totalDeleted} ruleset${
                        totalDeleted === 1 ? '' : 's'
                    } from ${selectedRepositories.length} repositories`
                );
            }

            // Reload repositories to reflect changes
            await loadRepositories();
        } catch (error) {
            toast.error('Failed to remove rulesets');
        } finally {
            setIsDeleting(false);
        }
    };

    const applyRulesetToSelectedRepos = async () => {
        if (!rulesetJson || selectedRepos.size === 0) {
            toast.error('Please select repositories and upload a ruleset configuration');
            return;
        }

        setIsApplying(true);
        const selectedRepositories = repositories.filter((repo) => selectedRepos.has(repo.id));
        const errors: string[] = [];

        try {
            await Promise.all(
                selectedRepositories.map(async (repo) => {
                    try {
                        await createRepositoryRuleset(organisation, repo.name, rulesetJson);
                    } catch (error) {
                        errors.push(`${repo.name}: ${(error as Error).message}`);
                    }
                })
            );

            if (errors.length > 0) {
                toast.error(`Failed to apply ruleset to some repositories: ${errors.join(', ')}`);
            } else {
                toast.success(`Ruleset applied to ${selectedRepositories.length} repositories`);
            }

            // Reload repositories to reflect changes
            await loadRepositories();
        } catch (error) {
            toast.error('Failed to apply rulesets');
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return <div>Loading repositories...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Organisation: {organisation}</h1>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={toggleSelectAll} className="min-w-[120px]">
                        {selectedRepos.size === repositories.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        {selectedRepos.size} repositories selected
                    </div>
                    <JsonUpload onJsonLoaded={handleJsonLoaded} className="inline-block" />
                    <Button
                        onClick={applyRulesetToSelectedRepos}
                        disabled={selectedRepos.size === 0 || !rulesetJson || isApplying}
                    >
                        {isApplying ? 'Applying...' : 'Apply Ruleset'}
                    </Button>
                    <Button
                        onClick={deleteAllRulesets}
                        disabled={selectedRepos.size === 0 || isDeleting}
                        variant="destructive"
                    >
                        {isDeleting ? 'Removing...' : 'Remove All Rulesets'}
                    </Button>
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
