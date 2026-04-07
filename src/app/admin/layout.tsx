import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminSession } from "@/features/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  return (
    <div className="min-h-[calc(100vh-7rem)]">
      {session ? <AdminNav email={session.user.email} name={session.user.name} /> : null}
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
