"use client";

interface CartErrorDisplayProps {
    error: string | null;
    onDismiss: () => void;
    mobile?: boolean;
}

export function CartErrorDisplay({ error, onDismiss, mobile = false }: CartErrorDisplayProps) {
    if (!error) return null;

    if (mobile) {
        return (
            <div className="bg-red-50 border border-red-200 p-3 text-sm text-center mx-4 mb-2 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={onDismiss}
                    className="text-red-500 underline mt-1 text-xs"
                    aria-label="Dismiss error"
                >
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 p-3 text-sm text-center">
            <p className="text-red-600">{error}</p>
            <button
                onClick={onDismiss}
                className="text-red-500 underline mt-1"
                aria-label="Dismiss error"
            >
                Dismiss
            </button>
        </div>
    );
}

