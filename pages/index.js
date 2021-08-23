import React, { Component } from "react";
import { Message, Input, Loader, Grid } from "semantic-ui-react";

import Layout from "../components/Layout";
import PreImageButton from "../components/PreImageButton";
import HashButton from "../components/HashButton";
import AccountMessage from "../components/Accounts";
import OptionButton from "../components/OptionButton";
import OpenVerificationMessage from "../components/OpenVerificationMessage";

import factory from "../ethereum/verification";
import Web3 from "web3"; // use this to have connect account button
let web3; 

import { calculateProof } from '../public/prover.js'

import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);


class VerificationIndex extends Component {
 
   state = {
    errorMessage: '',
    errorTrue: false,
    verificationType: "anonymous",   
    // eth
    accountAlreadyVerified: false,
    account: "No account",
    network: "No network",
    accountDetailsRetrieved: false,
    openVerificationName: null,
    // stripe
    clientSecret: null,
    stripe: null,
    verification_session_id: null,
    sessionIdRandNum: null,
    sessionIdMimcNum: null,
    //deposit
    depositAlreadyPaid: false,
    deposit_Status: "Not paid",
    loaderDepositActive: false,
    // verification
    verification_status: "Not started",
    loaderVerificationActive: false,
    // proof
    proof_status: "Not sent",
    loaderProofActive: false,
    //login
    loginDetailsRecieved: false, // this is for if they get details in current session
    hasLoginDetails: false, // this is for if they already have details
    //zkp
    mimcHashNumState:null,
    solidityVerifierProof:null,
  };  

  componentDidMount = async () => {
    console.log(process.env.STRIPE_PUBLIC_KEY)
    // check if metamask installed and account connected
    const metaMaskPresent = await this.connectMetaMaskAccountInitialCheck();
    if(!metaMaskPresent) {return;}

    // checking if account is already verified
    // at the moment I haven't disabled rest of flow if already verified to make testing easier
    const alreadyVerified = await this.checkIfAccountVerified();

    // check if deposit is paid
    const paidDeposit = await this.checkDepositPaid();
    // if(!paidDeposit) {return;} // this should be live for actual flow
    
  }

  resetError = () => {
    this.setState({errorTrue: false, errorMessage: ""});
  }  

  changeVerificationType = () => {
    if(this.state.verificationType == "anonymous") {
      console.log("changing verification type to open")
      this.setState({verificationType: "open"})
    } else {
      console.log("changing verification type to anonymous")
      this.setState({verificationType: "anonymous"})
    }
  }

  //-------------------------------------------------------------------------------------------
  // --------------------------------------METAMASK STUFF--------------------------------------
  //-------------------------------------------------------------------------------------------
  connectMetaMaskAccountInitialCheck = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // We are in the browser and metamask is running.
      
      web3 = new Web3(window.ethereum);

      var address = await ethereum.selectedAddress;
      var network = ethereum.networkVersion;

      console.log("account", address)
      console.log("network", network)

      const net = this.networkIntToName(network)

      this.setState({network: net, account: address})

      if (address != null) {
        console.log("setting retireved")
        this.setState({accountDetailsRetrieved: true})
        return true
      }
      return false

    } else {
      // We are on the server *OR* the user is not running metamask
      const provider = new Web3.providers.HttpProvider(
        process.env.INFURNA_URL
      );
      return false
    }
  }
  
  connectMetaMaskAccount = async () => {
    // let web3;
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // We are in the browser and metamask is running.
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      web3 = new Web3(window.ethereum);

      var address = await ethereum.selectedAddress;
      var network = ethereum.networkVersion;

      console.log("[WALLET] Connecting to Metamask account")
      console.log("[WALLET] account", address)
      console.log("[WALLET] network", network)

      const net = this.networkIntToName(network)

      this.setState({network: net, account: address})

      if (address != null) {
        this.setState({accountDetailsRetrieved: true})
        await this.checkIfAccountVerified()
        await this.checkDepositPaid()
      }

    } else {
      // We are on the server *OR* the user is not running metamask
      const provider = new Web3.providers.HttpProvider(
        process.env.INFURNA_URL
      );
    }
  }

  networkIntToName = (networkId) => {
    switch(networkId) {
      case "1":
          return "Main"
      case "3":
        return "Ropsten"
      case "4":
        return "Rinkeby"
      case "42":
        return "Kovan";
      case "5":
        return "Goerli";
      default: 
        return "Custom";
    }
}


  checkIfAccountVerified = async () => {
    console.log("[VERIFY RESULT] Checking if account is verified...")
    try {
      const accounts = await web3.eth.getAccounts();
      let anonymousRes = await factory.methods
        .checkIfAddressVerified()
        .call({
            from: accounts[0]
      });

      let name = await factory.methods
        .checkIfAddressOpenVerified()
        .call({
            from: accounts[0]
      });

      // name is null if it has no value which is falsy
      if (name || anonymousRes) {
        console.log("[VERIFY RESULT] address is verified")
        this.setState({accountAlreadyVerified: true});
      } else {
        console.log("[VERIFY RESULT] address is NOT verified")
        this.setState({accountAlreadyVerified: false});
      }
      return true;

    } catch (err) {
        console.log("MetaMask error")
        this.setState({ 
          errorMessage: "It looks like you may be on the wrong MetaMask network", 
          errorTrue: true });
        return false;
    }
  }

  //-------------------------------------------------------------------------------------------
  // --------------------------------------DEPOSIT STUFF--------------------------------------
  //-------------------------------------------------------------------------------------------

  checkDepositPaid = async () => {
    console.log("[DEPOSIT] checking if deposit paid...")
    try {
      const accounts = await web3.eth.getAccounts();
      let res = await factory.methods
        .checkIfDepositPaid()
        .call({
            from: accounts[0]
      });
      // this should be uncommented eventually as it will block the verifcation button if no deposit is paid
      this.setState({depositAlreadyPaid: res});

      if(res) {
        console.log("[DEPOSIT] deposit paid")
        this.setState({deposit_Status: "Paid"})
      } else {
        console.log("[DEPOSIT] deposit NOT paid")
        this.setState({deposit_Status: "Not paid"})
      }
      return res;

    } catch (err) {
        console.log("error when initially checking account")
        this.setState({ 
          errorMessage: "It looks like there was an error checking if you had paid the deposit", 
          errorTrue: true });
        return false;
    } 
  }

  sendDeposit = async () => {
    this.setState({ loaderDepositActive: true});

    console.log("[DEPOSIT] sending deposit...")

    try {
      this.setState({deposit_Status: "Sending deposit..."})
      const accounts = await web3.eth.getAccounts();
      await factory.methods
          .payDeposit()
          .send({
              from: accounts[0],
              value: 20 // 20 wei deposit
      });
  
      let res = await factory.methods
          .checkIfDepositPaid()
          .call({
              from: accounts[0]
      });
      
      if (res) {
          console.log("[DEPOSIT] deposit transaction successful")
          this.setState({depositAlreadyPaid: res, deposit_Status: "Paid"})
      }
  
    } catch (err) {
        console.log("error in submit sol proof")
        this.setState({ errorMessage: err.message, errorTrue: true });
    }
  this.setState({ loaderDepositActive: false});
  
  }

  //-------------------------------------------------------------------------------------------
  // --------------------------------------STRIPE STUFF--------------------------------------
  //-------------------------------------------------------------------------------------------

  createNewStripeSession = async () => {
    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({ verification_status: "server checking deposit payment" })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: 'POST of metamask address',
          address: accounts[0],
          verificationType: this.state.verificationType })
      };

      console.log("[VERIFICATION] sending address & verification type to server...")
      const response = await fetch('/api/create-verification-session', requestOptions);
      const data = await response.json();
      this.setState({clientSecret: data.clientSecret, verification_session_id: data.id})
      console.log("[VERIFICATION] starting stripe ID flow...")
      this.setState({ stripe: await stripePromise })
    } catch (err) {
      console.log("error when trying to create new verification session")
      this.setState({ 
        errorMessage: "It looks like there was an issue creating a new verification session", 
        errorTrue: true });
      return false;
    }

  }


  verifyIdentity = async (event) => {
    event.preventDefault();

    this.resetError()
    this.setState({ loaderVerificationActive: true});

    console.log("[VERIFICATION] starting verification process...")

    // creating new stripe session on button click
    await this.createNewStripeSession();

    let { stripe, clientSecret } = this.state;
    
    if (!stripe || !clientSecret) {
      this.setState({ loaderVerificationActive: false, errorTrue: true, errorMessage: "Stripe not connecting"});
      return;
    }

    // Show the verification modal.
    const { error } = await stripe.verifyIdentity(clientSecret);
    
    if (error) {
      console.log('[error]', error);
    } else {
      console.log('Verification submitted!');
      this.pollForStatus();
    }

  }

  pollForStatus = async() => {

    if(this.state.verification_status !== "passed_database_check" && this.state.verification_status !== "failed_database_check") {
      setTimeout(this.pollForStatus, 5000)
      this.fetchStatus()
    }
    if(this.state.verification_status !== "processing" && 
        this.state.verification_status !== "not_submitted" && 
        this.state.verification_status !== "verified_waiting_for_database_check" &&
        this.state.verification_status !== "server checking deposit payment") 
        {
          this.setState({ loaderVerificationActive: false});
          
          if(this.state.verification_status == "passed_database_check") {
            console.log("[VERIFICATION] passed database and verification checks")
            this.setState({loginDetailsRecieved: true, hasLoginDetails: true});
        }
    }

  }

fetchStatus = async () => {
    console.log("[VERIFICATION] polling for verification status...")
    //handle error if session id isn't set
    fetch('/api/get-verification-session/' + this.state.verification_session_id)
      .then(res => res.json())
      .then(data => this.setState({
        verification_status: data.status, 
        sessionIdRandNum: data.randSeededNum,
        sessionIdMimcNum: data.mimcVal,
      }))
  }

  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------
  // ------------------------------------LOGIN DETAILS STUFF------------------------------------
  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------

  hasLoginCredentials = () => {
    this.setState({hasLoginDetails: true})
  }


submitSolProof = async () => {
  // event.preventDefault();
  this.resetError()
  this.setState({ loaderProofActive: true});

  console.log("[PROOF] creating ZKP")

  // CREATING ZKP FROM HASH AND PRE-IMAGE 
  this.setState({proof_status: "Creating ZKP"})
  const preImage = parseInt(document.getElementById('preImageCredential').value);
  console.log("[PROOF] pre-image: ",preImage)
  const hash = document.getElementById('mimcHashCredential').value;
  console.log("[PROOF] MiMC hash: ",hash)
  const solidityProof = await calculateProof(preImage, hash);
  // this.setState({solidityVerifierProof: solidityProof});
  console.log("[PROOF] ZKP: ", solidityProof)


  // SUBMIT ZKP TO CONTRACT  
  console.log("[PROOF] submitting ZKP")

  this.setState({proof_status: "Starting ETH transaction"})

  const fullProof = JSON.parse("[" + solidityProof + "]");

  const pi_a = fullProof[0]
  const pi_b = fullProof[1]
  const pi_c = fullProof[2]
  const inputs = fullProof[3]
  

  // send zk proof to verifyHash function
  try {
      this.setState({proof_status: "Submitting ZKP..."})
      const accounts = await web3.eth.getAccounts();
      await factory.methods
          .verifyHash(pi_a,pi_b,pi_c,inputs)
          .send({
              from: accounts[0]
      });

      console.log("[PROOF] submitted ZKP successfully")
      console.log("[PROOF] checking if ZKP passed verification checks...")
      let res = await factory.methods
          .checkIfAddressVerified()
          .call({
              from: accounts[0]
      });

      console.log("[PROOF] address verirification status: ", res)
      this.setState({accountAlreadyVerified: res});

    } catch (err) {
        console.log("error in submit sol proof")
        this.setState({ errorMessage: err.message, errorTrue: true });
    }

    this.setState({loaderProofActive: false});
  }

  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------
  // ----------------------------------RENDER INFO FUNCTIONS-----------------------------------
  //-------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------

  renderOpenVerificationMessage() {
    if (this.state.verificationType=="open") {
      return (
        <OpenVerificationMessage></OpenVerificationMessage>
      )
    } else {
      return null
    }
  }

  renderAccountInfo() {
    if (!this.state.accountDetailsRetrieved) {
      return (
        <button onClick={this.connectMetaMaskAccount} 
        className="button"                                    
        >Connect Wallet</button>
      )
    } else {
      return (
        <AccountMessage 
        network={this.state.network} 
        account={this.state.account}
        verified={this.state.accountAlreadyVerified}
        name={this.state.openVerificationName}
      />
      )
    }
  }

  renderProofInfo() {
    // if on open verification mode no proof is needed so don't render
    if (this.state.verificationType=="open") {
      return null;
    }
    // if on anonymous mode look if we have wallet account detail
    if (this.state.accountDetailsRetrieved) {
       // if we have them render button asking if they already have details 
      if (!this.state.hasLoginDetails) {
        return (
        <div>
          <h3>Proof: {this.state.proof_status} &nbsp; &nbsp;
          {
            this.state.loaderProofActive ?
            <Loader active inline size="small" />: null
          }
          </h3>
          
          <button onClick={this.hasLoginCredentials} 
          disabled={!this.state.accountDetailsRetrieved}
          className="button" 
          >If you already have login credentials click here</button>
        </div>
        ) 
      } 
      // otherwise render button to send proof 
      else {
        return (
          <div>
            <h3>Proof: {this.state.proof_status} &nbsp; &nbsp;
            {
              this.state.loaderProofActive ?
              <Loader active inline size="small" />: null
            }
            </h3>
            <button onClick={this.submitSolProof} 
            disabled={!this.state.accountDetailsRetrieved}
            className="button" 
            >Send proof</button>
        </div>
        )
      }
    }  else {
      return (
        <h3>Proof: {this.state.proof_status} &nbsp; &nbsp;
        {
          this.state.loaderProofActive ?
          <Loader active inline size="small" />: null
        }
        </h3>
      )
    }
  }


  render() {
    return (
        <Layout >
            <div>
              <div style={{marginTop: 25}}>

              <div onClick={this.changeVerificationType} style={{marginBottom: 25}}>
              <OptionButton ></OptionButton>
              </div>
              {this.renderOpenVerificationMessage()}
              

              <Grid >
                <Grid.Column width={6} floated='left' className="statusBox">
                        {/* --------------------SESSION STATUS--------------------- */}
                        <h2 className="centeredHeader">Status </h2>
                        {/* --------------------address status--------------------- */}
                          <h3>Account:</h3>
                          {this.renderAccountInfo()}

                         {/* --------------------deposit status--------------------- */}
                          <h3>Deposit: {this.state.deposit_Status} &nbsp; &nbsp;
                          {
                            this.state.loaderDepositActive ?
                            <Loader active inline size="small" />: null
                          }
                          </h3>

                          {
                            (!this.state.depositAlreadyPaid && this.state.accountDetailsRetrieved) ?
                            <button onClick={this.sendDeposit} 
                            disabled={!this.state.accountDetailsRetrieved}
                            className="button" 
                            >Send deposit</button>
                            : null
                          }
                          {/* --------------------verification status--------------------- */}
                          <h3>Verification Session: {this.state.verification_status} &nbsp; &nbsp;
                          {
                            this.state.loaderVerificationActive ?
                            <Loader active inline size="small" />: null
                          }
                          </h3>
                          {
                            this.state.depositAlreadyPaid ?
                            <button onClick={this.verifyIdentity} 
                            disabled={!this.state.accountDetailsRetrieved}
                            disabled={!this.state.depositAlreadyPaid}
                            className="button" 
                            >Verify</button>
                            : null
                          }
                          {/* --------------------proof message--------------------- */}
                          {this.renderProofInfo()}

                          {/* --------------------error message--------------------- */}
                          {
                          this.state.errorTrue ?
                          <Message negative>
                            <Message.Header>Error</Message.Header>
                            <p>{this.state.errorMessage}</p>
                          </Message> : null
                          }
                          
                    </Grid.Column>
                    {
                      (this.state.verificationType !== "open") ?

                    
                    <Grid.Column  width={9} floated='right' className="statusBox" >
                      {/* --------------------LOGIN CREDENTIALS--------------------- */}
                      {/* only show if user has logindetails recieved in current session */}
                      <h2>Login credentials</h2>
                      {
                        // !this.state.loginDetailsRecieved ?
                        this.state.loginDetailsRecieved ?
                        <div>
                          <h3>Pre-image: &nbsp; <br></br> </h3> 
                          <PreImageButton>{this.state.sessionIdRandNum}</PreImageButton>
                      
                          <h3>Hash: &nbsp; <br></br></h3>
                          {/* <HashButton>13430753380610635471786589099759983096423845689623637123238304661144465381689</HashButton> */}
                          <HashButton>{this.state.sessionIdMimcNum}</HashButton>

                        </div> : <h4>No login details yet...</h4>
                      }
                                      
                      <hr/>
                      {/* ---------------------SUBMIT PROOF---------------------- */}
                      {/* only show if hasLoginDetails is true  */}
                      <h2>Create and submit proof</h2>
                      {
                      this.state.hasLoginDetails ?
                      <p>
                      <p><Input id="preImageCredential" placeholder="Pre-image"></Input></p>
                      <p><Input id="mimcHashCredential" placeholder="Hash"></Input></p>
                      </p> : null
                      }
                      
                    </Grid.Column>
                    : null
                    }
                </Grid>
            </div>
            </div>
        </Layout>
    );
  }
}

export default VerificationIndex;
