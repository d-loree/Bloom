import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

export const getTeamMembers = async (user) => {

    let jsonObject = {};

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const firestoreUser = userDocSnap.data();
    //const userTeams = firestoreUser.teams;
    const teams = firestoreUser.teams
    
    for (let i = 0; i < teams.length; i++) {

        const usersQuery = query(
            collection(db, "users"),
            where("teams", "array-contains", teams[i]) // Query users with at least one matching team
        );
        const querySnapshot = await getDocs(usersQuery);
        console.log(querySnapshot)
    
        // Process the results to get only uids
        const similarTeamUserUids = [];
        querySnapshot.forEach((doc) => {
            if (doc.id !== user.user) { // Exclude the current user
                similarTeamUserUids.push(doc.data().email); // Only push the user ID (uid)
            }
        });
        // console.log(teams[i])
        // console.log(similarTeamUserUids);
        jsonObject[teams[i]] = similarTeamUserUids

    }
    console.log(jsonObject)
    return jsonObject

};


