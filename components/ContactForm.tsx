"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { contactMethods, validateContact, type ContactErrors } from "@/lib/contact";

type Props = {
  intent: "inquiry" | "consultation";
  endpoint: string;
  turnstileSiteKey: string | null;
  services: { slug: string; title: string }[];
  defaultService?: string;
};

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function ContactForm({ intent, endpoint, turnstileSiteKey, services, defaultService }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const [method, setMethod] = useState<string>("Email");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw: Record<string, unknown> = Object.fromEntries(fd.entries());
    raw.consent = fd.get("consent") === "on";
    raw.intent = intent;

    const result = validateContact(raw);
    if (!result.ok) {
      setErrors(result.errors);
      setState({ kind: "idle" });
      const first = Object.keys(result.errors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          website: fd.get("website") ?? "",
          turnstileToken: fd.get("cf-turnstile-response") ?? "",
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { errors?: ContactErrors; message?: string };
      if (res.ok) {
        setState({ kind: "sent" });
        form.reset();
        return;
      }
      if (res.status === 422 && body.errors) {
        setErrors(body.errors);
        setState({ kind: "idle" });
        return;
      }
      setState({
        kind: "error",
        message:
          body.message ??
          "We could not send your message just now. Please try again in a few minutes.",
      });
    } catch {
      setState({
        kind: "error",
        message: "We could not reach our server. Please check your connection and try again.",
      });
    } finally {
      // A Turnstile token is single-use.
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  }

  if (state.kind === "sent") {
    return (
      <div role="status" className="border border-line bg-white p-8 md:p-12">
        <p className="eyebrow text-gold-ink">Thank you</p>
        <h2 className="display mt-5 text-3xl text-ink md:text-4xl">
          {intent === "consultation" ? "Your consultation request has been received." : "Your message has been received."}
        </h2>
        <p className="mt-5 max-w-lg leading-relaxed text-muted">
          A member of our team will review it and respond using your preferred contact method.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = state.kind === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative border border-line bg-white p-6 sm:p-8 md:p-12" aria-describedby="form-note">
      {turnstileSiteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      )}

      <p id="form-note" className="mb-8 text-sm text-muted">
        Fields marked <span aria-hidden className="text-gold-ink">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name} autoComplete="name" />
        <Field label="Business or organization" name="organization" error={errors.organization} autoComplete="organization" />
        <Field label="Email address" name="email" type="email" required error={errors.email} autoComplete="email" inputMode="email" />
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          required={method !== "Email"}
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
          hint="Include your country code, e.g. +91."
        />
        <Field label="Country" name="country" required error={errors.country} autoComplete="country-name" />
        <div>
          <Label htmlFor="service" required>Service required</Label>
          <select
            id="service"
            name="service"
            defaultValue={defaultService ?? ""}
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
            className={inputCls(!!errors.service)}
          >
            <option value="" disabled>Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>{s.title}</option>
            ))}
            <option value="Not sure yet">Not sure yet — I would like advice</option>
          </select>
          <ErrorText id="service-error" error={errors.service} />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="message" required>
            {intent === "consultation" ? "What would you like to discuss?" : "Project description"}
          </Label>
          <textarea
            id="message"
            name="message"
            rows={6}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            className={`${inputCls(!!errors.message)} resize-y`}
          />
          {!errors.message && (
            <p id="message-hint" className="mt-2 text-xs text-muted">
              Your objectives, timing and anything we should know.
            </p>
          )}
          <ErrorText id="message-error" error={errors.message} />
        </div>

        <Field label="Approximate budget" name="budget" error={errors.budget} hint="Optional, e.g. ₹5 lakh or US$10,000." />
        {intent === "consultation" ? (
          <Field
            label="Preferred dates and times"
            name="preferredTimes"
            error={errors.preferredTimes}
            hint="Optional. Please include your time zone."
          />
        ) : (
          <input type="hidden" name="preferredTimes" value="" />
        )}

        <fieldset className="md:col-span-2" aria-describedby={errors.contactMethod ? "contactMethod-error" : undefined}>
          <legend className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Preferred contact method <span aria-hidden className="text-gold-ink">*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {contactMethods.map((m) => (
              <label
                key={m}
                className="relative inline-flex cursor-pointer items-center gap-3 border border-line px-5 py-3 text-sm transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="sr-only"
                />
                {m}
              </label>
            ))}
          </div>
          <ErrorText id="contactMethod-error" error={errors.contactMethod} />
        </fieldset>

        {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-charcoal">
            <input
              type="checkbox"
              name="consent"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-[#111111]"
            />
            <span>
              I agree that Enhanc Media may use these details to respond to my {intent === "consultation" ? "consultation request" : "inquiry"}, as
              described in the <Link href="/privacy-policy" className="underline decoration-gold underline-offset-4">Privacy Policy</Link>.
              <span aria-hidden className="text-gold-ink"> *</span>
            </span>
          </label>
          <ErrorText id="consent-error" error={errors.consent} />
        </div>

        {turnstileSiteKey && (
          <div className="md:col-span-2">
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
          </div>
        )}
      </div>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="mt-8 border-l-2 border-[#9b2c2c] bg-[#fbf1f1] px-4 py-3 text-sm text-[#7a1f1f]">
          Please review the highlighted fields.
        </p>
      )}
      {state.kind === "error" && (
        <p role="alert" className="mt-8 border-l-2 border-[#9b2c2c] bg-[#fbf1f1] px-4 py-3 text-sm text-[#7a1f1f]">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center justify-center gap-4 bg-ink px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-charcoal disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? "Sending…" : intent === "consultation" ? "Request consultation" : "Send inquiry"}
          <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" aria-hidden />
        </button>
        <p className="text-xs text-muted">Protected against spam. We never share your details.</p>
      </div>
    </form>
  );
}

function inputCls(invalid: boolean) {
  return `mt-2 block w-full border-0 border-b bg-transparent px-0 py-3 text-[1rem] text-ink placeholder:text-mist focus:outline-none focus:ring-0 focus-visible:outline-none transition-colors ${
    invalid ? "border-[#9b2c2c]" : "border-line focus:border-ink"
  }`;
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ink">
      {children}
      {required && <span aria-hidden className="text-gold-ink"> *</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-sm text-[#9b2c2c]">
      {error}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  hint,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div>
      <Label htmlFor={name} required={required}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy}
        className={inputCls(!!error)}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-2 text-xs text-muted">{hint}</p>
      )}
      <ErrorText id={`${name}-error`} error={error} />
    </div>
  );
}
