// src/products/circle/data.ts

export const circleData = {
  name: "Circle",
  tagline: "The real-time collaborative workspace.",
  description: "A centralized hub for remote teams to collaborate on documents, track project tasks, and communicate in real-time without context switching.",
  features: [
    {
      title: "Real-Time Sync",
      description: "Changes are pushed instantly via WebSockets. No refreshing required.",
      icon: "sync" // We'll map this to an SVG in the component
    },
    {
      title: "Task Automation",
      description: "Set up trigger-based workflows to automatically move tickets and ping stakeholders.",
      icon: "zap"
    },
    {
      title: "Granular Permissions",
      description: "Role-based access control down to the individual document block level.",
      icon: "shield"
    }
  ],
  pricing: [
    {
      tier: "Starter",
      price: "$0",
      features: ["Up to 3 users", "Basic document editing", "Community support"]
    },
    {
      tier: "Pro",
      price: "$12/mo",
      features: ["Unlimited users", "Real-time sync", "Advanced automations", "Priority support"]
    }
  ],
  cta: {
    primary: "Start for free",
    secondary: "View Documentation"
  }
};
