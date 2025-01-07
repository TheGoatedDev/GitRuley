'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface JsonUploadProps {
    onJsonLoaded: (json: unknown) => void;
    className?: string;
}

export function JsonUpload({ onJsonLoaded, className }: JsonUploadProps) {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.name.endsWith('.json')) {
            setError('Please select a JSON file');
            return;
        }

        try {
            const text = await file.text();
            const json = JSON.parse(text);
            onJsonLoaded(json);
        } catch (err) {
            setError('Invalid JSON file');
            console.error('Error parsing JSON:', err);
        }

        // Reset the input
        event.target.value = '';
    };

    return (
        <div className={className}>
            <div className="flex items-center gap-4">
                <Input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                <Button
                    variant="outline"
                    onClick={() =>
                        document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
                    }
                >
                    Upload JSON
                </Button>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
    );
}
