import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "../App.css"

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
			ordering: false
		}
	}
	enterPublicKey(){
		this.setState({ordering: !this.state.ordering});
	}
	submit(itemId, publicKey, price){
		console.log(itemId, publicKey, price);
		this.props.buyListing(itemId, publicKey, price);
	}
	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<span><h2>{this.props.name}</h2></span>
					<span>{this.props.price} WEI</span>
				</div>
				<div style={{border: "solid 1px black"}}>{this.props.desc}</div>
				<div className='listing-footer'>
					{/* <Button color="primary" onClick={() => this.enterPublicKey}><b>{this.state.ordering ? Cancel : Order}</b></Button> */}
					{/* {this.state.ordering ? */}
					<Button color="primary" onClick={() => this.submit(this.props.listingId, "secret", this.props.price)}><b>Buy</b></Button>
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(Listing);