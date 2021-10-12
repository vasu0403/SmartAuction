import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	root: {
		padding: "5px"
	},
	title: {
	  fontSize: 14,
	},
	pos: {
	  marginBottom: 12,
	},
});

class Keys extends Component{
    state = {publicKey: '', text1: '', secretKey: '', text2: ''}
    async generateKeys() {
        const EthCrypto = require('eth-crypto');
        const identity = EthCrypto.createIdentity();
        alert(identity.publicKey, identity.privateKey);
        console.log(identity.publicKey)
        console.log(identity.privateKey)
    }
    changePublicKey(newValue) {
		this.setState({
			publicKey: newValue,
		})
	}
    changeText1(newValue) {
		this.setState({
			text1: newValue,
		})
	}
    changeSecretKey(newValue) {
		this.setState({
			secretKey: newValue,
		})
	}
    changeText2(newValue) {
		this.setState({
			text2: newValue,
		})
	}
    async encrypt() {
        const key = this.state.publicKey;
        const text = this.state.text1;
        const EthCrypto = require('eth-crypto')
        let encrypted = await EthCrypto.encryptWithPublicKey(key, text);
        let encryptedText = JSON.stringify(encrypted)
        console.log(encryptedText);
    }
    async decrypt() {
        const key = this.state.secretKey;
        let text = this.state.text2;
        let tt = '0x' + key;
        const EthCrypto = require('eth-crypto')
        let decrypted = await EthCrypto.decryptWithPrivateKey(tt, JSON.parse(text));
        alert(decrypted)
    }
	render(){
		const classes = this.props
		return(
            <div>
                <Button color="primary" onClick={() => this.generateKeys()}><b>Generate Keys</b></Button>
                <br/><br/>
                <TextField 
                    label="public key" 
                    variant="outlined" 
                    value={this.state.publicKey}
                    className="textField"
                    style={{width: "50%"}}
                    onChange={(newValue) => {this.changePublicKey(newValue.target.value)}}
                />
                <TextField 
                    label="text" 
                    variant="outlined" 
                    value={this.state.text1}
                    className="textField"
                    style={{width: "50%"}}
                    onChange={(newValue) => {this.changeText1(newValue.target.value)}}
                />
                <Button color="primary" onClick={() => this.encrypt()}><b>ENCRYPT</b></Button>
                <br/><br/>
                <br/><br/>
                <TextField 
                    label="secret key" 
                    variant="outlined" 
                    value={this.state.secretKey}
                    className="textField"
                    style={{width: "50%"}}
                    onChange={(newValue) => {this.changeSecretKey(newValue.target.value)}}
                />
                <TextField 
                    label="encrypted message" 
                    variant="outlined" 
                    value={this.state.text2}
                    className="textField"
                    style={{width: "50%"}}
                    onChange={(newValue) => {this.changeText2(newValue.target.value)}}
                />
                <Button color="primary" onClick={() => this.decrypt()}><b>DECRYPT</b></Button>

            </div>
		)
	}
}

export default withStyles(styles)(Keys);