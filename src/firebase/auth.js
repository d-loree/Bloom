import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        createdAt: new Date(),
        organization: "Hack the Hill", // Default for now
        teams: [],
      });

      // Add user to the "Hack the Hill" organization document in Firestore
      const organizationDocRef = doc(db, "organizations", "hack-the-hill");
      const orgDoc = await getDoc(organizationDocRef);

      if (orgDoc.exists()) {
        // If the organization document exists, add the user's uid to the members list
        await updateDoc(organizationDocRef, {
          members: arrayUnion(user.uid),
        });
      } else {
        // If the organization document does not exist, create it with the first member
        await setDoc(organizationDocRef, {
          name: "Hack the Hill",
          members: [user.uid],
          createdAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw new Error("Failed to add user to Firestore. Please try again.");
  }
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await addUserToFirestore(user);
    return user;
  } catch (error) {
    console.error("Error creating user with email and password:", error);
    throw new Error("Failed to create user. Please check your input and try again.");
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw new Error("Failed to sign in. Please check your credentials and try again.");
  }
};

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await addUserToFirestore(user);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Failed to sign in with Google. Please try again later.");
  }
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again later.");
  }
};
