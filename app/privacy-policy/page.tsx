import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Enhanc Media collects, uses and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

export default function Privacy() {
  const entity = site.legalName ?? site.name;
  const contact = site.contact.email ? (
    <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
  ) : (
    <Link href="/contact">our contact form</Link>
  );
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      updated="8 November 2026"
      sections={[
        {
          heading: "Who we are",
          body: (
            <p>
              This website is operated by {entity} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains what personal
              information we collect through this website, why we collect it and how we look after it. We handle personal
              information in accordance with applicable data protection law, including India&rsquo;s Digital Personal Data
              Protection Act, 2023.
            </p>
          ),
        },
        {
          heading: "Information we collect",
          body: (
            <>
              <p>We collect only the information you choose to give us when you submit an inquiry or consultation request:</p>
              <ul>
                <li>your name, and your business or organization;</li>
                <li>your email address, phone number and country;</li>
                <li>the service you are interested in, your project description, approximate budget and preferred times;</li>
                <li>your preferred contact method.</li>
              </ul>
              <p>
                When a form is submitted, our systems also process technical information such as your IP address for the
                limited purposes of preventing spam and abuse.
              </p>
            </>
          ),
        },
        {
          heading: "How we use it",
          body: (
            <>
              <p>We use this information only to:</p>
              <ul>
                <li>respond to your inquiry or arrange a consultation;</li>
                <li>discuss and, where agreed, provide the services you have asked about;</li>
                <li>protect this website and its forms from spam and misuse.</li>
              </ul>
              <p>We do not sell your personal information, and we do not use it for unrelated marketing without your consent.</p>
            </>
          ),
        },
        {
          heading: "Basis for processing",
          body: (
            <p>
              We process the information you submit on the basis of your consent, given when you submit the form, and to take
              steps at your request before entering into an agreement with you. You may withdraw your consent at any time by
              contacting us.
            </p>
          ),
        },
        {
          heading: "Cookies and analytics",
          body: (
            <p>
              This website does not use advertising or tracking cookies. Fonts and other assets are served from our own
              website. Our spam protection may use strictly necessary technical data to tell people apart from automated
              software. If we introduce analytics in future, this policy will be updated first.
            </p>
          ),
        },
        {
          heading: "Sharing and storage",
          body: (
            <p>
              Your inquiry is delivered to our business mailbox and is accessible only to the people who need it to respond.
              We use reputable infrastructure providers to host this website and deliver messages; they process data on our
              behalf and under our instructions. We do not otherwise share your information unless required by law.
            </p>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              We keep inquiry information only as long as needed to respond and to manage any resulting engagement, after which
              it is deleted, unless the law requires us to keep it longer.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You may ask to access, correct or erase the personal information we hold about you, or withdraw your consent, by
              contacting us through {contact}. We will respond within a reasonable time and in line with applicable law.
            </p>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              This website is served over an encrypted connection. Form submissions are validated, protected against automated
              abuse and transmitted securely. No method of transmission or storage is completely secure, but we take reasonable
              measures to protect your information.
            </p>
          ),
        },
        {
          heading: "Changes and contact",
          body: (
            <p>
              We may update this policy from time to time; the date at the top shows when it last changed. Questions about this
              policy can be sent through {contact}.
            </p>
          ),
        },
      ]}
    />
  );
}
