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
  ]),
] satisfies RouteConfig;
