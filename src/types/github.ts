/**
 * Common GitHub API response fields
 */
interface GHApiResponse {
    /** GitHub API URL for the resource */
    url?: string;
    /** GitHub API Node ID */
    node_id?: string;
    /** Creation timestamp */
    created_at?: string;
    /** Last update timestamp */
    updated_at?: string;
    /** HTML URL to the resource */
    html_url?: string;
}

/**
 * GitHub Organization or User
 */
export interface GHOrganisation extends GHApiResponse {
    id: number;
    /** Organization/User login name */
    login: string;
    /** Avatar URL */
    avatar_url: string;
    /** Organization/User display name */
    name?: string;
    /** Organization/User description */
    description?: string | null;
}

/**
 * Repository visibility status
 */
export type GHVisibility = 'public' | 'private' | 'internal';

/**
 * GitHub Repository
 */
export interface GHRepository extends GHApiResponse {
    id: number;
    /** Repository name without owner */
    name: string;
    /** Full repository name with owner (owner/name) */
    full_name: string;
    /** Repository description */
    description: string | null;
    /** Whether the repository is private */
    private: boolean;
    /** HTML URL to the repository */
    html_url: string;
    /** Repository visibility status */
    visibility: GHVisibility;
    /** Default branch name (e.g., main, master) */
    default_branch: string;
    /** Repository owner information */
    owner: Pick<GHOrganisation, 'id' | 'login' | 'avatar_url'>;
    /** Whether the repository is archived */
    archived: boolean;
    /** Whether the repository is disabled */
    disabled: boolean;
    /** Repository topics */
    topics: string[];
}

/**
 * Ruleset enforcement level
 */
export type GHRulesetEnforcement = 'disabled' | 'evaluate' | 'active';

/**
 * Ruleset target type
 */
export type GHRulesetTarget = 'branch' | 'tag';

/**
 * Ruleset bypass mode
 */
export type GHBypassMode = 'always' | 'pull_request';

/**
 * Ruleset bypass actor
 */
export interface GHBypassActor {
    /** Actor ID (user or team ID) */
    actor_id: number;
    /** Type of actor */
    actor_type: 'Team' | 'Integration' | 'User';
    /** Bypass mode configuration */
    bypass_mode: GHBypassMode;
}

/**
 * Ruleset conditions configuration
 */
export interface GHRulesetConditions {
    /** Branch name pattern conditions */
    ref_name?: {
        /** Patterns to include */
        include: string[];
        /** Patterns to exclude */
        exclude: string[];
    };
    /** Repository name pattern conditions */
    repository_name?: {
        /** Patterns to include */
        include: string[];
        /** Patterns to exclude */
        exclude: string[];
    };
}

/**
 * GitHub Repository Ruleset
 */
export interface GHRuleset extends GHApiResponse {
    id: number;
    /** Ruleset name */
    name: string;
    /** Target type (branch/tag) */
    target: GHRulesetTarget;
    /** Enforcement level */
    enforcement: GHRulesetEnforcement;
    /** Bypass configurations */
    bypass_actors: GHBypassActor[];
    /** Conditions for when the ruleset applies */
    conditions: GHRulesetConditions;
    /** Rules contained in the ruleset */
    rules: Array<{
        /** Rule type identifier */
        type: string;
        /** Rule-specific parameters */
        parameters?: Record<string, unknown>;
    }>;
}

/**
 * Utility type for records keyed by repository full name
 */
export type RepositoryRecord<T> = Record<string, T>;

/**
 * Utility type for repository expansion state
 */
export type ExpandedState = Record<string, boolean>;

/**
 * Utility type for selected ruleset IDs by repository
 */
export type SelectedRulesets = Record<string, number[]>;
