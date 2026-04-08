import { HomeSectionsForm } from "@/components/admin/home-sections-form";
import { getHomeSections } from "@/features/home-sections/queries";

export default async function AdminHomeSectionsPage() {
  const homeSections = await getHomeSections();

  return (
    <section className="space-y-6">
      <HomeSectionsForm sections={homeSections.sections} />
    </section>
  );
}
