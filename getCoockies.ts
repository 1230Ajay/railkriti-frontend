"use server";
import { getSession } from "next-auth/react";

export async function getStoredJwt(): Promise<string | null> {
  const session = await getSession(); // This will fetch the session from the server-side cookie

  // Check if session exists and if JWT is available in the session
  return session?.accessToken || null;
}
