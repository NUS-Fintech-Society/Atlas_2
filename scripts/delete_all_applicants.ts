import { db } from '~/server/db/admin_firebase'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import { appliedRoleCollection } from '~/server/db/collections/admin/AppliedRoleCollection'

/**
 * This script is meant for deleting all the applicants information from the database
 * to save space and help with the next recruitment for the next AY.
 * 
 * WARNING: This script should only be executed once after recruitment has ended.
 * DO NOT ATTEMPT TO DO SO DURING RECRUITMENT AS IT WILL LEAD TO UNEXPECTED BEHAVIOUR.
 */
async function deleteAllApplicants() {
    try {
        const batch = db.batch()
        const batches = [batch]
        let batch_index = 0
        let batch_size = 0
      
        const applicants = await userCollection
          .queryBuilder()
          .where('department', '==', 'Unassigned')
          .where('role', '==', 'Applicants')
          .get()
      
        /// Delete all the applicants from the users collection
        applicants.forEach((applicant) => {
          batches[batch_index]?.delete(db.collection("users").doc(applicant.id))
          batch_size += 1
      
          if (batch_size === 499) {
            batch_size = 0
            batch_index += 1
            batches.push(db.batch())
          }
        })
      
        /// Delete all the applied roles from the applied role collection.
        const applied_roles = await appliedRoleCollection.queryBuilder().get()
        applied_roles.forEach((role) => {
          batches[batch_index]?.delete(db.collection("applied_roles").doc(role.id))
          batch_size += 1
      
          if (batch_size === 499) {
              batch_size = 0
              batch_index += 1
              batches.push(db.batch())
          }
        })
      
        await Promise.all(batches.map((batch) => batch.commit()))
        return { message: "Successful" }
    } catch (e) {
        return { message: (e as Error).message }
    }
}

deleteAllApplicants().then(console.log).catch(console.error)