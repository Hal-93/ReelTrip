import * as admin from "firebase-admin";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function getUser() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("token")?.value;
  if (!idToken) return null;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return user;
  } catch (err) {
    console.error(err);
    const res = NextResponse.next();
    res.cookies.set("token", "", { path: "/", maxAge: 0 });
    return null;
  }
}