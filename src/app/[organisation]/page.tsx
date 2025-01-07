import { auth } from '@/shared/auth';
import { redirect } from 'next/navigation';
import { RepositoryList } from './_components/repository-list';

export default async function Home({ params }: { params: Promise<{ organisation: string }> }) {
    const session = await auth();
    const { organisation } = await params;

    if (!session) {
        return redirect('/');
    }

    return (
        <div className="h-full">
            <RepositoryList organisation={organisation} />
        </div>
    );
}
