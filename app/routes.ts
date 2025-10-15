import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "signup", file: "routes/signup/index.tsx" },
  { path: "favorites", file: "routes/favorites/index.tsx" },
] satisfies RouteConfig;
