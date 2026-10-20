// src/utils/techIcons.ts
import fs from 'node:fs';
import { createRequire } from 'node:module';

type Variant = 'light' | 'dark' | 'grayscale';

interface IconEntry {
  svg: Record<Variant, string>;
}

let iconCache: Record<string, IconEntry> | null = null;

// Built-in high-quality custom SVGs for specific tools not present or under different names in tech-stack-icons
const customIcons: Record<string, string> = {
  fastapi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path fill="#009688" d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0z"/><path fill="#ffffff" d="M55.8 19L27 54.5h20.7L43.8 81l29.2-35.5H52.3L55.8 19z"/></svg>`,
  ffmpeg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><path fill="#007808" d="M10 20h80v60H10z" rx="8"/><path fill="#ffffff" d="M26 35h24v7H34v8h14v7H34v13H26V35zm28 0h24v7H62v8h14v7H62v13H54V35z"/><path fill="#00B400" d="M37 45l8 12h-6l-5-8-5 8h-6l8-12z"/></svg>`,
  mqtt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="#660066"/><path fill="#ffffff" d="M25 65l12-30h8l12 30h-7l-3-8H39l-3 8h-7zm16-14h8l-4-11-4 11zm18 14V35h7v30h-7zm11 0V35h7v30h-7z"/></svg>`,
  midtrans: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="#002D62"/><path d="M25 35h50v8H25zm0 15h32v8H25zm0 15h42v8H25z" fill="#00AEFF"/><circle cx="72" cy="65" r="7" fill="#00FFC2"/></svg>`,
  ssr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="84" height="24" x="8" y="16" rx="4" fill="#1E293B" stroke="#38BDF8" stroke-width="4"/><circle cx="20" cy="28" r="4" fill="#38BDF8"/><rect width="84" height="24" x="8" y="44" rx="4" fill="#1E293B" stroke="#38BDF8" stroke-width="4"/><circle cx="20" cy="56" r="4" fill="#38BDF8"/><rect width="84" height="24" x="8" y="72" rx="4" fill="#1E293B" stroke="#38BDF8" stroke-width="4"/><circle cx="20" cy="84" r="4" fill="#38BDF8"/><path d="M50 35l12 15h-8v12h-8V50h-8l12-15z" fill="#F0562E"/></svg>`
};

// Aliases mapping human-readable skills or project tech items to canonical icon names
const skillAliases: Record<string, string> = {
  // Full-Stack & APIs
  'typescript': 'typescript',
  'python': 'python',
  'nestjs': 'nestjs',
  'nest.js': 'nestjs',
  'fastapi': 'fastapi',
  'next.js': 'nextjs2',
  'nextjs': 'nextjs2',
  'react': 'react',
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'tailwind css': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
  'astro': 'astro',
  'zustand': 'zustand',
  'tanstack': 'tanstack',
  'tanstack query': 'reactquery',
  'react query': 'reactquery',
  'redux': 'redux',
  'restful apis': 'openapi',
  'restful api': 'openapi',
  'rest': 'openapi',
  'openapi': 'openapi',
  'postman': 'postman',

  // Databases & Real-Time
  'postgresql': 'postgresql',
  'postgresql (pgvector, timescaledb)': 'postgresql',
  'pgvector': 'postgresql',
  'timescaledb': 'postgresql',
  'redis': 'redis',
  'redis (streams, pub/sub)': 'redis',
  'socket.io': 'socketio',
  'socketio': 'socketio',
  'mqtt': 'mqtt',
  'prisma': 'prisma',
  'prisma orm': 'prisma',
  'typeorm': 'typeorm',
  'sqlalchemy': 'sqlalchemy',

  // AI & Media Integration
  'computer vision (yolo)': 'opencv',
  'computer vision': 'opencv',
  'opencv': 'opencv',
  'yolo': 'opencv',
  'rag/llm apis': 'langchain',
  'rag': 'langchain',
  'langchain': 'langchain',
  'openai': 'openai',
  'gpt-4o': 'openai',
  'rtsp/hls video streaming': 'stream',
  'rtsp/hls': 'stream',
  'video streaming': 'stream',
  'mediamtx': 'stream',
  'ffmpeg': 'ffmpeg',

  // DevOps & Cloud Infrastructure
  'google cloud': 'gcloud',
  'google cloud platform': 'gcloud',
  'gcp': 'gcloud',
  'gcloud': 'gcloud',
  'microservices architecture': 'docker',
  'microservices': 'docker',
  'docker': 'docker',
  'docker compose': 'docker',
  'nginx': 'nginx',
  's3 storage': 'aws',
  's3': 'aws',
  'aws': 'aws',
  'amazon web services': 'aws',
  'azure': 'azure',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'cloudflare': 'cloudflare',
  'vercel': 'vercel',
  'linux': 'linux',
  'prometheus': 'prometheus',
  'git': 'git',
  'gitlab': 'gitlab',
  'github': 'github',
  'ci/cd': 'gitlab',

  // Projects & Additional Stacks
  'express': 'expressjs',
  'express.js': 'expressjs',
  'supabase': 'supabase',
  'midtrans api': 'midtrans',
  'midtrans': 'midtrans',
  'ssr': 'ssr'
};

function loadIcons(): Record<string, IconEntry> {
  if (iconCache) return iconCache;

  try {
    const require = createRequire(import.meta.url);
    const resolvedPath = require.resolve('tech-stack-icons');
    const content = fs.readFileSync(resolvedPath, 'utf8');
    const match = content.match(/var f=({.*?});var h=f;/);
    if (match && match[1]) {
      // Evaluate the icon dictionary object
      iconCache = new Function(`return ${match[1]}`)();
    }
  } catch (err) {
    console.warn('[techIcons] Could not load tech-stack-icons bundle:', err);
    iconCache = {};
  }

  return iconCache || {};
}

let idCounter = 0;
function scopeIds(svgStr: string, prefix: string): string {
  const matches = [...svgStr.matchAll(/\bid="([^"]+)"/g)];
  if (matches.length === 0) return svgStr;

  const idSet = new Set(matches.map(m => m[1]));
  let result = svgStr;
  for (const id of idSet) {
    const scopedId = `${prefix}-${id}`;
    result = result
      .replaceAll(`id="${id}"`, `id="${scopedId}"`)
      .replaceAll(`url(#${id})`, `url(#${scopedId})`)
      .replaceAll(`href="#${id}"`, `href="#${scopedId}"`);
  }
  return result;
}

export function resolveIconName(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  if (skillAliases[normalized]) {
    return skillAliases[normalized];
  }
  // Try stripped punctuation
  const stripped = normalized.replace(/[^a-z0-9]/g, '');
  if (skillAliases[stripped]) {
    return skillAliases[stripped];
  }
  return normalized;
}

export function getTechIconSvg(nameOrSkill: string, variant: Variant = 'light'): string | null {
  const canonical = resolveIconName(nameOrSkill);

  // Check custom icons first
  if (customIcons[canonical]) {
    return customIcons[canonical];
  }

  const icons = loadIcons();
  const entry = icons[canonical];

  if (!entry || !entry.svg) {
    return null;
  }

  // Choose the best variant: try requested variant, fallback to dark/light
  let svg = entry.svg[variant] || entry.svg.light || entry.svg.dark || Object.values(entry.svg)[0];
  if (!svg) return null;

  // Ensure unique clip-path and gradient IDs so multiple instances don't clash
  const uniqueId = `ti-${canonical}-${++idCounter}`;
  svg = scopeIds(svg, uniqueId);

  return svg;
}
