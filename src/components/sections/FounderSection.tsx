import Image from "next/image";

export default function FounderSection() {
  return (
    <section
      id="founder"
      className="py-20 border-b border-[rgba(201,169,110,0.15)] bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 md:gap-16 items-start reveal-on-scroll">

          {/* Photo */}
          <div className="card-premium aspect-[3/4] relative overflow-hidden">
            <div className="absolute inset-4 border border-[rgba(201,169,110,0.2)] z-10 pointer-events-none" />

            <Image
              src="/img/julio-alvarez.jpeg"
              alt="Julio Alvarez"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>

          {/* Content */}
          <div className="pt-2">
            <span className="badge-premium mb-4 inline-block">
              Founder
            </span>

            <h2 className="text-4xl md:text-6xl font-serif font-light text-white leading-none mb-3">
              Julio Alvarez
            </h2>

            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-8">
              FABRIC · Oracle Critical Engineering
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
              20+ años en arquitectura Oracle, ERP empresarial y transformación
              de operaciones críticas. Liderando implementaciones complejas en
              México con expansión operativa hacia USA.
            </p>

            <div className="card-premium p-5 max-w-2xl">
              <p className="text-zinc-500 text-sm italic leading-relaxed border-l border-accent pl-4">
                Equipo senior bajo NDA hasta el primer engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}