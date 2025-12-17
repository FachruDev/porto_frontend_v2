import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin/login", "routes/admin/login.tsx"),
  route("admin", "routes/admin/_layout.tsx", [
    index("routes/admin/index.tsx"),
    route("heroes", "routes/admin/heroes.tsx"),
    route("about", "routes/admin/about.tsx"),
    route("web-config", "routes/admin/web-config.tsx"),
    route("contact-info", "routes/admin/contact-info.tsx"),
    route("experiences", "routes/admin/experience/experiences.tsx"),
    route("experiences/new", "routes/admin/experience/experience-new.tsx"),
    route("experiences/:id", "routes/admin/experience/experience-edit.tsx"),
    route("skills", "routes/admin/skills/skills.tsx"),
    route("skills/new", "routes/admin/skills/skill-new.tsx"),
    route("skills/:id", "routes/admin/skills/skill-edit.tsx"),
    route("certificates", "routes/admin/certificate/certificates.tsx"),
    route("certificates/new", "routes/admin/certificate/certificate-new.tsx"),
    route("certificates/:id", "routes/admin/certificate/certificate-edit.tsx"),
  ]),
] satisfies RouteConfig;
