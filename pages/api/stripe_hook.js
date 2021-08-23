import { sha256 } from 'js-sha256';
import { EthereumStuff } from '../../backend/ethBackend';
import { openVerificationEthFunction } from '../../backend/ethOpenVerification';
import searchDatabase from '../../backend/mongo.js'

const stripe = require('stripe')(process.env.STRIPE_RESTRICTED_KEY);
const stripeSecret = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    //todo: check stripe signing key
    if (req.method === "POST") {
        const event = req.body;

        // need to verifiy that event came from stripe 
        // https://stripe.com/docs/identity/handle-verification-outcomes
      
        // Handle the event
        switch (event.type) {
          case 'identity.verification_session.verified': {
              // All the verification checks passed
              const verificationSession = event.data.object;
              await handleSuccessfulVerification(verificationSession);
              
              
              break;
            }
        
          default:
            // Unexpected event type
            console.log(`❌ Unhandled event type ${event.type}.`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.send();
        // res.status(200).json({ })
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
}

const handleSuccessfulVerification = async (verificationSession) => {
  console.log( "\u001b[1;32m [Stripe] \u001b[0m Identity verification session verified" );

  const verificationType = verificationSession.metadata.verificationType;
  const adr = verificationSession.metadata.address;
  console.log("\u001b[1;32m [Stripe] \u001b[0m MetaData-verificationType: ", verificationType)
  console.log("\u001b[1;32m [Stripe] \u001b[0m MetaData-address: ", adr)

  // get verified outputs to check database
  const verifiedOutputs = await stripe.identity.verificationSessions.retrieve(
    verificationSession.id,
    {
      expand: [
        'verified_outputs',
        'verified_outputs.dob',
      ],
    }
  );

  console.log( "\u001b[1;32m [Stripe] \u001b[0m Hashing user details..." );
  const hash = makeHashOfDetails(verifiedOutputs);
  console.log("\u001b[1;32m [Stripe] \u001b[0m Hash made: ", hash)

  // ----------------------------------------------------------------------------            
  // ------------------------------search database-------------------------------
  // ----------------------------------------------------------------------------            

  const res = await searchDatabase(hash).catch(console.error);
  console.log("\u001b[1;32m [Stripe] \u001b[0m result of database check: ", res)
  // if user exists already don't send transaction
  if (res == false) {
    await stripeSecret.identity.verificationSessions.update(
      verificationSession.id,
      {metadata: {passedDatabaseCheck: false}}
    );
    return false;
  }
  // ----------------------------------------------------------------------------            
  // ------------------------------anonymous flow-------------------------------
  // ----------------------------------------------------------------------------            
  if (verificationType == "anonymous") {
    console.log("\u001b[1;32m [Stripe] \u001b[0m In ANONYMOUS flow: ")
    const anonymousRes = await EthereumStuff(verificationSession.id);
    
    await stripeSecret.identity.verificationSessions.update(
      verificationSession.id,
      {metadata: {passedDatabaseCheck: true}}
    );
  }
  // ----------------------------------------------------------------------------            
  // ---------------------------------open flow----------------------------------
  // ----------------------------------------------------------------------------      
  if (verificationType == "open") {
    console.log("\u001b[1;32m [Stripe] \u001b[0m In OPEN flow: ")
    
    const firstName = verifiedOutputs.verified_outputs.first_name.toString().toLowerCase();
    const lastName = verifiedOutputs.verified_outputs.last_name.toString().toLowerCase();
    const name = firstName+" "+lastName;

    const openRes = await openVerificationEthFunction(adr, name);

    await stripeSecret.identity.verificationSessions.update(
      verificationSession.id,
      {metadata: {passedDatabaseCheck: true}}
    );
  }      

}

const makeHashOfDetails = (verifiedOutputs) => {
  const firstName = verifiedOutputs.verified_outputs.first_name.toString().toLowerCase();
  const lastName = verifiedOutputs.verified_outputs.last_name.toString().toLowerCase();
  const dayStr = verifiedOutputs.verified_outputs.dob.day.toString();
  const monthStr = verifiedOutputs.verified_outputs.dob.month.toString();
  const yearStr = verifiedOutputs.verified_outputs.dob.year.toString();

  const combination = firstName + lastName + dayStr + monthStr + yearStr;

  const hashCombination = sha256(combination);
  return hashCombination;

} 

export default handler;