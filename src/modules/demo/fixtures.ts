import type { AppLocale } from "@/modules/i18n";
import type {
  DemoAnalyst,
  DemoInsightPost,
  DemoNotification,
  DemoProfile,
  DemoResearchCard,
  DemoTopic,
} from "@/modules/public-contracts";

export const demoAnalysts = [
  {
    id: "analyst_maya_north",
    slug: "maya-north",
    name: "Maya North",
    handle: "@maya.north.demo",
    initials: "MN",
    role: "Independent semiconductor scenario researcher",
    biography:
      "Maya is a fictional analyst created to demonstrate structured public research, uncertainty, and revision-friendly thesis framing.",
    specialties: ["semiconductors", "infrastructure"],
    disclosure:
      "Fictional demo identity. No real credentials, holdings, clients, compensation, or track record are represented.",
    fictional: true,
  },
  {
    id: "analyst_arin_vale",
    slug: "arin-vale",
    name: "Arin Vale",
    handle: "@arin.vale.demo",
    initials: "AV",
    role: "Independent macro scenario researcher",
    biography:
      "Arin is a fictional analyst used to show how macro views can separate observations, assumptions, and invalidation conditions.",
    specialties: ["macro", "energy"],
    disclosure:
      "Fictional demo identity. The profile does not assert professional registration, sponsorship, or financial performance.",
    fictional: true,
  },
  {
    id: "analyst_selin_ridge",
    slug: "selin-ridge",
    name: "Selin Ridge",
    handle: "@selin.ridge.demo",
    initials: "SR",
    role: "Independent infrastructure scenario researcher",
    biography:
      "Selin is a fictional analyst created to demonstrate source-aware infrastructure research and explicit risk boundaries.",
    specialties: ["infrastructure", "energy"],
    disclosure:
      "Fictional demo identity. Any companies or assets mentioned are used only in clearly illustrative scenarios.",
    fictional: true,
  },
] as const satisfies readonly DemoAnalyst[];

export const demoInsightPosts = [
  {
    id: "post_capacity_signals",
    analystId: "analyst_maya_north",
    body:
      "Illustrative thesis note: capacity commitments may be more useful than headline demand when testing the durability of an AI infrastructure cycle. The scenario remains sensitive to lead times and customer concentration.",
    assets: ["NVDA", "Semiconductors"],
    publishedAt: "2026-07-28T09:30:00.000Z",
    fictional: true,
  },
  {
    id: "post_inventory_cycle",
    analystId: "analyst_arin_vale",
    body:
      "Illustrative macro note: a slower inventory rebuild can coexist with improving survey data. The key question is whether orders convert before financing conditions tighten again.",
    assets: ["Macro", "Credit"],
    publishedAt: "2026-07-27T15:10:00.000Z",
    fictional: true,
  },
  {
    id: "post_grid_queue",
    analystId: "analyst_selin_ridge",
    body:
      "Illustrative infrastructure note: interconnection queues can create a long gap between announced demand and delivered capacity. Scenario timing matters as much as total project size.",
    assets: ["Energy", "Infrastructure"],
    publishedAt: "2026-07-26T11:45:00.000Z",
    fictional: true,
  },
  {
    id: "post_memory_mix",
    analystId: "analyst_maya_north",
    body:
      "Illustrative research question: if premium memory supply expands faster than accelerator shipments, which part of the stack absorbs the pricing pressure first? This is a question, not a forecast.",
    assets: ["Memory", "Semiconductors"],
    publishedAt: "2026-07-25T08:15:00.000Z",
    fictional: true,
  },
] as const satisfies readonly DemoInsightPost[];

export const demoResearchCards = [
  {
    id: "research_ai_capacity",
    slug: "ai-capacity-cycle-map",
    analystId: "analyst_maya_north",
    title: "Mapping an Illustrative AI Capacity Cycle",
    category: "semiconductors",
    assets: ["NVDA", "Semiconductors", "Data centers"],
    timeHorizon: "12–18 months",
    risk: "elevated",
    thesisSummary:
      "This fictional scenario examines whether infrastructure commitments, component lead times, and customer concentration can distinguish durable capacity demand from a temporary ordering surge.",
    publicSections: [
      "The demo framework separates announced capacity from installed and utilized capacity. It treats each layer as an uncertain signal rather than a forecast.",
      "A constructive scenario would require broadening demand, manageable lead times, and evidence that utilization follows delivery. The public demo does not assign probabilities or price targets.",
    ],
    invalidationConditions: [
      "Illustrative order commitments fail to convert into deliveries.",
      "Customer concentration increases while utilization evidence weakens.",
      "Supply expansion materially outpaces the fictional demand assumptions.",
    ],
    sourceTitles: [
      "Illustrative capacity announcement index",
      "Fictional component lead-time worksheet",
      "Public-scenario customer concentration notes",
    ],
    disclosure:
      "Fictional public demo research. No holdings, sponsorship, compensation, recommendation, or verified performance is represented.",
    publishedAt: "2026-07-24T12:00:00.000Z",
    version: 2,
    previewOnly: false,
    fictional: true,
  },
  {
    id: "research_credit_inventory",
    slug: "credit-and-inventory-crosscurrents",
    analystId: "analyst_arin_vale",
    title: "Credit and Inventory Crosscurrents",
    category: "macro",
    assets: ["Macro", "Credit", "Industrials"],
    timeHorizon: "6–12 months",
    risk: "moderate",
    thesisSummary:
      "This fictional scenario explores how improving survey sentiment could diverge from order conversion when financing conditions and inventories move in opposite directions.",
    publicSections: [
      "The scenario watches order conversion, inventory days, and financing conditions as separate observations. None is presented as a live indicator.",
      "The public framework favors explicit revision triggers over a single directional prediction.",
    ],
    invalidationConditions: [
      "Illustrative orders accelerate without a related increase in inventories.",
      "Financing assumptions no longer constrain the fictional company set.",
    ],
    sourceTitles: [
      "Fictional survey diffusion table",
      "Illustrative inventory-cycle worksheet",
    ],
    disclosure:
      "Fictional public demo research. It is general scenario content and not personalized financial advice.",
    publishedAt: "2026-07-21T09:00:00.000Z",
    version: 1,
    previewOnly: false,
    fictional: true,
  },
  {
    id: "research_grid_constraints",
    slug: "grid-constraints-and-delivery-risk",
    analystId: "analyst_selin_ridge",
    title: "Grid Constraints and Delivery Risk",
    category: "infrastructure",
    assets: ["Power grid", "Data centers", "Utilities"],
    timeHorizon: "18–36 months",
    risk: "elevated",
    thesisSummary:
      "This fictional public scenario maps how interconnection queues, equipment lead times, and permitting could separate announced projects from delivered infrastructure.",
    publicSections: [
      "The demo timeline distinguishes application, approval, equipment, construction, and commissioning milestones.",
      "A project announcement is not treated as delivered capacity, revenue, or proof of demand.",
    ],
    invalidationConditions: [
      "Illustrative queue times compress materially across the fictional project set.",
      "Equipment availability ceases to be a timing constraint in the scenario.",
    ],
    sourceTitles: [
      "Illustrative interconnection queue map",
      "Fictional equipment lead-time register",
    ],
    disclosure:
      "Fictional public demo research. No project sponsorship, ownership, or investment outcome is represented.",
    publishedAt: "2026-07-18T14:30:00.000Z",
    version: 3,
    previewOnly: false,
    fictional: true,
  },
  {
    id: "research_energy_flexibility",
    slug: "energy-flexibility-preview",
    analystId: "analyst_arin_vale",
    title: "Energy Flexibility: Preview Boundary Demo",
    category: "energy",
    assets: ["Energy", "Storage", "Power grid"],
    timeHorizon: "12–24 months",
    risk: "speculative",
    thesisSummary:
      "This fictional card exists to demonstrate an honest preview-only state without placing any locked or paid research text in the public repository.",
    publicSections: [],
    invalidationConditions: [
      "The preview boundary changes in a later, separately authorized product milestone.",
    ],
    sourceTitles: ["Public-demo preview-boundary note"],
    disclosure:
      "Fictional preview-only demo. There is no hidden, paid, encrypted, or remotely loaded body behind this card.",
    publishedAt: "2026-07-16T10:00:00.000Z",
    version: 1,
    previewOnly: true,
    fictional: true,
  },
] as const satisfies readonly DemoResearchCard[];

export const demoNotifications = [
  {
    id: "notification_revision",
    title: "A fictional Research Card revision is available",
    detail: "The AI capacity scenario moved to public demo version 2.",
    createdAt: "2026-07-28T10:30:00.000Z",
    fictional: true,
  },
  {
    id: "notification_topic",
    title: "A demo topic you follow has new public research",
    detail: "Grid constraints now includes an illustrative delivery-risk card.",
    createdAt: "2026-07-27T16:20:00.000Z",
    fictional: true,
  },
  {
    id: "notification_disclosure",
    title: "Disclosure-forward design reminder",
    detail: "All identities, engagement, and research shown in Stage 1 are fictional.",
    createdAt: "2026-07-26T13:10:00.000Z",
    fictional: true,
  },
] as const satisfies readonly DemoNotification[];

export const demoTopics = [
  {
    id: "topic_capacity",
    label: "AI capacity commitments",
    context: "Illustrative discussion about delivery, utilization, and concentration.",
    category: "semiconductors",
    fictional: true,
  },
  {
    id: "topic_inventory",
    label: "Inventory cycle signals",
    context: "Fictional comparison of surveys, orders, and financing conditions.",
    category: "macro",
    fictional: true,
  },
  {
    id: "topic_grid",
    label: "Grid interconnection queues",
    context: "Illustrative timing risks between project announcements and delivery.",
    category: "infrastructure",
    fictional: true,
  },
  {
    id: "topic_storage",
    label: "Flexible energy demand",
    context: "Fictional scenario questions around storage and dispatchable load.",
    category: "energy",
    fictional: true,
  },
] as const satisfies readonly DemoTopic[];

export const demoProfile = {
  id: "profile_local_demo",
  name: "Local Demo Reader",
  handle: "@local.reader.demo",
  initials: "DR",
  note: "A fictional browser-local profile with no account, wallet, or server record.",
  fictional: true,
} as const satisfies DemoProfile;

export function getAnalystById(id: string): DemoAnalyst | undefined {
  return demoAnalysts.find((analyst) => analyst.id === id);
}

export function getAnalystBySlug(slug: string): DemoAnalyst | undefined {
  return demoAnalysts.find((analyst) => analyst.slug === slug);
}

export function getResearchBySlug(slug: string): DemoResearchCard | undefined {
  return demoResearchCards.find((research) => research.slug === slug);
}

export function getDemoContent(locale: AppLocale) {
  void locale;
  return {
    analysts: demoAnalysts,
    posts: demoInsightPosts,
    research: demoResearchCards,
    notifications: demoNotifications,
    topics: demoTopics,
    profile: demoProfile,
  } as const;
}
