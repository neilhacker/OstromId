
import React, { Component } from 'react'
import { Button, Icon, Dimmer } from 'semantic-ui-react';
import CopyMessage
 from './CopyMessage';
class PreImageButton extends Component {
    state = { 
      active: true,
      copySuccess: false,
     }
  
    copyCodeToClipboard1 = () => {

        var copyText = document.getElementById("copybutton1").innerText;
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
      
    
    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })
    
    componentDidUpdate(){
      if (this.state.copySuccess) {
        this.hideTimeout = setTimeout(() => this.setState({copySuccess:false}), 2500);
      }
    }
  
    componentWillUnmount() {
      clearTimeout(this.hideTimeout)
    }
  
    render() {
        const { active } = this.state
        return (
          <div>
          <Dimmer.Dimmable blurring dimmed={active} 
          style={{width:"35%"}}>
          <Button 
            icon 
            labelPosition='right'
            id = "copybutton1"
            onClick={this.copyCodeToClipboard1}
          >
          {this.props.children}
          <Icon name='copy' />
        </Button>
  
            <Dimmer
              active={active}
              inverted
              onClickOutside={this.handleHide}
            >
            <Button onClick={this.handleHide}
            style={{color:"black", backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>Click to reveal Pre-image</Button>
            </Dimmer>
          </Dimmer.Dimmable>
          {
            this.state.copySuccess ?
            <CopyMessage></CopyMessage>
            : null
          }
          </div>
        )
        
      }
  }
  
  export default PreImageButton