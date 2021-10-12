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
			publicKey: "",
			itemText: "",
		}
	}
	enterPublicKey(){
		this.setState({ordering: !this.state.ordering});
	}
	submit(itemId, publicKey, price){
		console.log(itemId, publicKey, price);
		this.props.buyListing(itemId, publicKey, price);
	}
	changeItemText(newValue) {
		this.setState({
			itemText: newValue,
		})
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
				<div style={{border: "solid 1px black", marginTop: '2%'}}>{this.props.publicKey}</div>
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
					<Button color="primary" onClick={() => this.props.deliverListing(this.props.listingId, this.state.itemText)}><b>Deliver</b></Button>
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Listing);