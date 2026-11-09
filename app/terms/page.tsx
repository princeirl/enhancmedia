import { LegalPage } from "@/components/LegalPage";
import { legal } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const doc = legal("terms");

export const metadata = pageMeta({ title: doc.title, description: doc.description, path: "/terms" });

export default function Terms() {
  return <LegalPage title={doc.title} path="/terms" updated={doc.updated} sections={doc.sections} />;
}
