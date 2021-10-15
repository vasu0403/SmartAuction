/**
 * Renders a particular item for sale
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

class Listing extends Component{
	constructor(props){
		super(props);
		this.state = {
			ordering: false,
			publicKey: null,
		}
	}
	enterPublicKey(){
		this.setState({ordering: !this.state.ordering});
	}

	async submit(itemId, price){
		let publicKey = window.localStorage.getItem(this.props.userId+"_pub");
		if(!publicKey){
			const EthCrypto = require('eth-crypto');
			const identity = EthCrypto.createIdentity();
			window.localStorage.setItem(this.props.userId+"_pub", identity.publicKey);
			window.localStorage.setItem(this.props.userId+"_pri", identity.privateKey);
			publicKey = identity.publicKey;
		}
		this.props.buyListing(itemId, publicKey, price);
	}
	changePublicKey(newValue) {
		this.setState({
			publicKey: newValue,
		})
	}
	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<div><h2>{this.props.data.itemName}</h2></div>
					<div>{this.props.data.askingPrice} WEI</div>
				</div>
				<div><p><pre>Item Description:</pre></p>{this.props.data.itemDescription}</div>
				<div className='listing-footer'>
					<Button color="primary" onClick={() => this.submit(this.props.data.listingID, this.props.data.askingPrice)}><b>Buy</b></Button>
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Listing);