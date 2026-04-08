import { AboutForm } from "@/components/admin/about-form";
import { getAboutPage } from "@/features/about/queries";

export default async function AdminAboutPage() {
  const aboutPage = await getAboutPage();

  return (
    <section className="space-y-6">
      <AboutForm aboutPage={aboutPage} />
    </section>
  );
}
