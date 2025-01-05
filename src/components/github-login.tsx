'use client';

import { Github } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from './ui/button';

export const GithubLogin = () => {
    return (
        <Button variant="outline" onClick={() => signIn('github')}>
            <Github className="w-4 h-4" />
            Login with Github
        </Button>
    );
};
