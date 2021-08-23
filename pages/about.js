import React, { Component } from "react";
import { Card, Button, Input, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from '../routes';
import web3 from '../ethereum/web3'
import Router from 'next/router'
import OptionButton from "../components/OptionButton";


class About extends Component {
  state = {
    optionAnonymous: true,
  }
 
  changeVerificationType = () => {
    this.setState({optionAnonymous: !this.state.optionAnonymous})  
  }
    
  renderAboutInfo() {
    if (this.state.optionAnonymous) {
      return (
        <div>
        <h2>How does Anonymous verification work? </h2>

        <div className="aboutBox">
        <h3>Step 1. Connect wallet (~10s)</h3>
        <li>This app requires you to connect with a metamask wallet, you can find the button to do 
          so in the status section of the home page</li>
        </div>

        <div className="aboutBox">
        <h3>Step 2. Deposit (~30s)</h3>
        <li>Stripe charges for every verification and so to prevent unlimited funds being spent users 
          have to register a deposit on chain from an account they control before they will be able to 
          carry on the verification process</li>
        </div>

        <div className="aboutBox">
        <h3>Step 3. Verify (~2-4m)</h3>
        <li>Click the "verify" button which will bring up the Stripe Idenity flow</li>
        <li>You then submit your identity documents which then get verified if real</li>
        <li>If your verification check comes back as a success we then check to 
          see if you've been through the process before (this helps provide sybil resistance)</li>
        <li>If that check passes then it means you are a new user of this service...welcome </li>
        <li>The server then sends a hash to our smart contract that you will use to verify yourself on chain</li>
        </div>

        <div className="aboutBox">
        <h3>Step 4. Prove (~30s)</h3>
        <li>You get sent two bits of information 1. a preimage 2. the hash of that preimage (the same hash sent on chain) </li>
        <li>You can then copy these details over to our proof generator and click "send"</li>
        <li>This creates a ZKP that you know the preimage to the hash that was sent on chain</li>
        <li>This proof is then sent to the smart contract and if it is a valid ZKP the contract then 
          looks to see if the hash has been uploaded by the server </li>
        <li>If both checks pass then the address that sent the transaction is whitelisted and the hash 
          is deactivated. </li>
        </div>
        
        </div>
      )
    } else {
      return (
        <div>
        <h2>How does Open verification work? </h2>

        <div className="aboutBox">
        <h3>Step 1. Connect wallet (~10s)</h3>
        <li>This app requires you to connect with a metamask wallet, you can find the button to do 
          so in the status section of the home page</li>
        </div>

        <div className="aboutBox">
        <h3>Step 2. Deposit (~30s)</h3>
        <li>Stripe charges for every verification and so to prevent unlimited funds being spent users 
          have to register a deposit on chain from an account they control before they will be able to 
          carry on the verification process</li>
        </div>

        <div className="aboutBox">
        <h3>Step 3. Verify (~2-4m)</h3>
        <li>Click the "verify" button which will bring up the Stripe Idenity flow</li>
        <li>You then submit your identity documents which then get verified if real</li>
        <li>If your verification check comes back as a success we then check to 
          see if you've been through the process before (this helps provide sybil resistance)</li>
        <li>If that check passes then it means you are a new user of this service...welcome </li>
        <li>The server then submits your name and active metamask account to the smart contract</li>
        <li>That's it for this type of verirication</li>
        </div>

       
        </div>
      )
    }
  }


  render() {
    return (
      <>
        <Layout>
            <div>
              <div style={{marginTop: 25}}>
              <div onClick={this.changeVerificationType} style={{marginBottom: 25}}>
              <OptionButton ></OptionButton>
              </div>
                {this.renderAboutInfo()}
            </div>
            </div>
        </Layout>
      </>
    );
  }
}

export default About;
