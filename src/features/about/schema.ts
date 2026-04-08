import { z } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required.`);

export const aboutPageSchema = z.object({
  eyebrow: requiredText("Eyebrow"),
  title: requiredText("Title"),
  description: requiredText("Description"),
  profileHeading: requiredText("Profile heading"),
  profileBody: requiredText("Profile body"),
  profileBodySecondary: requiredText("Profile body secondary"),
  focusHeading: requiredText("Focus heading"),
  focusBody: requiredText("Focus body"),
  principlesHeading: requiredText("Principles heading"),
  principles: z.array(requiredText("Principle")).min(1, "At least one principle is required."),
});

export type AboutPageInput = z.input<typeof aboutPageSchema>;
export type AboutPage = z.output<typeof aboutPageSchema>;
