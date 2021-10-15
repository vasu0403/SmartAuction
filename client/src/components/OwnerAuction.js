/**
 * Renders an auction that you own.
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

class OwnerAuction extends Component{
	constructor(props){
		super(props);
		this.state = {
            status: 0
		}
	}

    componentDidMount(){
        this.setState({
            status: this.props.data.status
        })
    }
	/**
	 * Ends the bidding for the auction
	 */
    endBiddingTime(){
        console.log("bidding end");
        this.props.endBiddingTime(this.props.data.auctionID);
    }
    
	/**
	 * Ends the auction
	 */
    endAuction(){
        console.log("auction ended");
        this.props.endAuction(this.props.data.auctionID);
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
				<div className='listing-footer'>
                    <Button color="primary" onClick={() => this.endBiddingTime()} disabled={this.props.data.status != 1}>End Bidding Time</Button>
                    <Button color="primary" onClick={() => this.endAuction()} disabled={this.props.data.status != 2}>End Auction</Button>
				</div>
			</Card>
		)
	}
}

export default withStyles(styles)(OwnerAuction);