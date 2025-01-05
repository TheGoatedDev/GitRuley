import { auth } from '@/shared/auth';
import { redirect } from 'next/navigation';
import { RepositoryList } from './_components/repository-list';

export default async function Home({ params }: { params: { organisation: string } }) {
    const session = await auth();
    const { organisation } = params;

    if (!session) {
        return redirect('/');
    }

    return (
        <div className="h-full">
            <RepositoryList organisation={organisation} />
        </div>
    );
}
