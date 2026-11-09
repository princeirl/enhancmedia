import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const doc = legal("privacy-policy");

export const metadata = pageMeta({ title: doc.title, description: doc.description, path: "/privacy-policy" });

export default function Privacy() {
  return <LegalPage title={doc.title} path="/privacy-policy" updated={doc.updated} sections={doc.sections} />;
}
