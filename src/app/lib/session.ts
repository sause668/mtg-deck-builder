import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import type { SessionPayload } from "@/app/lib/definitions";

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getEncodedKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey || secretKey.length < 16) {
    throw new Error("SESSION_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secretKey);
}

type SessionClaims = {
  userId: string;
  userRole: string;
  userRoleId: string;
};

export async function encrypt(claims: SessionClaims): Promise<string> {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE_SECONDS * 1000);
  return new SignJWT({
    userId: claims.userId,
    userRole: claims.userRole,
    userRoleId: claims.userRoleId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getEncodedKey());
}

export async function decrypt(
  session: string | undefined,
): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    const userId = payload.userId as string | undefined;
    const userRole = payload.userRole as string | undefined;
    const userRoleId = payload.userRoleId as string | undefined;
    if (!userId || !userRole || !userRoleId) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string,
  userRole: string,
  userRoleId: string,
) {
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE_SECONDS * 1000);
  const token = await encrypt({ userId, userRole, userRoleId });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(token);
}

export async function updateSession() {
  const session = await verifySession();
  if (!session?.userId) return null;

  const userId = session.userId as string;
  const userRole = session.userRole as string;
  const userRoleId = session.userRoleId as string;

  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE_SECONDS * 1000);
  const token = await encrypt({ userId, userRole, userRoleId });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
