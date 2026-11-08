import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms & Conditions",
  description: "The terms that apply to the use of the Enhanc Media website.",
  path: "/terms",
});

export default function Terms() {
  const entity = site.legalName ?? site.name;
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms"
      updated="8 November 2026"
      sections={[
        {
          heading: "About these terms",
          body: (
            <p>
              These terms govern your use of this website, operated by {entity}. By using the website you accept them. If you
              do not agree, please do not use the website.
            </p>
          ),
        },
        {
          heading: "Information on this website",
          body: (
            <p>
              The content of this website is provided for general information about our services. It does not constitute an
              offer or professional advice for any specific situation. Services are provided only under a separate written
              agreement, whose terms take precedence over anything on this website.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The Enhanc Media name, logo, text, design and other content on this website belong to {entity} or are used with
              permission. Project materials shown in our work belong to their respective owners and are presented with their
              permission. You may not copy, reproduce or reuse them without prior written consent.
            </p>
          ),
        },
        {
          heading: "Acceptable use",
          body: (
            <>
              <p>You agree not to:</p>
              <ul>
                <li>use the website in any unlawful way, or to send unlawful, misleading or abusive content;</li>
                <li>attempt to gain unauthorized access to the website or its systems;</li>
                <li>submit forms automatically, in bulk or on behalf of others without their authority.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Inquiries",
          body: (
            <p>
              Submitting an inquiry or consultation request does not create a client relationship or any obligation on either
              side. We handle the information you submit as described in our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          heading: "Links to other websites",
          body: <p>Where this website links to other websites, we are not responsible for their content or practices.</p>,
        },
        {
          heading: "Liability",
          body: (
            <p>
              We take care to keep this website accurate and available, but we do not guarantee that it will be uninterrupted
              or free of errors. To the extent permitted by law, we are not liable for any loss arising from the use of, or
              reliance on, this website.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: (
            <p>
              These terms are governed by the laws of India. Any dispute relating to them is subject to the jurisdiction of the
              competent courts in India.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: <p>We may update these terms from time to time. The date at the top of this page shows when they last changed.</p>,
        },
      ]}
    />
  );
}
