/**
 * Renders an item which you have purchased and has been delivered
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

class BoughtItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			itemText: null
		}
	}
	/**
	 * Decrypts the encrypted text which the seller must have given while delivering the product
	 * @param secretString the encrypted text
	 */
	async decrypt(secretString){
		const EthCrypto = require('eth-crypto');
		let privateKey = await window.localStorage.getItem(this.props.userId+"_pri");
		console.log(privateKey);
		let decrypted = await EthCrypto.decryptWithPrivateKey(privateKey, JSON.parse(secretString));
		console.log(decrypted, secretString);
		this.setState({
			itemText: decrypted
		})
	}

	componentDidMount(){
		this.decrypt(this.props.secret)
	}

	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<div><h2>{this.props.name}</h2></div>
				</div>
				<div><p><pre>Item Description:</pre></p>{this.props.desc}</div>
				<div><p><pre>Item String:</pre></p>{this.state.itemText}</div>
			</Card>
		)
	}
}

export default withStyles(styles)(BoughtItem);