import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "signup", file: "routes/signup/index.tsx" },
  { path: "reels", file: "routes/reels/index.tsx" },
  { path: "preferences", file: "routes/preferences/index.tsx" },
  { path: "edit-settings", file: "routes/edit-settings/index.tsx" },
  { path: "reels-loading", file: "routes/reels-loading/index.tsx" },
  { path: "user-settings", file: "routes/user-settings/index.tsx" },
] satisfies RouteConfig;
