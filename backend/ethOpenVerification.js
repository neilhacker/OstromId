const Web3 = require('web3');
const Provider = require('truffle-hdwallet-provider');
const MyContract = require('../ethereum/build/IdVerification.json');
const seedrandom = require('seedrandom');

const address = process.env.ETH_ADDRESS;
const privateKey = process.env.ETH_PRIVATE_KEY; // this is my private key
const infuraUrl = process.env.INFURNA_URL;

const contractAddress = process.env.SOL_CONTRANCT_ADDRESS; // change after deploying new contract version


export async function openVerificationEthFunction(adr, name) {

    // set up contract and signing key
    console.log( "\u001b[1;32m [Ethereum] \u001b[0m Setting up contract and signing key..." );

    const web3 = new Web3(infuraUrl);
    const myContract = new web3.eth.Contract(
      JSON.parse(MyContract.interface),
      contractAddress
    );
    web3.eth.accounts.wallet.add(privateKey);
  
    // set up info for transaction
    // take session id and seed random num generator with it so [id].js will be able to get same num
    // get random num
    // get Mimc hash of this num (this is the value we will claim we know the pre image of)
    // convert Mimc hash to hex and store this val in contract
    // this hex value will be the last input of zkp
  
    console.log( "\u001b[1;32m [Ethereum] \u001b[0m Setting up data for transaction..." );

  
    // set up transaction
    const tx = myContract.methods.addOpenVerification(adr, name);
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
    console.log(`\u001b[1;32m [Ethereum] \u001b[0m Waiting for transaction...`);
    const receipt = await web3.eth.sendTransaction(txData);
  
    // console.log(`\u001b[1;32m [Ethereum] \u001b[0m Transaction hash: ${receipt.transactionHash}`);
    console.log(`\u001b[1;32m [Ethereum] \u001b[0m Transaction successful`);

    return true;
  }

