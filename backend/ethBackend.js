import mimc from '../public/mimc.ts';
import searchDatabase from './mongo.js'

const Web3 = require('web3');
const Provider = require('truffle-hdwallet-provider');
const MyContract = require('../ethereum/build/IdVerification.json');
const seedrandom = require('seedrandom');

const address = process.env.ETH_ADDRESS;
const privateKey = process.env.ETH_PRIVATE_KEY; // this is my private key
const infuraUrl = process.env.INFURNA_URL;

const contractAddress = process.env.SOL_CONTRANCT_ADDRESS; // change after deploying new contract version


export async function EthereumStuff(id) {

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

    var seededHash = seedrandom(id);
    const randSeededNum = seededHash() * 1000000000000000000;
    const mimcVal = mimc(randSeededNum)
    var hexVal = mimcVal.toString(16);
    hexVal = `0x${hexVal}` // turn it into right format for contract

    console.log("\u001b[1;32m [Ethereum] \u001b[0m randSeededNum", randSeededNum)
    console.log("\u001b[1;32m [Ethereum] \u001b[0m mimc val", mimcVal.toString())
    console.log("\u001b[1;32m [Ethereum] \u001b[0m hexVal ", hexVal)
  
    // set up transaction
    const tx = myContract.methods.addNewHash(hexVal);
    const gas = await tx.estimateGas({from: address});
    const gasPrice = await web3.eth.getGasPrice();
    console.log("\u001b[1;32m [Ethereum] \u001b[0m estimated gas ", gas)
    console.log("\u001b[1;32m [Ethereum] \u001b[0m gas price ", gasPrice)

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
    console.log("\u001b[1;32m [Ethereum] \u001b[0m Transaction receipt ", receipt)
    // console.log(`\u001b[1;32m [Ethereum] \u001b[0m Transaction hash: ${receipt.transactionHash}`);
    console.log(`\u001b[1;32m [Ethereum] \u001b[0m Transaction successful`);

    return true;
  }

