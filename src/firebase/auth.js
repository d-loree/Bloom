import { auth, db } from "./firebase";
import {  doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

// Add a new user to Firestore if they don't already exist
const addUserToFirestore = async (user) => {
  const userDocRef = doc(db, "users", user.uid); // Document reference for the user
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      createdAt: new Date(),
    });
  }
}

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  await addUserToFirestore(user);
  return user;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  await addUserToFirestore(user);
  return user;
};

export const doSignOut = () => {
  return auth.signOut();
};