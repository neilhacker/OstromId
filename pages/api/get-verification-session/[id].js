const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import mimc from '../../../public/mimc.ts';
const seedrandom = require('seedrandom');

let seededHash,randSeededNum, mimcVal; 

export default async function handler(req, res) {
  const {id} = req.query;
  const verificationSession = await stripe.identity.verificationSessions.retrieve(id);
  let {status} = verificationSession;
  console.log(verificationSession.metadata.passedDatabaseCheck)
  console.log("\u001b[1;32m [id].js \u001b[0m Polling... ")
  // create random num and mimc hash of that num if session is verified
  if (verificationSession.status == "verified") {
    console.log("\u001b[1;32m [id].js \u001b[0m User id verified ")
    status = "verified_waiting_for_database_check"

    if (verificationSession.metadata.passedDatabaseCheck == "true") {
      console.log("\u001b[1;32m [id].js \u001b[0m User passed database check ")
    
      seededHash = seedrandom(id);
      randSeededNum = seededHash() * 1000000000000000000;
      console.log("\u001b[1;32m [id].js \u001b[0m randSeededNum in [id].js ", randSeededNum)

      mimcVal = mimc(randSeededNum)
      console.log("\u001b[1;32m [id].js \u001b[0m mimc val in [id].js ", mimcVal.toString())
      status = "passed_database_check"
    }
    if (verificationSession.metadata.passedDatabaseCheck == "false") {
      console.log("\u001b[1;32m [id].js \u001b[0m User failed database check ")
      status = "failed_database_check";
    }
  }
  

  res.status(200).json({ status, randSeededNum, mimcVal })
}