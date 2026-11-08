/**
 * Inquiry validation, shared by the browser form and the Worker that receives it.
 * The Worker always re-validates: the browser check is for the visitor's convenience only.
 * Kept free of imports so both runtimes can use it.
 */

export const contactMethods = ["Email", "Phone", "WhatsApp"] as const;
export const intents = ["inquiry", "consultation"] as const;

export type ContactInput = {
  intent: (typeof intents)[number];
  name: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  message: string;
  budget: string;
  contactMethod: (typeof contactMethods)[number];
  preferredTimes: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const limits: Record<string, number> = {
  name: 120,
  organization: 160,
  email: 254,
  phone: 24,
  country: 80,
  service: 120,
  message: 5000,
  budget: 120,
  preferredTimes: 300,
};

const emailRe = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const phoneRe = /^\+?[0-9()\s.-]{6,24}$/;

const clean = (v: unknown) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "";

export function validateContact(raw: Record<string, unknown>):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors } {
  const v = {
    intent: clean(raw.intent),
    name: clean(raw.name),
    organization: clean(raw.organization),
    email: clean(raw.email).toLowerCase(),
    phone: clean(raw.phone),
    country: clean(raw.country),
    service: clean(raw.service),
    message: clean(raw.message),
    budget: clean(raw.budget),
    contactMethod: clean(raw.contactMethod),
    preferredTimes: clean(raw.preferredTimes),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
  };
  const e: ContactErrors = {};

  for (const [k, max] of Object.entries(limits)) {
    if ((v as Record<string, unknown>)[k] && String((v as Record<string, unknown>)[k]).length > max)
      e[k as keyof ContactInput] = `Please keep this under ${max} characters.`;
  }
  if (!intents.includes(v.intent as ContactInput["intent"])) v.intent = "inquiry";
  if (!v.name) e.name = "Please enter your full name.";
  if (!v.email) e.email = "Please enter your email address.";
  else if (!emailRe.test(v.email)) e.email = "Please enter a valid email address.";
  if (!contactMethods.includes(v.contactMethod as ContactInput["contactMethod"]))
    e.contactMethod = "Please choose how you would like us to contact you.";
  if (v.phone && !phoneRe.test(v.phone)) e.phone = "Please enter a valid phone number, including the country code.";
  if (!v.phone && (v.contactMethod === "Phone" || v.contactMethod === "WhatsApp"))
    e.phone = `Please enter a number so we can reach you by ${v.contactMethod === "Phone" ? "phone" : "WhatsApp"}.`;
  if (!v.country) e.country = "Please tell us which country you are in.";
  if (!v.service) e.service = "Please choose the service you are interested in.";
  if (!v.message) e.message = "Please tell us a little about your project.";
  else if (v.message.length < 20 && !e.message) e.message = "Please add a little more detail (at least 20 characters).";
  if (!v.consent) e.consent = "Please confirm that we may use these details to respond to you.";

  if (Object.keys(e).length) return { ok: false, errors: e };
  return { ok: true, data: v as ContactInput };
}
