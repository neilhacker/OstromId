
import React, { Component } from 'react'
import OpenVerificationMessage from './OpenVerificationMessage'

class HashButton extends Component {
  state = {
    toggleOptionAnonymous: true,
    toggleContainerOption: "toggleButtonContainerAnonymous",
    toggleAnonymousButton: "toggleButtonOptionActive",
    toggleOpenButton: "toggleButtonOptionOpenNotActive",
   }
  
   changeToggleOption = () => {
     // was anonymous now open
     if(this.state.toggleOptionAnonymous) {
       this.setState({
         toggleContainerOption: "toggleButtonContainerOpen",
         toggleAnonymousButton: "toggleButtonOptionAnonymousNotActive",
         toggleOpenButton: "toggleButtonOptionActive",
         toggleOptionAnonymous: false,
       })
     } else {
       this.setState({
         toggleContainerOption: "toggleButtonContainerAnonymous",
         toggleAnonymousButton: "toggleButtonOptionActive",
         toggleOpenButton: "toggleButtonOptionOpenNotActive",
         toggleOptionAnonymous: true,
       })
     }
   }
  

      
    render() {
        return (
          <div>
          <h5 className={this.state.toggleContainerOption}>
          <button className={this.state.toggleAnonymousButton} onClick={this.changeToggleOption}>Anonymous</button>
          <button className={this.state.toggleOpenButton} onClick={this.changeToggleOption}>Open</button>
          </h5>
          {/* {
            this.state.toggleOptionAnonymous ?
            null :
            <OpenVerificationMessage></OpenVerificationMessage>
          } */}
          </div>
        )
      }
  
      
  }
  
  export default HashButton

