import EducationBanner from "@/components/education/EducationBanner";
import EducationList from "@/components/education/EducationList";
import { educationContent as edu } from "@/content/labels";

export const metadata = { title: edu.pageTitle };

export default function EducationPage() {
  const headlines = edu.articles.filter((a) => a.headline);

  return (
    <main className="min-h-svh bg-svarati-cream pb-16 pt-24">
      <EducationBanner headlines={headlines} />
      <EducationList articles={edu.articles} />
    </main>
  );
}