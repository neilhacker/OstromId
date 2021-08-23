import React, { Component } from "react";
import { Button, Input, Message } from "semantic-ui-react";
import Layout from "../components/Layout";
import web3 from '../ethereum/web3'
import Router from 'next/router'
import factory from "../ethereum/verification";


class CheckAddress extends Component {
 
    state = {
        errorMessage: "",
        errorTrue: false,
        addressCheckRes: null,
        verification_status: null,
        open_verification_status: null,
        loaderActive: false,
    }
    verifyAddress = async() => {
        const adr = document.getElementById('addressToCheck').value;
        this.setState({loaderActive: true})
        
        try {
          this.setState({verification_status: "Sending address..."})
          const accounts = await web3.eth.getAccounts();
          
          let res = await factory.methods
              .checkIfAddressVerified(adr)
              .call({
                  from: accounts[0]
          });
          console.log("good call", res)

          if (res) {
              this.setState({verification_status: "Address verified"})
          } else {
            this.setState({verification_status: "Address not verified"})
          }
      
        } catch (err) {
            console.log("error in check address")
            this.setState({ errorMessage: err.message, errorTrue: true });
            this.setState({loaderActive: true})
        }
        this.setState({loaderActive: false})
    }

    verifyOpenAddress = async() => {
      const adr = document.getElementById('addressToCheckOpen').value;
      this.setState({loaderActive: true})
      
      try {
        this.setState({verification_status: "Sending address..."})
        const accounts = await web3.eth.getAccounts();
        
        let res = await factory.methods
            .checkIfAddressOpenVerified(adr)
            .call({
                from: accounts[0]
        });
        console.log("good call", res)

        this.setState({open_verification_status: res})
        if (res == null) {
          console.log("no name")
        }
        // if (res) {
        //     this.setState({open_verification_status: "Address verified"})
        // } else {
        //   this.setState({open_verification_status: "Address not verified"})
        // }
    
      } catch (err) {
          console.log("error in check address")
          this.setState({ errorMessage: err.message, errorTrue: true });
          this.setState({loaderActive: true})
      }
      this.setState({loaderActive: false})
  }

    removeAddress = async() => {
      const adr = document.getElementById('addressToRemove').value;
      this.setState({loaderActive: true})

      try {
        this.setState({verification_status: "Sending address..."})
        const accounts = await web3.eth.getAccounts();
        
        await factory.methods
            .removeAccount(adr)
            .send({
                from: accounts[0]
        });
        console.log("good send")
    
      } catch (err) {
          console.log("error in remove address")
          this.setState({ errorMessage: err.message, errorTrue: true });
      }
      this.setState({loaderActive: false})
  }


  render() {
    return (
      <>
        <Layout>
            <div>
              <div style={{marginTop: 50, marginLeft: 200}}>
                <h2>Check If Address is verified</h2>
                <Input id="addressToCheck" placeholder="Enter address" style={{width:"45%"}}></Input>
                <Button primary onClick={this.verifyAddress} loading={this.state.loaderActive}>Check</Button>
                <br></br>
                {this.state.verification_status}

                <h2>Check If Address is open verified</h2>
                <Input id="addressToCheckOpen" placeholder="Enter address" style={{width:"45%"}}></Input>
                <Button primary onClick={this.verifyOpenAddress} loading={this.state.loaderActive}>Check</Button>
                <br></br>
                {this.state.open_verification_status}

                <h2>Remove address from verification list</h2>
                <h4>This will not be in end contract but is useful for now</h4>
                <Input id="addressToRemove" placeholder="Enter address" style={{width:"45%"}}></Input>
                <Button primary onClick={this.removeAddress} loading={this.state.loaderActive}>Check</Button>
                
                {
                this.state.errorTrue ?
                <Message negative>
                <Message.Header>Error</Message.Header>
                <p>{this.state.errorMessage}</p>
                </Message> : null
                }
            </div>
            </div>
        </Layout>
      </>
    );
  }
}

export default CheckAddress;
