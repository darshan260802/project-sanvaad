// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth , GoogleAuthProvider} from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIG9wJo3GfxA0226hDQg8N0plp_cHJPaw',
  authDomain: 'projectsanvaad.firebaseapp.com',
  projectId: 'projectsanvaad',
  storageBucket: 'projectsanvaad.appspot.com',
  messagingSenderId: '661334686084',
  appId: '1:661334686084:web:93d4c2041bd449748f45d1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app)
const GOOGLE_AUTH_PROVIDER = new GoogleAuthProvider();

// Export Everything
export default app;
export { auth , GOOGLE_AUTH_PROVIDER, database};