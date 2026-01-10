import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "favorites", file: "routes/favorites/index.tsx" },
  { path: "reels", file: "routes/reels/index.tsx" },
  { path: "preferences", file: "routes/preferences/index.tsx" },
  { path: "settings", file: "routes/settings/index.tsx" },
  { path: "user-settings", file: "routes/user-settings/index.tsx" },
  { path: "map", file: "routes/map/index.tsx" },
  { path: "home", file: "routes/home/index.tsx" },
  { path: "login", file: "routes/login/index.tsx" },
  { path: "upload", file: "routes/upload/index.tsx" },
  { path: "popup", file: "routes/popup/index.tsx" },
  { path: "guide", file: "routes/guide/index.tsx" },
  { path: "reels/preview", file: "routes/preview/index.tsx" },
  { path: "test", file: "routes/test/index.tsx" },

  { path: "api/auth/session", file: "routes/api/auth/session/route.ts" },
  { path: "api/auth/logout", file: "routes/api/auth/logout/route.ts" },
  { path: "api/upload", file: "routes/api/upload/route.ts" },
  { path: "api/getreel", file: "routes/api/getreel/route.ts" },

  { path: "api/image", file: "routes/api/image/route.ts" },
  { path: "api/complete", file: "routes/api/complete/route.ts" },
  { path: "api/ai", file: "routes/api/ai/route.ts" },
  { path: "api/files/:objectName", file: "routes/api/files/route.ts" },
] satisfies RouteConfig;
