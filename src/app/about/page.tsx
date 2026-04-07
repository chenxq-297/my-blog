import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the person behind the site, current focus, and working principles.",
};

const principles = [
  "把写作当作整理系统理解的一种方式。",
  "更喜欢长期可维护的小系统，而不是短期热闹的大工程。",
  "旅行时会注意城市的秩序、速度、材质和夜晚的光。",
  "做作品集时，最看重的是判断、取舍和实现的诚意。",
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow="About the operator"
        title="一个把工程、观察和表达放在同一条时间线上的程序员。"
        description="这不是只放项目截图的个人页，而是一个长期更新的公共笔记本。"
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
            Profile
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            {siteConfig.name}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--muted-dim)]">
            {siteConfig.role} · {siteConfig.location}
          </p>
          <div className="mt-8 space-y-5 text-base leading-8 text-[var(--muted-soft)]">
            <p>
              我希望这个网站能够同时容纳技术写作、旅行记录、项目案例和那些还没发展成完整文章的想法。
            </p>
            <p>
              它更像一张公开工作台，而不是只有结果展示的橱窗。你看到的不只是完成物，也包括判断路径、兴趣轨迹和长期积累。
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-[color:rgba(183,107,255,0.26)] bg-[color:rgba(183,107,255,0.08)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-violet)]">
              Current focus
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--muted-soft)]">
              正在搭建一套更适合自己长期输出的写作与项目归档系统，希望每一部分都能自然地长出来，而不是一次性拼凑。
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-lime)]">
              Working principles
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted-soft)]">
              {principles.map((item) => (
                <li key={item} className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
