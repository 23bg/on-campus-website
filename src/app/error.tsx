'use client'
import { clientLogger } from '@/lib/clientLogger'

type ErrorLike = { message?: string; stack?: string } | string | unknown;

const normalizeError = (err: ErrorLike) => {
  if (typeof err === 'string') {
    return { message: err, stack: undefined };
  }

  if (err && typeof err === 'object') {
    const obj = err as { message?: string; stack?: string };
    return {
      message: obj.message ?? JSON.stringify(obj, Object.getOwnPropertyNames(obj)) ?? 'Unknown error',
      stack: obj.stack,
    };
  }

  return { message: 'Unknown error', stack: undefined };
};

export default function GlobalError({ error, reset }: { error: unknown; reset: () => void }) {
  const normalized = normalizeError(error);
  if (error instanceof Error) {
    console.error(error.message, error.stack);
  } else {
    console.error(JSON.stringify(error));
  }
  clientLogger.error('global_error', normalized);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-destructive">Something went wrong</h1>
      <p className="text-muted-foreground">{normalized.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  )
}

