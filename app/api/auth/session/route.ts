import { NextRequest, NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/models/user.server";
import * as admin from "firebase-admin";

// Firebase Admin SDK の初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await findOrCreateUser({
      firebaseUid: decoded.uid,
      email: decoded.email ?? "",
      name: decoded.name ?? "",
      avatar: decoded.picture ?? "",
    });
    const res = NextResponse.json(user);
    res.cookies.set("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600,
    });
    return res;
  } catch (err) {
    console.error(err);
    const res = NextResponse.json({ error: "ユーザー作成に失敗しました" }, { status: 500 });
    res.cookies.set("token", "", { path: "/", maxAge: 0 });
    return res;
  }
}