"use server";
import { cookies } from 'next/headers'

export async function getStoredJwt(): Promise<string | null> {
    const token =  await cookies().get("jwt");
    return token?.value || null;
}
