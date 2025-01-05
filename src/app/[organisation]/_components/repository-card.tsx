'use client';

import { getRepositoryRulesets } from '@/actions/getRepositoryRulesets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { GHRepository, GHRuleset } from '@/types/github';
import { useEffect, useState } from 'react';

interface RepositoryCardProps {
    organisation: string;
    repo: GHRepository;
    isSelected: boolean;
    onSelectChange: (isSelected: boolean) => void;
}

export function RepositoryCard({
    organisation,
    repo,
    isSelected,
    onSelectChange,
}: RepositoryCardProps) {
    const [ruleSets, setRuleSets] = useState<GHRuleset[]>([]);

    useEffect(() => {
        const fetchRuleSets = async () => {
            const sets = await getRepositoryRulesets(organisation, repo.name);
            setRuleSets(sets);
        };
        fetchRuleSets();
    }, [organisation, repo.name]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelectChange}
                    id={`repo-${repo.id}`}
                />
                <CardTitle>{repo.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>RuleSet Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Enforcement</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ruleSets.map((ruleSet) => (
                            <TableRow key={ruleSet.id}>
                                <TableCell>{ruleSet.name}</TableCell>
                                <TableCell>{ruleSet.id}</TableCell>
                                <TableCell>{ruleSet.target}</TableCell>
                                <TableCell>{ruleSet.enforcement}</TableCell>
                                <TableCell>{ruleSet.created_at}</TableCell>
                                <TableCell>{ruleSet.updated_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
