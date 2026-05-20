export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Strato grafico decorativo */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg opacity-40 animate-drift"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/40 to-ink-950"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 sm:pt-32 sm:pb-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-chakra-300 mb-4">
          atlante interattivo · anime &amp; manga
        </p>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-ink-100 leading-tight">
          Anime Interactive Maps
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-ink-200 max-w-2xl mx-auto leading-relaxed">
          Esplora i mondi dei tuoi anime e manga preferiti attraverso{' '}
          <span className="text-chakra-300">mappe interattive</span>,{' '}
          <span className="text-ember-300">timeline</span>, personaggi, archi
          narrativi e <span className="text-scroll-200">percorsi</span>.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <span className="chip">React Flow</span>
          <span className="chip-accent">Zero backend</span>
          <span className="chip-ember">Estendibile</span>
          <span className="chip">Multi-mondo</span>
        </div>
      </div>
    </section>
  );
}
