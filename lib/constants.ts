export const NAVBAR_HEIGHT = 80;

export const NAV_LINKS = [
  { label: "About", href: "#approach" },
  { label: "Services", href: "#services" },
  { label: "Plans", href: "#plans" },
  { label: "Contact", href: "#contact" },
];

export const CORE_SERVICES = [
  {
    title: "EMI Restructuring",
    desc: "We reorganize your EMIs into formats that actually work for your budget.",
    icon: "LayoutGrid",
  },
  {
    title: "Financial Planning",
    desc: "A clear, structured plan to prevent future stress and lock in long-term stability.",
    icon: "TrendingUp",
  },
  {
    title: "Debt Management",
    desc: "Strategic advice to cut your financial burden and restore balance — fast.",
    icon: "Shield",
  },
  {
    title: "1-on-1 Consultation",
    desc: "Private expert sessions, tailored entirely to your situation and goals.",
    icon: "UserCheck",
  },
] as const;

export type Plan = {
  title: string;
  subtitle: string;
  tagline: string;
  features: string[];
};

export const PLANS_GROUP_A: Plan[] = [
  {
    title: "VIP upgrade plan",
    subtitle: "Premium support, priority access",
    tagline: "Priority-based premium assistance",
    features: [
      "Priority eligibility review",
      "Faster processing",
      "Dedicated support",
    ],
  },
  {
    title: "EMI protection pool",
    subtitle: "Your safety net for tough times",
    tagline: "Protection during unforeseen circumstances",
    features: [
      "Income loss coverage",
      "Medical emergency aid",
      "Disruption support",
    ],
  },
  {
    title: "Instant EMI optimization",
    subtitle: "Cut your EMI burden fast",
    tagline: "Professional review and restructuring",
    features: [
      "Monthly EMI reduction",
      "Better affordability",
      "More flexibility",
    ],
  },
  {
    title: "EMI DNA plan",
    subtitle: "Your financial blueprint",
    tagline: "Customized framework for your needs",
    features: [
      "Income flow analysis",
      "Financial behavior profiling",
      "Full commitment mapping",
    ],
  },
  {
    title: "AI rental plan",
    subtitle: "AI-powered rental processing",
    tagline: "Smart rental assessment and approval assistance.",
    features: [
      "Monthly EMI reduction",
      "Better affordability",
      "More flexibility",
    ],
  },
  {
    title: "Business collaboration",
    subtitle: "Strategic partnerships for growth",
    tagline: "Connect, collaborate, and expand opportunities.",
    features: [
      "Business networking support",
      "Partnership opportunity mapping",
      "Growth-focused collaboration",
    ],
  },
];

export const PLANS_GROUP_B: Plan[] = [
  {
    title: "EMI flexi pause plan",
    subtitle: "Press pause. Stay protected.",
    tagline: "Structured pause with continuity",
    features: [
      "Pause or adjust EMIs",
      "Zero unnecessary penalties",
      "Keep continuity intact",
    ],
  },
  {
    title: "Refer & reduce program",
    subtitle: "Share it. Save on EMIs.",
    tagline: "Share the benefit, reduce your burden",
    features: [
      "Every referral cuts your EMI",
      "Transparent benefit calculation",
      "Direct reduction applied",
    ],
  },
  {
    title: "Extended EMI support",
    subtitle: "Support beyond the basics",
    tagline: "Continued guidance through critical times",
    features: [
      "Ongoing financial guidance",
      "Flexible repayment help",
      "Continuous progress tracking",
    ],
  },
];

export const ALL_PLANS = [...PLANS_GROUP_A, ...PLANS_GROUP_B];

export const APPROACH_POINTS = [
  {
    number: "01",
    title: "Cut the complexity",
    desc: "We strip away the confusion and give you clear, actionable steps — so every decision feels confident.",
  },
  {
    number: "02",
    title: "Built around you",
    desc: "Every plan is custom-built around your income, EMIs, and goals — nothing generic.",
  },
  {
    number: "03",
    title: "We stay with you",
    desc: "From day one to full recovery — we're your partner, not just a one-time consultation.",
  },
];

export const WHO_WE_SERVE = [
  {
    icon: "Briefcase",
    title: "Salaried Professionals",
    desc: "Juggling multiple EMIs on a fixed income? We restructure, reduce, and simplify.",
  },
  {
    icon: "Store",
    title: "Small Business Owners",
    desc: "Uneven revenue, stacking debts? We bring structure to the chaos.",
  },
  {
    icon: "Home",
    title: "Families with Loans",
    desc: "Home loans, car EMIs, personal credit — one plan to manage them all.",
  },
  {
    icon: "GraduationCap",
    title: "Anyone Seeking Guidance",
    desc: "Need honest, structured financial advice? We're the people to call.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "What is The Seven Pounds?",
    answer:
      "We provide customized debt relief and EMI management solutions to help individuals regain financial stability.",
  },
  {
    question: "Is The Seven Pounds an investment company?",
    answer:
      "No. We are a financial consulting firm that offers debt management and EMI relief guidance.",
  },
  {
    question: "Is there any hidden cost?",
    answer: "No. We maintain complete transparency with no hidden charges.",
  },
  {
    question: "Does the government allow The Seven Pounds to operate?",
    answer:
      "Yes. We legally operate as a financial consultancy and advisory service.",
  },
  {
    question: "How can The Seven Pounds help reduce my EMI burden?",
    answer:
      "We analyze your finances and suggest practical EMI optimization solutions.",
  },
  {
    question: "Will The Seven Pounds expand across India?",
    answer:
      "Yes. We plan to expand our services across India after successful regional operations.",
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: "BadgeCheck",
    title: "Honest & transparent",
    desc: "Every interaction, every recommendation — fully grounded in honesty.",
  },
  {
    icon: "CircleSlash",
    title: "Zero fake promises",
    desc: "No false guarantees. Just honest, practical guidance that actually helps.",
  },
  {
    icon: "Lock",
    title: "100% confidential",
    desc: "Your data stays yours. Maximum protection, always.",
  },
  {
    icon: "Fingerprint",
    title: "Built for you",
    desc: "No cookie-cutter plans. Every solution is designed around your exact situation.",
  },
  {
    icon: "Target",
    title: "Long-term results",
    desc: "We're not here for quick fixes. We're here for your lasting financial health.",
  },
];

export const CONSULTATION_FEE_PAISE = 49900; // ₹499 in paise

export const SITE_METADATA = {
  name: "The Seven Pounds",
  tagline: "EMI relief. Real results.",
  description:
    "Structured EMI relief and honest financial guidance — cut the chaos, rebuild stability, and own your finances again.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thesevenpounds.in",
};
