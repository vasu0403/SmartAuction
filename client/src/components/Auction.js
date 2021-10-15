/**
 * Renders an available auction
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
import { colors } from '@material-ui/core';

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

function random32bit() {
    let u = new Uint32Array(1);
    window.crypto.getRandomValues(u);
    let str = u[0].toString(16).toUpperCase();
    return '00000000'.slice(str.length) + str;
}

class Auction extends Component{
	constructor(props){
		super(props);
		this.state = {
			ordering: false,
            bid: 0,
			bidKey: null
		}
	}

	/**
	 * updates the value of bid
	 * @param newValue updated bid value
	 */
    changeBid(newValue){
        this.setState({
            bid: newValue
        })
    }

	changeBidKey(newValue){
		this.setState({
			bidKey: newValue
		})
	}

    async placeBid(bidValue, bidKey){
		if(bidValue === null || bidKey === null){
			alert("Fill the values completely!!!")
			return;
		}
		if(bidValue < 0) {
			alert("Bid value must be positive!!!");
			return;
		}
		let publicKey = window.localStorage.getItem(this.props.userId+"_pub");
		if(!publicKey){
			const EthCrypto = require('eth-crypto');
			const identity = EthCrypto.createIdentity();
			window.localStorage.setItem(this.props.userId+"_pub", identity.publicKey);
			window.localStorage.setItem(this.props.userId+"_pri", identity.privateKey);
			publicKey = identity.publicKey;
		}
		bidKey = this.props.hasher.utils.asciiToHex(bidKey);
		console.log(bidValue, publicKey, bidKey)
		const hash = this.props.hasher.utils.soliditySha3(
			{t: 'uint256', v: bidValue},
			{t: 'bytes32', v: bidKey}
		)
		console.log(hash)
		window.localStorage.setItem(this.props.userId+"_bidKey", bidKey);
		this.props.placeBid(this.props.data.auctionID, hash, publicKey);

		this.setState({
			bid: null
		})
    }

	async revealBid(bidValue){
		if(bidValue === null){
			alert("Fill the values completely!!!");
			return;
		}
		if(bidValue < 0) {
			alert("Bid value must be positive!!!");
			return;
		}
		let bidKey = await window.localStorage.getItem(this.props.userId+"_bidKey");
		console.log(bidKey)
		this.props.revealBid(this.props.data.auctionID, bidValue, bidKey);
	}

	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<div><h2>{this.props.data.itemName}</h2></div>
                    <Typography>{this.props.data.method}</Typography>
					{/* <div>{this.props.data.askingPrice} WEI</div> */}
				</div>
				<div>
					<p><pre>Item Description:</pre></p>{this.props.data.itemDescription}
				</div>
				{this.props.type != "owner" ?
					<div className='auctionTextFields textFields'>
						<div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
						<TextField 
							label="Bid Price" 
							variant="standard"
							className="textField"
							type="number"
							onChange={(newValue) => {this.changeBid(newValue.target.value)}}
							/>
						{this.props.type === "bidding" ?
						<TextField 
							label="Bid Hasher" 
							variant="outlined" 
							value={this.state.bidKey}
							className="textField"
							onChange={(newValue) => {this.changeBidKey(newValue.target.value)}}
						/> : <div></div>}
						</div>
					</div> :
					<div></div>
				}
				<div className='listing-footer'>
					{/* <Button color="primary" onClick={() => this.enterPublicKey}><b>{this.state.ordering ? Cancel : Order}</b></Button> */}
					{/* {this.state.ordering ? */}
					{this.props.type === "bidding" ?
					<Button color="primary" onClick={() => this.placeBid(this.state.bid, this.state.bidKey)}><b>Place Bid</b></Button> :
					<Button color="primary" onClick={() => this.revealBid(this.state.bid)}><b>Reveal Bid</b></Button> }
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Auction);