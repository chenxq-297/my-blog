type AdminNavProps = {
  email: string;
  name: string;
};

export const AdminNav = ({ email, name }: AdminNavProps) => {
  return (
    <header className="border-b border-[var(--line)] bg-black/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-lime)]">
            Admin console
          </p>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{name}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--muted-strong)]">{email}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-dim)]">Owner</p>
        </div>
      </div>
    </header>
  );
};
