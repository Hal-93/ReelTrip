import { createRequire } from "module";
const require = createRequire(import.meta.url);
const admin = require("firebase-admin");

import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { findOrCreateUser } from "~/lib/models/user.server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const idToken = body?.idToken;
    if (!idToken) return;

    const decoded = await admin.auth().verifyIdToken(idToken);

    await findOrCreateUser({
      firebaseUid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "",
      avatar: decoded.picture ?? "",
    });

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${idToken}; HttpOnly; Path=/; Max-Age=3600; ${
        process.env.NODE_ENV === "production" ? "Secure; SameSite=Lax" : ""
      }`
    );

    return redirect("/home", { headers });
  } catch (error) {
    console.error("🔥 Session action error:", error);
    return;
  }
}