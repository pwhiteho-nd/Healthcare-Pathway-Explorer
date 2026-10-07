import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Accessibility, ArrowRight, BookOpen, ChartNoAxesCombined, ClipboardList, Compass,
  FlaskConical, GraduationCap, HeartHandshake, HeartPulse, ScanLine, SlidersHorizontal,
  Stethoscope, Users, type LucideIcon,
} from 'lucide-react';
import { Form } from '@/components/ui/form';
import {
  BUDGET_OPTIONS, EMPTY_FORM, FREE_TEXT_MAX, INTEREST_OPTIONS, LOCATION_OPTIONS, SAMPLE_LABEL, SCHEDULE_OPTIONS,
  SIM_LABEL, TIME_OPTIONS, buildAdvisorQuestions, buildSummary, matchPathways, validateForm,
  type FormValues, type MatchResult,
} from '@/lib/pathway-logic';

const card = 'hpe-card rounded-xl border bg-card p-5 sm:p-7';
const btn = 'hpe-button min-h-11 rounded-lg px-5 py-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
const primary = `${btn} hpe-primary bg-primary text-primary-foreground`;
const outline = `${btn} border-2 border-primary text-primary bg-card`;

const interestIcons: Record<string, LucideIcon> = {
  'patient-care': HeartPulse,
  'lab-diagnostics': FlaskConical,
  imaging: ScanLine,
  'mental-health': HeartHandshake,
  'rehab-therapy': Accessibility,
  'health-data': ChartNoAxesCombined,
  'public-health': Users,
  unsure: Compass,
};

function InterestIcon({ id }: { id: string }) {
  const Icon = interestIcons[id] ?? Compass;
  return <Icon className="hpe-interest-icon size-5 shrink-0" aria-hidden="true" />;
}

function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <span className="hpe-section-icon" aria-hidden="true"><Icon size={19} /></span>;
}

type Opt = { id: string; label: string };
function Radios({ name, legend, opts, value, onChange }: { name: string; legend: string; opts: readonly Opt[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="space-y-2" data-testid={`fieldset-${name}`}>
      <legend className="font-bold mb-1">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <label key={o.id} className="hpe-choice flex items-center gap-3 min-h-12 rounded-lg border px-3 py-2 bg-background">
            <input type="radio" className="size-5 shrink-0 accent-primary" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} data-testid={`radio-${name}-${o.id}`} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const statusText = { met: 'Met', conflict: 'Conflict', unknown: 'Unknown', unspecified: 'No preference' } as const;

export default function Home() {
  const formApi = useForm<FormValues>({ defaultValues: EMPTY_FORM });
  const form = formApi.watch();
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<'form' | 'results'>('form');
  const [summary, setSummary] = useState('');
  const [notice, setNotice] = useState('');

  const validation = useMemo(() => validateForm(form), [form]);
  const result: MatchResult | null = useMemo(() => (view === 'results' ? matchPathways(form) : null), [view, form]);
  const set = formApi.setValue;

  const submit = formApi.handleSubmit(() => {
    setSubmitted(true);
    if (!validation.valid) {
      setTimeout(() => document.querySelector<HTMLElement>(validation.errors.interests ? '[data-testid="checkbox-interest-patient-care"]' : '[data-testid="input-free-text"]')?.focus(), 0);
      return;
    }
    const r = matchPathways(form);
    setSummary(buildSummary(form, r));
    setView('results');
    setNotice('');
    window.scrollTo({ top: 0 });
    setTimeout(() => document.getElementById('results-start')?.focus(), 0);
  });
  const reset = () => { formApi.reset(EMPTY_FORM); setSubmitted(false); setView('form'); setSummary(''); setNotice(''); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setNotice('Summary copied.'); }
    catch { setNotice('Copy was blocked by the browser. Select the text and copy it manually.'); }
  };

  return (
    <div className="pathway-app min-h-[100dvh]">
      <header className="hpe-header border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 py-7 sm:py-9 space-y-4">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight" data-testid="text-title">
            <span className="hpe-welcome-icon" aria-hidden="true"><Stethoscope size={25} /></span>
            <span>Healthcare Pathway Explorer</span>
          </h1>
          <p className="text-muted-foreground">Your interests are a good place to start. Explore a few examples and prepare for a conversation with your advisor. It’s okay to be unsure.</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-accent text-accent-foreground border border-accent-foreground/40 px-3 py-1 font-bold" data-testid="badge-sample-data">{SAMPLE_LABEL}</span>
            <span className="rounded-md bg-secondary text-secondary-foreground border border-secondary-foreground/40 px-3 py-1 font-bold" data-testid="badge-simulated-ai">{SIM_LABEL}</span>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-unofficial">This is not an official ATI, NHA, or university product.</p>
          <nav aria-label="Worksheet progression" className="hpe-progression no-print" data-testid="worksheet-progression">
            <ol>
              <li aria-current={view === 'form' ? 'step' : undefined}>
                <span className="hpe-step-number" aria-hidden="true">1</span><span>Your interests</span>
              </li>
              <li aria-current={view === 'results' ? 'step' : undefined}>
                <span className="hpe-step-number" aria-hidden="true">2</span><span>Explore options</span>
              </li>
              <li>
                <span className="hpe-step-number" aria-hidden="true">3</span>
                {view === 'results' ? <a href="#advising-prep">Prepare for advising</a> : <span>Prepare for advising</span>}
              </li>
            </ol>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10 space-y-7">
        {view === 'form' && (
          <Form {...formApi}><form onSubmit={submit} noValidate className="space-y-6" data-testid="form-worksheet">
            {submitted && !validation.valid && (
              <div role="alert" className="rounded-lg border-2 border-destructive bg-card p-4" data-testid="alert-errors">
                <p className="font-bold text-destructive">Please fix the following before continuing:</p>
                <ul className="list-disc pl-5">
                  {validation.errors.interests && <li>{validation.errors.interests}</li>}
                  {validation.errors.freeText && <li>{validation.errors.freeText}</li>}
                  {validation.errors.preferences && <li>{validation.errors.preferences}</li>}
                  {validation.errors.preferredPlace && <li>{validation.errors.preferredPlace}</li>}
                </ul>
              </div>
            )}

            <fieldset className={card} aria-describedby="interest-help" data-testid="fieldset-interests">
              <legend className="inline-flex items-center gap-2 px-1 text-lg font-bold"><SectionIcon icon={Compass} />Your interests</legend>
              <p id="interest-help" className="text-muted-foreground mb-3">Choose areas that sound interesting, or choose Unsure. No need to know your next step yet.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTEREST_OPTIONS.map((o) => (
                  <label key={o.id} className="hpe-choice flex items-center gap-3 min-h-12 rounded-lg border px-3 py-2 bg-background">
                    <input type="checkbox" className="size-5 shrink-0 accent-primary" checked={form.interests.includes(o.id)}
                      onChange={(e) => set('interests', e.target.checked ? (o.id === 'unsure' ? ['unsure'] : [...form.interests.filter((i) => i !== 'unsure'), o.id]) : form.interests.filter((i) => i !== o.id))}
                      aria-invalid={!!(submitted && validation.errors.interests)}
                      data-testid={`checkbox-interest-${o.id}`} />
                    <InterestIcon id={o.id} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              {submitted && validation.errors.interests && (
                <p className="mt-3 font-bold text-destructive" data-testid="error-interests">{validation.errors.interests}</p>
              )}
              <div className="mt-5">
                <label htmlFor="free-text" className="font-bold">Anything else about your interests? (optional)</label>
                <textarea id="free-text" rows={3} value={form.freeText} onChange={(e) => set('freeText', e.target.value)}
                  className="mt-1 w-full rounded-md border-2 border-input bg-background p-3" data-testid="input-free-text"
                  aria-invalid={!!(submitted && validation.errors.freeText)} aria-describedby="free-text-help" />
                <p id="free-text-help" className="text-sm text-muted-foreground" data-testid="text-char-count">
                  {form.freeText.length}/{FREE_TEXT_MAX} characters. Do not enter names, contact details, grades, transcripts, or TEAS scores. This note is only copied into your summary and is not used for matching.
                </p>
                {submitted && validation.errors.freeText && <p className="font-bold text-destructive" data-testid="error-free-text">{validation.errors.freeText}</p>}
              </div>
            </fieldset>

            <section className={`${card} space-y-6`}>
              <h2 className="flex items-center gap-3 text-lg font-bold"><SectionIcon icon={SlidersHorizontal} />Practical constraints</h2>
              <p className="text-muted-foreground -mt-4">Choose "Unsure" for anything you have not decided. Unsure means no constraint is applied.</p>
              <Radios name="location" legend="Learning format" opts={LOCATION_OPTIONS} value={form.location} onChange={(v) => set('location', v)} />
              <div>
                <label htmlFor="preferred-place" className="font-bold">Preferred city or region (optional)</label>
                <input id="preferred-place" value={form.preferredPlace} onChange={(e) => set('preferredPlace', e.target.value)} maxLength={120}
                  placeholder="Unsure / no location constraint" className="mt-1 w-full rounded-md border-2 border-input bg-background p-3" data-testid="input-preferred-place" aria-describedby="place-help" />
                <p id="place-help" className="text-sm text-muted-foreground">Leave blank if unsure. No sample record has a verified location; specifying a region means location fit cannot be confirmed. Do not enter a street address.</p>
              </div>
              <Radios name="trainingTime" legend="Training time" opts={TIME_OPTIONS} value={form.trainingTime} onChange={(v) => set('trainingTime', v)} />
              <Radios name="budget" legend="Budget" opts={BUDGET_OPTIONS} value={form.budget} onChange={(v) => set('budget', v)} />
              <Radios name="schedule" legend="Schedule" opts={SCHEDULE_OPTIONS} value={form.schedule} onChange={(v) => set('schedule', v)} />
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className={`${primary} inline-flex items-center gap-2`} data-testid="button-submit">See sample pathways<ArrowRight size={18} aria-hidden="true" /></button>
              <button type="button" onClick={reset} className={outline} data-testid="button-reset">Reset worksheet</button>
            </div>
          </form></Form>
        )}

        {view === 'results' && result && (
          <div className="space-y-6" data-testid="section-results">
            <h2 id="results-start" tabIndex={-1} className="text-2xl font-bold">Your exploration worksheet</h2>
            <div className="no-print flex flex-wrap gap-3">
              <button className={outline} onClick={() => setView('form')} data-testid="button-revise">Revise answers</button>
              <button className={outline} onClick={reset} data-testid="button-reset-results">Reset worksheet</button>
            </div>

            <p className="rounded-lg border bg-muted p-4" data-testid="text-disclaimer">
              These are fictional sample pathways shown in a fixed order, not a ranking. Format, duration, and schedule are fictional scenario assumptions, not real program facts. Nothing here is an eligibility or admission decision, and another pathway does not guarantee later nursing admission.
            </p>

            {result.noMatch ? (
              <div className={card} data-testid="state-no-match">
                <h2 className="text-xl font-bold">No sample pathway can be confirmed to meet all of your constraints</h2>
                <p className="mt-2">No match: we did not loosen your choices. Each record has a conflict or lacks facts needed to check a stated constraint. This does not mean no real program exists. Bring the questions below to your advisor.</p>
              </div>
            ) : (
              <section aria-labelledby="results-h" className="space-y-4">
                <h2 id="results-h" className="text-xl font-bold" data-testid="text-results-count">{result.matches.length} sample scenario{result.matches.length === 1 ? '' : 's'} meeting your selected criteria</h2>
                {result.matches.map((m) => (
                  <article key={m.record.id} className={card} data-testid={`card-pathway-${m.record.id}`}>
                    <h3 className="flex items-start gap-3 text-lg font-bold"><SectionIcon icon={GraduationCap} /><span>{m.record.title}</span></h3>
                    <p className="text-sm text-muted-foreground">Fictional demonstration only. Institution/provider, location, cost/basis, requirements, source URL, and verification date: not supplied.</p>
                    <p className="mt-2 text-sm" data-testid={`facts-${m.record.id}`}><strong>Fictional scenario assumptions:</strong> {m.record.format}; {m.record.durationMonths} months; {m.record.schedule === 'evening-weekend' ? 'evenings/weekends' : m.record.schedule} schedule.</p>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <dt className="font-bold">Interests</dt><dd data-testid={`status-interests-${m.record.id}`}>{statusText[m.statuses.interests]}</dd>
                      <dt className="font-bold">Format</dt><dd data-testid={`status-location-${m.record.id}`}>{statusText[m.statuses.location]}</dd>
                      <dt className="font-bold">Region</dt><dd>{statusText[m.statuses.preferredPlace]}</dd>
                      <dt className="font-bold">Training time</dt><dd data-testid={`status-time-${m.record.id}`}>{statusText[m.statuses.trainingTime]}</dd>
                      <dt className="font-bold">Schedule</dt><dd data-testid={`status-schedule-${m.record.id}`}>{statusText[m.statuses.schedule]}</dd>
                      <dt className="font-bold">Budget</dt><dd data-testid={`status-budget-${m.record.id}`}>{statusText[m.statuses.budget]}</dd>
                    </dl>
                    <h4 className="mt-3 font-bold">Why it appears</h4>
                    <ul className="list-disc pl-5" data-testid={`list-explanation-${m.record.id}`}>{m.explanation.map((x) => <li key={x}>{x}</li>)}</ul>
                    <h4 className="mt-3 font-bold">Unknowns to confirm</h4>
                    <ul className="list-disc pl-5" data-testid={`list-unknowns-${m.record.id}`}>{m.unknowns.map((x) => <li key={x}>{x}</li>)}</ul>
                  </article>
                ))}
              </section>
            )}

            {result.excluded.length > 0 && (
              <section className={card} data-testid="section-excluded">
                <h2 className="text-lg font-bold">Not matched: conflicts or missing constraint facts</h2>
                <ul className="mt-2 space-y-2">
                  {result.excluded.map((m) => (
                    <li key={m.record.id} data-testid={`excluded-${m.record.id}`}>
                      <span className="font-bold">{m.record.title}</span>
                      <ul className="list-disc pl-5 text-sm">{m.conflicts.map((c) => <li key={c}>{c}</li>)}{Object.values(m.statuses).includes('unknown') && m.unknowns.map((u) => <li key={u}>{u}</li>)}</ul>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <h2 id="advising-prep" className="flex items-center gap-3 text-2xl font-bold scroll-mt-6"><SectionIcon icon={BookOpen} />Prepare for advising</h2>
            <section className={card} data-testid="section-questions">
              <h2 className="flex items-center gap-3 text-lg font-bold"><SectionIcon icon={HeartHandshake} />Questions to bring to your advisor</h2>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {buildAdvisorQuestions(form, result).map((q) => <li key={q}>{q}</li>)}
              </ul>
            </section>

            <section className={card} data-testid="section-summary">
              <h2 className="flex items-center gap-3 text-lg font-bold"><SectionIcon icon={ClipboardList} /><label htmlFor="summary">Advisor summary (editable)</label></h2>
              <p className="text-sm text-muted-foreground">Edit this text before you copy or print it. Edits stay in this page only.</p>
              <textarea id="summary" rows={16} value={summary} onChange={(e) => setSummary(e.target.value)}
                className="mt-2 w-full rounded-md border-2 border-input bg-background p-3 font-mono text-sm print:hidden" data-testid="input-summary" />
              <pre className="hidden print:block whitespace-pre-wrap" data-testid="print-summary">{summary}</pre>
              <div className="no-print mt-3 flex flex-wrap gap-3">
                <button className={primary} onClick={copy} data-testid="button-copy">Copy summary</button>
                <button className={outline} onClick={() => window.print()} data-testid="button-print">Print</button>
                <button className={outline} onClick={() => setSummary(buildSummary(form, result))} data-testid="button-regenerate">Restore generated text</button>
              </div>
              <p role="status" className="mt-2 font-bold" data-testid="text-notice">{notice}</p>
            </section>
          </div>
        )}
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-8 text-sm text-muted-foreground no-print">
        Answers stay in this page's memory only and disappear on refresh or reset. No live AI is used. This is not an official ATI, NHA, or university product.
      </footer>
    </div>
  );
}
