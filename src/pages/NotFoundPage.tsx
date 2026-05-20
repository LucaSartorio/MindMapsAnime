import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';

export function NotFoundPage() {
  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ember-300">
          404
        </p>
        <h1 className="font-display text-3xl text-ink-100">Pagina non trovata</h1>
        <p className="text-sm text-ink-300">
          La risorsa che cercavi non esiste. Forse il mondo che stai cercando
          è ancora in arrivo?
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Torna alla homepage
        </Link>
      </Card>
    </div>
  );
}
