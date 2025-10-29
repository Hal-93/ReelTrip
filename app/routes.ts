import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "signup", file: "routes/signup/index.tsx" },
  { path: "login", file: "routes/login/index.tsx" },
  { path: "favorites", file: "routes/favorites/index.tsx" },
  { path: "mypage", file: "routes/mypage/index.tsx" },
  { path: "reels", file: "routes/reels/index.tsx" },
  { path: "preferences", file: "routes/preferences/index.tsx" },
  { path: "edit-settings", file: "routes/edit-settings/index.tsx" },
  { path: "reels-loading", file: "routes/reels-loading/index.tsx" },
  { path: "user-settings", file: "routes/user-settings/index.tsx" },
  { path: "post", file: "routes/post/index.tsx" },
  { path: "maptest", file: "routes/maptest/index.tsx" },
  { path: "home", file: "routes/home/index.tsx" },
  { path: "upload", file: "routes/upload/index.tsx" },

  //API関連
  { path: "api/auth/session", file: "routes/api/auth/session/route.ts" },
  { path: "api/auth/logout", file: "routes/api/auth/logout/route.ts" },
] satisfies RouteConfig;
