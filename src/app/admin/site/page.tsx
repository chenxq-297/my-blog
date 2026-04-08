import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getSiteSettings } from "@/features/site-config/queries";

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <section className="space-y-6">
      <SiteSettingsForm settings={settings} />
    </section>
  );
}
