"use server";

import { currentUser, auth } from '@clerk/nextjs/server';
import { User as DbUser } from '@/lib/models';
import { connectToDatabase } from '@/lib/mongodb';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'fabric_admin_session';

export async function loginAction(formData: FormData) {
  // Legacy handler - Clerk handles sign-in now
  return { success: false, error: 'La autenticación se realiza mediante Clerk.' };
}

export async function logoutAction() {
  try {
    // Delete legacy cookies if present
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error: any) {
    console.error('Error in logoutAction:', error);
    return { success: false, error: error.message };
  }
}

export async function checkSessionAction() {
  try {
    const { userId } = await auth();
    if (userId) {
      return { authenticated: true };
    }
    // Fallback to legacy cookie check for transition if needed
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (session && session.value === 'fabric_secret_admin_session_token_2026') {
      return { authenticated: true };
    }
    return { authenticated: false };
  } catch (error) {
    console.error('Error in checkSessionAction:', error);
    return { authenticated: false };
  }
}

export async function syncClerkUserAction() {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'No se detectó un usuario autenticado en Clerk.' };
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return { success: false, error: 'Error de conexión con la base de datos.' };
    }

    // Check if user already exists in DB
    let dbUser = await DbUser.findOne({ clerkId: user.id });

    if (!dbUser) {
      const email = user.emailAddresses[0]?.emailAddress || '';
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User';

      dbUser = await DbUser.create({
        clerkId: user.id,
        email: email,
        name: name,
        role: 'admin', // All registrees get admin role by default for now
      });

      console.log(`Clerk user ${email} synced to MongoDB successfully.`);
      return { 
        success: true, 
        message: 'Usuario sincronizado correctamente en la base de datos.',
        user: { email, name, role: 'admin' } 
      };
    }

    return { 
      success: true, 
      message: 'El usuario ya se encuentra registrado.',
      user: { email: dbUser.email, name: dbUser.name, role: dbUser.role } 
    };
  } catch (error: any) {
    console.error('Error in syncClerkUserAction:', error);
    return { success: false, error: error.message };
  }
}
