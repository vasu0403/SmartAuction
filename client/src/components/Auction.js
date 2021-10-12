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

class Auction extends Component{
	constructor(props){
		super(props);
		this.state = {
			ordering: false,
			publicKey: "",
            bid: "",
			bidKey: "",
			hash: ""
		}
	}

    changeBid(newValue){
        this.setState({
            bid: newValue
        })
    }
	enterPublicKey(){
		this.setState({ordering: !this.state.ordering});
	}
	submit(itemId, publicKey, price){
		console.log(itemId, publicKey, price);
		this.props.buyListing(itemId, publicKey, price);
	}
	changePublicKey(newValue) {
		this.setState({
			publicKey: newValue,
		})
	}
	
	changeBidKey(newValue) {
		this.setState({
			bidKey: newValue,
		})
	}

    async placeBid(bidValue, publicKey, bidKey){
		const hash = this.props.hasher.utils.soliditySha3(
			{t: 'uint256', v: bidValue},
			{t: 'bytes32', v: bidKey}
		)
		alert("Your hashed bid is: " + hash)
		console.log("hell owold")
        this.props.placeBid(this.props.data.auctionID, hash, publicKey);
    }

	async revealBid(bidValue, secret){
		this.props.revealBid(this.props.data.auctionID, bidValue, secret);
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
				<div style={{border: "solid 1px black"}}>{this.props.data.itemDescription}</div>
				{this.props.type != "owner" ?
					<div className='auctionTextFields'>
						<TextField 
							label="Bid Price" 
							variant="standard"
							className="textField"
							type="number"
							onChange={(newValue) => {this.changeBid(newValue.target.value)}}
							/>
						<TextField 
							label="Public Key" 
							variant="outlined" 
							value={this.state.publicKey}
							className="textField"
							style={{width: "50%"}}
							onChange={(newValue) => {this.changePublicKey(newValue.target.value)}}
						/>
						<TextField 
							label="Key to Hash Bid" 
							variant="outlined" 
							value={this.state.bidKey}
							className="textField"
							style={{width: "50%"}}
							onChange={(newValue) => {this.changeBidKey(newValue.target.value)}}
						/>
					</div> :
					<div></div>
				}
				<div className='listing-footer'>
					{/* <Button color="primary" onClick={() => this.enterPublicKey}><b>{this.state.ordering ? Cancel : Order}</b></Button> */}
					{/* {this.state.ordering ? */}
					{this.props.type === "bidding" ?
					<Button color="primary" onClick={() => this.placeBid(this.state.bid, this.state.publicKey, this.state.bidKey)}><b>Place Bid</b></Button> :
					<Button color="primary" onClick={() => this.revealBid(this.state.bid, this.state.publicKey)}><b>Reveal Bid</b></Button> }
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Auction);