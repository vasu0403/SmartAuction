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

    async placeBid(bidValue, secret){
        // await this.props.getBidHash(bidValue, secret).then(result => this.setState({
		// 	hash: result
		// }));
        // console.log("hash", this.state.hash);
		console.log("hell owold")
        this.props.placeBid(this.props.data.auctionID, "0xdd044e774ba476726a39ca417f8ccc829d3c1b0c9f9c85b027f9123d2d701d49", "public key 1");
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
				<div className='auctionTextFields'>
					<TextField 
						label="Bid Price" 
						variant={this.props.type === "reveal" ? "standard" : "outlined"}
						value={this.state.bid}
                        className="textField"
                        type={this.props.type === "reveal" ? "number" : ""}
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
				</div>
				<div className='listing-footer'>
					{/* <Button color="primary" onClick={() => this.enterPublicKey}><b>{this.state.ordering ? Cancel : Order}</b></Button> */}
					{/* {this.state.ordering ? */}
					{this.props.type === "bidding" ?
					<Button color="primary" onClick={() => this.submit(this.state.bid, this.state.publicKey)}><b>Place Bid</b></Button> :
					<Button color="primary" onClick={() => this.submit(this.state.bid, this.state.publicKey)}><b>Reveal Bid</b></Button> }
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Auction);