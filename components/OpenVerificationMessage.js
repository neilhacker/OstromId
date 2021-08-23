import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

class OpenVerificationMessage extends Component {
  state = { 
    visible: true,
   }

  handleDismiss = () => {
    this.setState({ visible: false })
  }
  content = () => {
    return(
      <p>
        Going through the open verification flow will link your <b style={{color:"#D70F6C"}}>real name</b> with the account you have active
        in Metamask and this information will live on chain for <b style={{color:"#D70F6C"}}>all to see</b>. You can remove this information in the 
        future from the same account but others will be able to view it until that point. 
        To allow this to happen the <b style={{color:"#D70F6C"}}>address you have active</b> on Metamask will be <b style={{color:"#D70F6C"}}>sent to stripe </b> 
        so that if your id check comes back verified the server will be able to automatically add your details to the smart contract. 
        (This address info <b style={{color:"#D70F6C"}}>is not sent </b> at all in the <b style={{color:"#D70F6C"}}>Anonymous process </b>)
      </p>
    )
  }

  render() {
    if (this.state.visible) {
      return (
        <Message
          onDismiss={this.handleDismiss}
          header='Warning personal infomation stored on chain'
          content={this.content}
          style={{marginBottom:"25px"}}
        />
      )
    }

    return null;
  }
}

export default OpenVerificationMessage
