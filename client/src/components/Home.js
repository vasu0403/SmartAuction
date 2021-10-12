import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Listings from './Listings';
import Auctions from './Auctions';
import Box from '@material-ui/core/Box';

const styles = theme => ({
	root: {
	  flexGrow: 1,
	},
	menuButton: {
	  marginRight: theme.spacing(2),
	},
	title: {
	  flexGrow: 1,
	},
});

class Home extends Component{
	constructor(props){
		super(props)
		this.state = {
			tabValue: "0"
		}
		this.changeTab = this.changeTab.bind(this)
	}

	changeTab = (_, value) => {
		this.setState({tabValue: value});
	}
	render(){
		const classes = this.props
		return(
			<div>
				<AppBar position="static">
					<Toolbar>
						<Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
							<Typography variant="h6" className={classes.title}>
								App Name
							</Typography>
							<Link href="/profile" style={{"text-decoration": "none"}}>
								<Button color="default" variant="contained">Your Profile</Button>
							</Link>
						</Box>
					</Toolbar>
				</AppBar>
				<Tabs
				value={this.tabValue}
				indicatorColor="primary"
				textColor="secondary"
				onChange={this.changeTab}
				aria-label="tabs example"
				centered
				variant="fullWidth"
				>
				<Tab value="0" label="Products" />
				<Tab value="1" label="Auctions" />
				</Tabs>
				<Box display="flex" alignItems="center" justifyContent="center">
					{this.state.tabValue === "0" ?
					<Listings getListings={this.props.getListings} buyListing={this.props.buyListing}/> :
					<Auctions />}
				</Box>
			</div>
		)
	}
}

export default withStyles(styles)(Home);