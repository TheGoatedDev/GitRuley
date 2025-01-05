import type {
    ExpandedState,
    GHOrganisation,
    GHRepository,
    GHRuleset,
    RepositoryRecord,
    SelectedRulesets,
} from './github';

/**
 * Props for the main organization repositories list component
 */
export interface OrgReposListProps {
    /** List of organizations and personal account */
    organisations: GHOrganisation[];
}

/**
 * Props for the organization sidebar component
 */
export interface OrgSidebarProps {
    /** List of organizations and personal account */
    organisations: GHOrganisation[];
    /** Currently selected organization login */
    selectedOrg: string | null;
    /** Callback when an organization is selected */
    onOrgSelect: (orgLogin: string) => void;
}

/**
 * Props for the repository table component
 */
export interface RepoTableProps {
    /** List of repositories for the selected organization */
    repos: GHRepository[];
    /** Map of repository full names to their rulesets */
    rulesets: RepositoryRecord<GHRuleset[]>;
    /** Map of repository full names to their expanded state */
    expandedRows: ExpandedState;
    /** Map of repository full names to their selected ruleset IDs */
    selectedRulesets: SelectedRulesets;
    /** Callback when a repository's expanded state is toggled */
    onExpandToggle: (repoFullName: string) => void;
    /** Callback when a ruleset is selected or deselected */
    onRulesetSelect: (repoFullName: string, rulesetId: number) => void;
}

/**
 * Props for the ruleset table component
 */
export interface RulesetTableProps {
    /** List of rulesets for a specific repository */
    rulesets: GHRuleset[];
    /** Full name of the repository (owner/name) */
    repoFullName: string;
    /** List of selected ruleset IDs */
    selectedRulesets: number[];
    /** Callback when a ruleset is selected or deselected */
    onRulesetSelect: (rulesetId: number) => void;
}
