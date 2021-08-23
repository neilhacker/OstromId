const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    let clientSecret = null;
    let id = null;
    let addressVal = null; // this stays as null for anonymous verification but is actual address for open one

    const adr = req.body.address;
    const verificationType = req.body.verificationType;

    console.log("\u001b[1;32m [CVS] \u001b[0m ", req.body)
    console.log("\u001b[1;32m [CVS] \u001b[0m ", adr)

    const depositCheck = await ethereumStuff(adr);

    console.log(`\u001b[1;32m [CVS] \u001b[0m address ${adr} deposit ${depositCheck}`)

    // passes actual address to metadata if open verification process
    if (verificationType == "open") {
      addressVal = adr;
    }

    if (depositCheck) {
      // if paid deposit create new verification session
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          passedDatabaseCheck: null, 
          verificationType: verificationType,
          address: addressVal,
        }
        
      });

      // lock deposit
      await lockDeposit(adr)

      // Return only the client secret and id to the frontend.
      clientSecret = verificationSession.client_secret;
      id  = verificationSession.id;


    }

      res.status(200).json({ clientSecret, id })
}

const Web3 = require('web3');
const Provider = require('truffle-hdwallet-provider');
const MyContract = require('../../ethereum/build/IdVerification.json');

const address = process.env.ETH_ADDRESS;
const privateKey = process.env.ETH_PRIVATE_KEY; // this is my private key
const infuraUrl = process.env.INFURNA_URL;

const contractAddress = process.env.SOL_CONTRANCT_ADDRESS; // change after deploying new contract version

const web3 = new Web3(infuraUrl);
const myContract = new web3.eth.Contract(
  JSON.parse(MyContract.interface),
  contractAddress
);
web3.eth.accounts.wallet.add(privateKey);

async function ethereumStuff(adr) {
    
  // set up contract and signing key
  console.log("\u001b[1;32m [CVS]->[Depoit check] \u001b[0m checking if deposit paid")


  console.log( "\u001b[1;32m [CVS]->[Depoit check] \u001b[0m Setting up data for transaction..." );

  // set up transaction
  const tx = myContract.methods.checkIfDepositPaid(adr);
  const gas = await tx.estimateGas({from: address});
  const gasPrice = await web3.eth.getGasPrice();
  console.log("\u001b[1;32m [CVS]->[Depoit check] \u001b[0m estimated gas ", gas)
  console.log("\u001b[1;32m [CVS]->[Depoit check] \u001b[0m gas price ", gasPrice)

  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address);
  const txData = {
    from: address,
    to: myContract.options.address,
    data: data,
    gas: gas,
    gasPrice: gasPrice,
    nonce: nonce, 
    chain: 'rinkeby', 
    hardfork: 'istanbul'
  };
  
  // send transaction
  console.log(`\u001b[1;32m [CVS]->[Depoit check] \u001b[0m Waiting for call...`);
  const depositCheckAnswerHex = await web3.eth.call(txData);
  let depositCheckAnswerBool;

  // might want to make the second check else if in case error is returned and this 
  // accidently interprets that as true
  console.log("deposit check: ", depositCheckAnswerHex)
  if (depositCheckAnswerHex == "0x0000000000000000000000000000000000000000000000000000000000000000") {
    depositCheckAnswerBool = false;
  } else {
    depositCheckAnswerBool = true;
  }
  console.log(`\u001b[1;32m [CVS]->[Depoit check] \u001b[0m Call successful, deposit check ${depositCheckAnswerBool}`);


  return depositCheckAnswerBool;
}

async function lockDeposit(adr) {
    
  console.log( "\u001b[1;32m [CVS]->[Lock deposit] \u001b[0m Setting up data for transaction..." );

  // set up transaction
  const tx = myContract.methods.lockDeposity(adr);
  const gas = await tx.estimateGas({from: address});
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address);
  const txData = {
    from: address,
    to: myContract.options.address,
    data: data,
    gas: gas,
    gasPrice: gasPrice,
    nonce: nonce, 
    chain: 'rinkeby', 
    hardfork: 'istanbul'
  };
  
  // send transaction
  console.log(`\u001b[1;32m [CVS]->[Lock deposit] \u001b[0m Waiting for transaction...`);
  const receipt = await web3.eth.sendTransaction(txData);
  console.log("\u001b[1;32m [CVS]->[Lock deposit] \u001b[0m Transaction receipt ", receipt)

  console.log(`\u001b[1;32m [CVS]->[Lock deposit] \u001b[0m Transaction successful`);

}