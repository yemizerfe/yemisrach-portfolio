/**
 * The résumé document, verbatim.
 *
 * Transcribed from the CV (v10) the way it is written, so the page and the
 * printed PDF say the same thing in the same order. Nothing here is derived or
 * rephrased: the site's marketing copy lives in `data/site.ts`, and this file is
 * the document itself.
 */

export interface ResumeRole {
  title: string;
  organisation: string;
  location: string;
  meta?: string;
  bullets: string[];
}

export interface ResumeProject {
  name: string;
  summary: string;
  stack: string;
  href: string;
  bullets: string[];
}

export const resume = {
  name: "Yemisrach Zerfe",
  headline: "Backend Software Engineer",
  location: "Addis Ababa, Ethiopia",
  phone: "+251924798364",
  phoneHref: "tel:+251924798364",
  email: "yemisrachzerfe021@gmail.com",

  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yemisrach-zerfe-14884a360" },
    { label: "GitHub", href: "https://github.com/yemizerfe" },
    { label: "My Website", href: "https://yemisrach-portfolio.vercel.app/" },
  ],

  summary:
    "Backend Software Engineer focused on building reliable, maintainable, and data-driven backend services, REST APIs, and database-driven applications. Experienced in designing relational data models, implementing authentication and authorization systems, integrating external business APIs, and structuring modular application architecture using Node.js, Express.js, TypeScript, Python, FastAPI, PostgreSQL, and MongoDB. Committed to clean code, secure API design, and practical backend problem-solving.",

  skills: [
    {
      label: "Programming Languages",
      items: "TypeScript, JavaScript, Python, SQL",
    },
    {
      label: "Backend Technologies & APIs",
      items: "Node.js, Express.js, FastAPI, REST APIs, WebSockets",
    },
    {
      label: "Databases",
      items: "PostgreSQL, MongoDB, Redis, MySQL",
    },
    {
      label: "Security & Authentication",
      items: "JWT, OAuth 2.0, bcrypt, Role-Based Access Control (RBAC), Helmet, Rate Limiting",
    },
    {
      label: "DevOps & Development Tools",
      items: "Git, GitHub, Docker, Nginx, Postman, Bruno, Slack",
    },
  ],

  experience: [
    {
      title: "Freelance Software Engineer",
      organisation: "Fine Furniture",
      location: "Debre Markos, Ethiopia",
      meta: "Freelance / Client Project",
      bullets: [
        "Designed and developed the backend and database architecture for a furniture e-commerce website, supporting customer product browsing and catalog management.",
        "Implemented secure administrative functionality allowing the business owner to add, update, manage, and delete product listings, photographs, descriptions, and pricing.",
        "Built database-driven backend services and REST API communication to dynamically retrieve and display product information on the customer-facing storefront.",
      ],
    },
    {
      title: "Virtual Software Engineering Intern",
      organisation: "Intern2Grow",
      location: "Remote",
      meta: "Sept. 2026 – Oct. 2026",
      bullets: [
        "Developed a Personal Blog API handling 4 core CRUD operations for article creation, retrieval, updates, and deletion.",
        "Implemented a 3-page template-based authentication application supporting account signup, login, profile management, and session data display.",
        "Engineered an HTTP proxy server accepting request URLs, headers, and request bodies to forward API traffic and return response data to clients.",
      ],
    },
    {
      title: "Software Engineering Intern",
      organisation: "ERP Solutions PLC",
      location: "Addis Ababa, Ethiopia",
      meta: "3 Months",
      bullets: [
        "Contributed to backend development for an automotive e-commerce and car-parts platform, implementing product management and automotive inventory workflows.",
        "Developed relational database operations and REST API endpoints supporting product catalogs, automotive categories, and order processing.",
        "Collaborated with engineering teams on backend feature implementation, debugging, database maintenance, and Git-based version control.",
      ],
    },
  ] satisfies ResumeRole[],

  projects: [
    {
      name: "EstatePlus",
      summary: "Real-Estate Market Intelligence Platform",
      stack: "Node.js, Express.js, TypeScript, PostgreSQL",
      href: "https://github.com/yemizerfe/EstatePlus",
      bullets: [
        "Integrated BinaSmart property search services to retrieve Addis Ababa property listings and market intelligence data.",
        "Integrated the National Bank of Ethiopia exchange-rate API to collect and process currency and economic data.",
        "Designed PostgreSQL database models and data-processing workflows for property listings, financial imports, dashboards, and analytical reports.",
      ],
    },
    {
      name: "CEOOO",
      summary: "Business Operations & Integration Platform",
      stack: "Next.js, TypeScript, OAuth, Business Integrations",
      href: "https://github.com/yemizerfe/ceooo",
      bullets: [
        "Implemented Salesforce and Google Sheets integrations for connecting platform workflows to external business data and spreadsheets.",
        "Engineered a private HubSpot OAuth connector with a dedicated OAuth callback flow configured for secure read-only access.",
        "Built OAuth authorization mechanisms and third-party API communication channels to centralize external business platform data.",
      ],
    },
    {
      name: "weCare",
      summary: "Dementia Support & Care Management Platform",
      stack: "Node.js, Express.js, MongoDB, React",
      href: "https://github.com/yemizerfe/weCare",
      bullets: [
        "Developed backend services for patient and caregiver accounts featuring role-based access control and caregiver invitation codes.",
        "Implemented core care management features including reminders, daily routines, shared care notes, private memory albums, and progress tracking.",
        "Integrated Open-Meteo weather data, image uploads with a 5 MB restriction, and patient-controlled location sharing limited to 30 minutes.",
      ],
    },
  ] satisfies ResumeProject[],

  education: {
    degree: "Bachelor of Science in Software Engineering",
    institution: "Debre Markos University, Ethiopia",
    detail: "CGPA: 3.99/4.00",
  },
} as const;
