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
		}
	}
	render(){
		const classes = this.props
		return(
			<Card className="listing">
				<div className='listing-header'>
					<div><h2>{this.props.name}</h2></div>
				</div>
				<div style={{border: "solid 1px black"}}>{this.props.desc}</div>
                <div>{this.props.text}</div>
			</Card>
		)
	}
}

export default withStyles(styles)(BoughtItem);