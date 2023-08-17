import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  and,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
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
        photoURL: userCredential.user.photoURL,
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
        photoURL: userCredential.user.photoURL,
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
        async (result) => {
          const userRef = doc(database, 'users', result.user.uid);
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            status: 'active',
            photoURL: result.user.photoURL,
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

  // ================================================ USER Conversations ================================================

  // get conversation list
  async getConversations() {
    if (!auth.currentUser) {
      await auth.authStateReady();
      if (!auth.currentUser) throw new Error('User not logged in');
    }

    try {
      const user_id = auth.currentUser.uid;
    } catch (error) {
      throw error;
    }
  }

  // get searched users
  async getSearchedUsers(q: string) {
    try {
      // ~ = \uf8ff
      const data = (await getDocs(collection(database, 'users'))).docs
        .map((doc) => ({ ...doc.data(), uid: doc.id }))
        .filter((item: any) =>
          (item['name'] as string).toLowerCase().includes(q.toLowerCase())
        );

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Create Conversation
  async createConversation(receiverId: string) {
    try {
      const searchQuery = query(
        collection(database, 'conversations'),
        where('users', 'array-contains', auth.currentUser?.uid)
      );
      const data = (await getDocs(searchQuery)).docs
        .map((item) => item.data())
        .filter(
          (item) => item['type'] === 'duo' && item['users'].includes(receiverId)
        );
      if (data.length) {
        return data[0];
      }

      const conversation_data = [auth.currentUser?.uid, receiverId];

      const conversation = await addDoc(collection(database, 'conversations'), {
        users: conversation_data,
        type: 'duo',
      });
      return conversation;
    } catch (error) {
      throw error;
    }
  }

// // get UserConversations
//   getUserConversations():Observable<any>{
//     return onSnapshot(query(collection(database, 'conversations'), where('users', 'array-contains', auth.currentUser?.uid)), (snapshot) => {
//       return snapshot.docs.
//     })
//   }

}
