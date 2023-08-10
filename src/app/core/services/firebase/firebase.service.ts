import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from 'src/firebase.config';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  // ================================================ Auth Status ================================================

  // Check Login Status
  async isLoggedIn(): Promise<boolean> {
    if (auth.currentUser) {
      return true;
    }
    await auth.authStateReady();
    return !!auth.currentUser;
  }

  // ================================================ USER Info ================================================

  // Get user id
  async getUserId(): Promise<string> {
    await auth.authStateReady();
    return auth.currentUser?.uid ?? '';
  }

  // Get User Info
  async getUserInfo(): Promise<any> {
    await auth.authStateReady();
    return auth.currentUser;
  }

  // ================================================ USER Auth ================================================

  // Signup With Email & Password
  async createUser({ name, email, password }: CreateUserParams): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential;
    } catch (error) {
      console.log('CreateUserError', error);
      return null;
    }
  }
}
