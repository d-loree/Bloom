import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

export const requestFeedback = async (user) => {
  try {
    // Step 1: Create the report in the db from the user's credentials
    const report = {
        user_uid: user.uid,
        created_at: new Date(),
        feedback: []
    };

    // Step 2: Create and add a report to reports db, and get the document ID
    try {
      const docRef = doc(collection(db, "reports"));
      await setDoc(docRef, report);
      const reportId = docRef.id; // Save the document ID of the report

      // Step 3: Get the user from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Step 4: Make sure user exists
      if (userDocSnap.exists()) {
        const firestoreUser = userDocSnap.data();
        const userTeams = firestoreUser.teams;

        if (userTeams && userTeams.length > 0) {
          // Step 5: Query for users that have at least one common team with the current user
          try {
            const usersQuery = query(
              collection(db, "users"),
              where("teams", "array-contains-any", userTeams) // Query users with at least one matching team
            );

            const querySnapshot = await getDocs(usersQuery);
            console.log(querySnapshot);

            // Step 6: Process the results to get only uids
            const similarTeamUserUids = [];
            querySnapshot.forEach((doc) => {
              if (doc.id !== user.uid) {
                // Exclude the current user
                similarTeamUserUids.push(doc.id); // Only push the user ID (uid)
              }
            });

            console.log(similarTeamUserUids); // This will be an array of uids

            // Step 7: Loop through similarTeamUserUids and create entries in report_form_join
            for (const similarUserUid of similarTeamUserUids) {
              try {
                const reportFormJoinEntry = {
                  rstatus: false, // Set rstatus to false
                  user: similarUserUid, // The uid of the similar user
                  report: reportId, // The report document ID created earlier
                };

                // Step 8: Add the entry to the 'report_form_join' collection
                const reportFormJoinRef = doc(collection(db, "report_form_join"));
                await setDoc(reportFormJoinRef, reportFormJoinEntry);
              } catch (error) {
                console.error(`Error adding entry to report_form_join for user ${similarUserUid}:`, error);
              }
            }

            console.log("Entries added to report_form_join collection successfully.");
          } catch (error) {
            console.error("Error querying users with common teams:", error);
            throw new Error("Failed to query users with common teams. Please try again later.");
          }
        } else {
          console.log("User is not part of any team.");
        }
      } else {
        console.error("No such user exists!");
        throw new Error("No such user exists in Firestore.");
      }
    } catch (error) {
      console.error("Error creating report or fetching user data:", error);
      throw new Error("Failed to create report or fetch user data. Please try again later.");
    }
  } catch (error) {
    console.error("Error in requestFeedback function:", error);
    throw new Error("An unexpected error occurred while requesting feedback. Please try again later.");
  }
};
