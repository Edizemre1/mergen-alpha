export const DEMO_CONTRACT_VERSION = 1 as const;

export type DemoCategory = "semiconductors" | "macro" | "energy" | "infrastructure";
export type DemoRisk = "moderate" | "elevated" | "speculative";

export interface DemoAnalyst {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly handle: string;
  readonly initials: string;
  readonly role: string;
  readonly biography: string;
  readonly specialties: readonly DemoCategory[];
  readonly disclosure: string;
  readonly fictional: true;
}

export interface DemoInsightPost {
  readonly id: string;
  readonly analystId: string;
  readonly body: string;
  readonly assets: readonly string[];
  readonly publishedAt: string;
  readonly fictional: true;
}

export interface DemoResearchCard {
  readonly id: string;
  readonly slug: string;
  readonly analystId: string;
  readonly title: string;
  readonly category: DemoCategory;
  readonly assets: readonly string[];
  readonly timeHorizon: string;
  readonly risk: DemoRisk;
  readonly thesisSummary: string;
  readonly publicSections: readonly string[];
  readonly invalidationConditions: readonly string[];
  readonly sourceTitles: readonly string[];
  readonly disclosure: string;
  readonly publishedAt: string;
  readonly version: number;
  readonly previewOnly: boolean;
  readonly fictional: true;
}

export interface DemoNotification {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly createdAt: string;
  readonly fictional: true;
}

export interface DemoTopic {
  readonly id: string;
  readonly label: string;
  readonly context: string;
  readonly category: DemoCategory;
  readonly fictional: true;
}

export interface DemoProfile {
  readonly id: string;
  readonly name: string;
  readonly handle: string;
  readonly initials: string;
  readonly note: string;
  readonly fictional: true;
}
