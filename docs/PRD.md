# Product Requirements Document (PRD)

## 1. Executive Summary

- **Problem Statement**: The developer needs to establish a professional online presence to showcase their portfolio to employers/clients, while simultaneously providing a scalable platform to launch and build an audience for future products.
- **Proposed Solution**: A dual-purpose Astro-based static website that houses a personal portfolio alongside isolated, scalable product landing pages.
- **Success Criteria**:
  - Achieve 90+ Lighthouse scores across Performance, SEO, and Accessibility.
  - Successfully deploy the initial version within 1-2 weeks.
  - Zero cost for initial infrastructure (utilizing free tiers).

## 2. User Experience & Functionality

- **User Personas**:
  - **Employers & Clients**: Looking for evidence of technical competence, past projects, and contact information.
  - **Early Adopters & Customers**: Looking for clear value propositions, product features, and ways to sign up or purchase future products.
- **User Stories**:
  - `As a potential employer`, I want to `easily navigate to the portfolio and about sections` so that `I can assess the developer's skills and experience.`
  - `As a potential customer`, I want to `view a dedicated product landing page without portfolio distractions` so that `I can focus entirely on the product's value proposition.`
  - `As the site owner`, I want to `add a new product landing page by creating a new folder` so that `I can scale my product offerings without rewriting global routing or UI logic.`
- **Acceptance Criteria**:
  - Portfolio pages (Home, About, Projects) share a global navigation and footer.
  - Product landing pages (`/landing/*`) are isolated and do not inherit global portfolio navigation.
  - Content for products and projects is strictly typed and managed via Astro Content Collections.
- **Non-Goals**:
  - Building a full CMS or dynamic backend (static content only for MVP).
  - Building global UI components that cater to every possible future product (favor duplication over early abstraction).
  - E-commerce functionality (handling payments directly on the site for now).

## 3. Technical Specifications

- **Tech Stack Overview**:
  - **Framework**: Astro + TypeScript
  - **Styling**: Tailwind CSS v4
  - **State Management**: Nanostores (for lightweight state sharing, e.g., theme toggles or simple cart logic)
  - **Backend/Database**: Static Content (Markdown/MDX via Astro Content Collections)
  - **Deployment**: Vercel (with future VPS migration considerations)
- **Architecture Overview & Folder Structure**:
  - **Directory Tree**:
    ```text
    /src
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── shared/
    ├── content/
    │   ├── blog/
    │   └── projects/
    ├── layouts/
    ├── pages/
    │   ├── blog/
    │   ├── projects/
    │   └── landing/
    ├── products/
    │   └── product-a/
    │       ├── components/
    │       └── assets/
    ├── styles/
    └── utils/
    ```
  - **`src/components/`**: Reusable UI building blocks (e.g., `ui/`, `layout/`, `shared/`). Strictly generic and decoupled from product domains.
  - **`src/products/`**: Isolated domains for product landing pages (e.g., `src/products/product-a/`). Contains components, assets, and data files exclusively for that product to ensure infinite scalability and easy extraction.
  - **`src/layouts/`**: Page wrappers like `BaseLayout.astro` (SEO/global tags) and `ProductLayout.astro` (clean layout without global navigation).
  - **`src/pages/`**: File-based routing combining portfolio routes (`index.astro`, `blog/`) and product landing routes (`landing/product-a/`).
  - **`src/content/`**: Type-safe markdown collections for blog posts and portfolio projects using Astro's Zod configuration.
  - **Best Practices**: Favor duplication over early abstraction (don't force a generic component until you reuse it 3+ times), keep pages static unless interactivity is strictly required, and rely on `BaseHead.astro` for centralized SEO.
- **Integration Points**:
  - Build pipeline on Vercel hooked to the main Git branch.
- **Security & Privacy**:
  - Static site nature inherently mitigates many common web vulnerabilities (XSS, SQLi).
  - No user data stored in a database currently.

## 4. Risks & Roadmap

- **Phased Rollout**:
  - **Phase 1 (Weeks 1)**: Portfolio scaffolding, Tailwind v4 setup, and Vercel deployment.
  - **Phase 2**: First product landing page implementation using the `src/products/` isolation pattern.
  - **Phase 3 (Future)**: VPS deployment migration and potential integration of backend services (e.g., Supabase) when user accounts/payments are needed.
- **Technical Risks**:
  - **Tailwind v4 Beta Constraints**: Relying on the latest Tailwind v4 might introduce minor tooling bugs or compatibility issues with older Astro integrations. Mitigation: Keep configurations minimal.
  - **VPS Migration Overhead**: Moving from Vercel to a VPS later requires manual CI/CD setup and static asset serving (e.g., Nginx). Mitigation: Keep the build process strictly static (`astro build`) to ensure portability.
