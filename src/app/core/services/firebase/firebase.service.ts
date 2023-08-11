import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { GOOGLE_AUTH_PROVIDER, auth } from 'src/firebase.config';

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
      return error;
    }
  }

  // Login With Email & Password
  async userLogin({ email, password }: Partial<CreateUserParams>): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      return userCredential;
    } catch (error) {
      console.log('LoginUserError', {error});
      throw error;
    }
  }

  // Continue with Google
  async continueWithGoogle() {
    try {
      return await signInWithPopup(auth, GOOGLE_AUTH_PROVIDER).then(
        (result) => {
          return result.user;
        }
      );
    } catch (error) {
      console.log('GOOGLEERROR', error);
      return error;
    }
  }

  // Logout
  async logout() {
    try {
      await auth.signOut();
      return true
    } catch (error) {
      throw error;
    }
  }
}
