'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import type { ComponentPropsWithoutRef } from 'react';

export function LogoutButton(props: ComponentPropsWithoutRef<typeof Button>) {
    return (
        <Button variant="outline" onClick={() => signOut()} {...props}>
            Logout
        </Button>
    );
}
