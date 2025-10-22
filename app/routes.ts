import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "signup", file: "routes/signup/index.tsx" },
  { path: "favorites", file: "routes/favorites/index.tsx" },
  { path: "mypage", file: "routes/mypage/index.tsx" },
  { path: "reels", file: "routes/reels/index.tsx" },
  { path: "preferences", file: "routes/preferences/index.tsx" },
  { path: "edit-settings", file: "routes/edit-settings/index.tsx" },
  { path: "reels-loading", file: "routes/reels-loading/index.tsx" },
  { path: "user-settings", file: "routes/user-settings/index.tsx" },
  { path: "post", file: "routes/post/index.tsx" },
] satisfies RouteConfig;
