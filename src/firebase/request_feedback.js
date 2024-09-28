import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

export const requestFeedback = async (user) => {
    // Create the report in the db from the user's credentials
    const report = {
        user_uid: user.uid,
        created_at: new Date(),
        feedback_array: []
    };

    // Create and add a report to reports db, and get the document ID
    const docRef = doc(collection(db, "reports"));
    await setDoc(docRef, report);
    const reportId = docRef.id; // Save the document ID of the report

    // Get the user from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    // Make sure user exists
    if (userDocSnap.exists()) {
        const firestoreUser = userDocSnap.data();
        const userTeams = firestoreUser.teams;

        if (userTeams && userTeams.length > 0) {
            // Query for users that have at least one common team with the current user
            const usersQuery = query(
                collection(db, "users"),
                where("teams", "array-contains-any", userTeams) // Query users with at least one matching team
            );

            const querySnapshot = await getDocs(usersQuery);
            console.log(querySnapshot)

            // Process the results to get only uids
            const similarTeamUserUids = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== user.uid) { // Exclude the current user
                    similarTeamUserUids.push(doc.id); // Only push the user ID (uid)
                }
            });

            console.log(similarTeamUserUids); // This will be an array of uids

            // Loop through similarTeamUserUids and create entries in report_form_join
            for (const similarUserUid of similarTeamUserUids) {
                const reportFormJoinEntry = {
                    rstatus: false, // Set rstatus to false
                    user: similarUserUid, // The uid of the similar user
                    report: reportId // The report document ID created earlier
                };

                // Add the entry to the 'report_form_join' collection
                const reportFormJoinRef = doc(collection(db, "report_form_join"));
                await setDoc(reportFormJoinRef, reportFormJoinEntry);
            }

            console.log("Entries added to report_form_join collection successfully.");
        }
    } else {
        console.log("No such user exists!");
    }
};
