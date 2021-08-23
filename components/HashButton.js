
import React, { Component } from 'react'
import { Button, Icon, Dimmer } from 'semantic-ui-react';
import CopyMessage from "./CopyMessage";

class HashButton extends Component {
    state = { 
        copySuccess: false,
     }
  
    copyCodeToClipboard1 = () => {

        var copyText = document.getElementById("copybutton2").innerText;
        var textarea = document.createElement('textarea');
        textarea.id = 'temp_element';
        textarea.style.height = 0;
        document.body.appendChild(textarea);
        textarea.value = copyText;
        var selector = document.querySelector('#temp_element')
        selector.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.setState({copySuccess: true})
      }
      
      componentDidUpdate(){
        if (this.state.copySuccess) {
          this.hideTimeout = setTimeout(() => this.setState({copySuccess:false}), 2500);
        }
      }
    
      componentWillUnmount() {
        clearTimeout(this.hideTimeout)
      }
      
    render() {
        return (
            <div>

            <Button 
            icon 
            labelPosition='right'
            id = "copybutton2"
            onClick={this.copyCodeToClipboard1}
            >
            {this.props.children}
            <Icon name='copy' />
            </Button>
            {
              this.state.copySuccess ?
              <CopyMessage></CopyMessage>
              : null
            }
            
            </div>
        )
      }
  
      
  }
  
  export default HashButton