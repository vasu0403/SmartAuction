/**
 * renders an item that you are selling for which a buyer has been finalised (either throug normal market or through auction)
 * but the product is yet to be deliverd
 */
import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "../App.css"
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

class PendingDelivery extends Component{
	constructor(props){
		super(props);
		this.state = {
			ordering: false,
			publicKey: "",
			itemText: "",
		}
	}
	enterPublicKey(){
		this.setState({ordering: !this.state.ordering});
	}
	/**
	 * updated the text representing the product
	 */
	changeItemText(newValue) {
		this.setState({
			itemText: newValue,
		})
	}
	/**
	 * encrypts the text that represents the product
	 * @param text plain text representing the product
	 */
	async encrypt(text) {
        const key = this.props.publicKey;
		console.log(key)
        const EthCrypto = require('eth-crypto')
        let encrypted = await EthCrypto.encryptWithPublicKey(key, text);
        let encryptedText = JSON.stringify(encrypted)
		console.log("encrypted text", encrypted.ciphertext, encryptedText);
		return encryptedText;
    }
	/**
	 * deliver item
	 * @param listingId id of product that is to be delivered
	 * @param itemText plain text representing the product
	 */
	async submit(listingId, itemText){
		if(itemText === null){
			alert("Provide the secret item string first");
			return;
		}
		let secretString = await this.encrypt(itemText);
		this.props.deliverListing(listingId, secretString);
	}
	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<div><h2>{this.props.name}</h2></div>
					<div>{this.props.price} WEI</div>
				</div>
				<div style={{border: "solid 1px black"}}>{this.props.desc}</div>
				{/* <div style={{border: "solid 1px black", marginTop: '2%'}}>{this.props.publicKey}</div> */}
				<TextField 
						id="outlined-basic" 
						label="Enter item string here" 
						variant="outlined" 
						value={this.state.itemText}
						onChange={(newValue) => {this.changeItemText(newValue.target.value)}}
				/>
				<div className='listing-footer'>
					{/* <Button color="primary" onClick={() => this.enterPublicKey}><b>{this.state.ordering ? Cancel : Order}</b></Button> */}
					{/* {this.state.ordering ? */}
					<Button color="primary" onClick={() => this.submit(this.props.listingId, this.state.itemText)}><b>Deliver</b></Button>
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(PendingDelivery);