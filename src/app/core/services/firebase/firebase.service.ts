import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  documentId,
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
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
        lastActive: 'active',
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
        .filter(
          (item: any) =>
            (item['name'] as string).toLowerCase().includes(q.toLowerCase()) &&
            item.uid !== auth.currentUser?.uid
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
        .map((item) => ({...item.data(), uid: item.id}))
        .filter(
          (item:any) => item['type'] === 'duo' && item['users'].includes(receiverId)
        );
      if (data.length) {
        return data[0].uid;
      }

      const conversation_data = [auth.currentUser?.uid, receiverId];

      const conversation = await addDoc(collection(database, 'conversations'), {
        users: conversation_data,
        type: 'duo',
        lastMessage: '',
      });
      return conversation.id;
    } catch (error) {
      throw error;
    }
  }

  // get UserConversations
  getUserConversations(): Observable<any> {
    const conversations = new BehaviorSubject<any[]>([]);
    onSnapshot(
      query(
        collection(database, 'conversations'),
        where('users', 'array-contains', auth.currentUser?.uid)
      ),
      async (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        }));
        data.forEach((item: any) => {
          const user =
            (item['users'] as string[]).find(
              (user: string) => user !== auth.currentUser?.uid.toString()
            ) ??
            auth.currentUser?.uid ??
            '';
          delete item['users'];
          onSnapshot(doc(database, 'users', user), (doc) => {
            item['user'] = doc.data();
          })
        });
        conversations.next(data);
      }
    );
    return conversations;
  }

  // go offline
  updateUserStatus(newStatus: 'active' | 'inactive' | 'away') {
    updateDoc(doc(database, 'users', auth.currentUser?.uid ?? ''), {
      status: newStatus,
      lastActive: Date.now(),
    });
  }
  // get messages
  getConversationMessages(conversationId: string) :Observable<any>{
  const messages = new BehaviorSubject<any[]>([])
    onSnapshot(query(collection(database, 'messages'), where('conversationId','==',conversationId), orderBy('createdAt')),(data)=>{
      const msgArr = data.docs.map(item => item.data())
      messages.next(msgArr)
    })
    return messages
  }
  async getConversationDetails(conversationId: string) {
    const conversation = (await getDoc(doc(database, 'conversations',conversationId))).data();
    if(!conversation) throw new Error("Conversation Not Found")
    const receiverId = (conversation['users'] as string[]).find(usr => usr !== auth.currentUser?.uid ?? '');
    if(!receiverId) throw new Error("Receiver Not Found")
    const user = (await getDoc(doc(database, 'users',receiverId))).data();
    return {...user, uid: receiverId}
  }

  async createMessage(conversationId:string,content:string ){
    return await addDoc(collection(database, 'messages'),{
      messageContent:content,
      conversationId,
      createdAt: Date.now(),
      senderId: auth.currentUser?.uid ?? '',
    })
  }
}
