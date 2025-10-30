import { createRequire } from "module";
const require = createRequire(import.meta.url);
const admin = require("firebase-admin");

import { prisma } from "~/lib/service/prisma";

/**
 * FireBaseAdmin初期化
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/**
 * CookieからFirebaseトークンを検証し、ユーザーを取得
 **/
export async function getUser(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("=")),
  );

  const idToken = cookies["token"];
  if (!idToken) return null;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return user;
  } catch (err) {
    console.error("Firebase token verify failed:", err);
    return null;
  }
}
