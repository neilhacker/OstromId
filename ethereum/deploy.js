const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const IdVerification = require('./build/IdVerification.json')
const Verifier = require('./build/Verifier.json')

const provider = new HDWalletProvider(
  process.env.ETH_MNEMONIC,
  // remember to change this to your own phrase!
  process.env.INFURNA_URL
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(IdVerification.interface))
    .deploy({ data: IdVerification.bytecode })
    .send({ gas: "10000000", from: accounts[0] }); // NB: got error when trying to deploy with 10x less gas than this

  console.log("ID Contract deployed to", result.options.address);

  const result2 = await new web3.eth.Contract(JSON.parse(Verifier.interface))
    .deploy({ data: Verifier.bytecode })
    .send({ gas: "10000000", from: accounts[0] });

  console.log("Verifier Contract deployed to", result2.options.address);
};
deploy();
