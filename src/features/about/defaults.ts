export type AboutPageDefaults = {
  eyebrow: string;
  title: string;
  description: string;
  profileHeading: string;
  profileBody: string;
  profileBodySecondary: string;
  focusHeading: string;
  focusBody: string;
  principlesHeading: string;
  principles: string[];
};

export const defaultAboutPage: AboutPageDefaults = {
  eyebrow: "About the operator",
  title: "A developer who puts engineering, observation, and writing on one timeline",
  description:
    "This is not only a portfolio. It is a public notebook that stays close to the work, the decisions, and the long-term accumulation.",
  profileHeading: "Profile",
  profileBody:
    "I use this site as a long-term logbook for software engineering, travel notes, and experiments that might grow into full articles later.\n\nThink of it as a working desk, not a polished window. You will see drafts, tradeoffs, and the shape of how things get built.",
  profileBodySecondary:
    "If you are looking for a single takeaway: I care about calm systems, clear constraints, and small iterations that compound over time.",
  focusHeading: "Current focus",
  focusBody:
    "Building a small, durable publishing system where each section can evolve without forcing a full rewrite of the site.",
  principlesHeading: "Working principles",
  principles: [
    "Write to clarify systems thinking, not only to publish.",
    "Prefer small maintainable systems over short-lived big builds.",
    "When traveling, notice the city's rhythm: structure, speed, materials, and night light.",
    "In portfolios, show the judgment and tradeoffs, not only the outcome.",
  ],
};
