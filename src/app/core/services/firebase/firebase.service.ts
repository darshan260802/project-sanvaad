import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { GOOGLE_AUTH_PROVIDER, auth, database } from 'src/firebase.config';

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
      const userRef = doc(database, 'users', userCredential.user.uid);
      const userData = {
        name,
        email,
        status: 'active',
      };
      await setDoc(userRef, userData);
      return userCredential;
    } catch (error) {
      console.log('CreateUserError', error);
      throw error;
    }
  }

  // Login With Email & Password
  async userLogin({
    email,
    password,
  }: Partial<CreateUserParams>): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      const userRef = doc(database, 'users', userCredential.user.uid);
      const userData = {
        name: userCredential.user.displayName,
        email,
        status: 'active',
      };
      await setDoc(userRef, userData);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // Continue with Google
  async continueWithGoogle() {
    try {
      return await signInWithPopup(auth, GOOGLE_AUTH_PROVIDER).then(
        async(result) => {
          const userRef = doc(database, 'users', result.user.uid);
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            status: 'active',
          };
          await setDoc(userRef, userData);
          return result.user;
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      await auth.signOut();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
