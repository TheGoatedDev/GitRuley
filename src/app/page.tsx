import { getAllGHOrganisations } from '@/actions/getAllOrganisations';
import { GithubLogin } from '@/components/github-login';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/shared/auth';
import Link from 'next/link';

export default async function Home() {
    const session = await auth();

    if (!session) {
        return (
            <div className="flex flex-col justify-center items-center h-full gap-4">
                <h1 className="text-2xl font-bold">GitRuley</h1>
                <p className="text-sm text-muted-foreground">
                    GitRuley is a platform for managing github repositories rulesets
                </p>
                <GithubLogin />
            </div>
        );
    }

    const organisations = await getAllGHOrganisations();

    return (
        <div className="h-full">
            <h1 className="text-2xl font-bold mb-4">Select an organisation</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {organisations.map((org) => (
                    <Card key={org.id}>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Avatar>
                                <AvatarImage src={org.avatar_url} />
                                <AvatarFallback>{org.login.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{org.login}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" asChild>
                                <Link href={`/${org.login}`}>Select</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
