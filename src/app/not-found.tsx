import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-5 py-24 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-violet)]">
        Signal lost
      </p>
      <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">
        这条记录暂时不存在。
      </h1>
      <p className="max-w-2xl text-base leading-8 text-[var(--muted-soft)]">
        你访问的页面可能还没发布，或者它已经被归档。先回到首页继续浏览当前公开的内容。
      </p>
      <Link
        className="rounded-full border border-[color:rgba(0,244,254,0.3)] bg-[color:rgba(0,244,254,0.08)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-cyan)]"
        href="/"
      >
        Return home
      </Link>
    </div>
  );
}
