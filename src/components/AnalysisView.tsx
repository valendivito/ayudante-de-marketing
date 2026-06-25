import type { ReactNode } from "react";
import type { Analysis } from "@/lib/types";

const VEREDICTO_STYLES: Record<Analysis["potencial_viral"]["veredicto"], string> = {
  alto: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  medio: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  bajo: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function AnalysisView({ analysis }: { analysis: Analysis }) {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Resumen">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {analysis.resumen}
        </p>
      </Section>

      <Section title="Potencial viral">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${VEREDICTO_STYLES[analysis.potencial_viral.veredicto]}`}
          >
            {analysis.potencial_viral.veredicto}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {analysis.potencial_viral.puntaje}/10
          </span>
        </div>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
          {analysis.potencial_viral.motivos.map((motivo, i) => (
            <li key={i}>{motivo}</li>
          ))}
        </ul>
      </Section>

      <Section title="Gancho inicial (0-2s)">
        <Field label="Qué pasa">{analysis.gancho_inicial.que_pasa}</Field>
        <Field label="Evaluación">{analysis.gancho_inicial.evaluacion}</Field>
        <Field label="Sugerencia mejorada">{analysis.gancho_inicial.sugerencia_mejorada}</Field>
      </Section>

      <Section title="Retención">
        <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
          {analysis.retencion.tecnicas_usadas.map((tecnica, i) => (
            <li key={i}>{tecnica}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {analysis.retencion.justificacion}
        </p>
      </Section>

      {analysis.errores_a_corregir.length > 0 && (
        <Section title="Errores a corregir">
          <ul className="flex flex-col gap-3">
            {analysis.errores_a_corregir.map((err, i) => (
              <li key={i} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <span className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  {err.tipo}
                </span>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{err.problema}</p>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                  → {err.sugerencia}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Guion sugerido">
        <Field label="Hook (0-2s)">{analysis.guion_sugerido.hook_0_2s}</Field>
        <Field label="Desarrollo / retención">{analysis.guion_sugerido.desarrollo_retencion}</Field>
        <Field label="Por qué retiene">{analysis.guion_sugerido.justificacion_retencion}</Field>
        <Field label="CTA final">{analysis.guion_sugerido.cta_final}</Field>
      </Section>

      <Section title="Captions">
        <ul className="flex flex-col gap-2">
          {analysis.captions.map((caption, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 font-mono text-xs text-zinc-400">{caption.inicio}</span>
              <span className="text-zinc-700 dark:text-zinc-300">{caption.texto}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contexto visual">
        <ul className="flex flex-col gap-2">
          {analysis.contexto_visual.map((escena, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 font-mono text-xs text-zinc-400">{escena.inicio}</span>
              <span className="text-zinc-700 dark:text-zinc-300">{escena.descripcion}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Descripción de publicación">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {analysis.descripcion_publicacion.texto}
        </p>
        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          {analysis.descripcion_publicacion.hashtags
            .map((tag) => `#${tag.replace(/^#/, "")}`)
            .join(" ")}
        </p>
      </Section>

      <Section title="Transcripción">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {analysis.transcripcion}
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
    </div>
  );
}
