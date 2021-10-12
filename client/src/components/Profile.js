import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Listings from './Listings';
import Auctions from './Auctions';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import PendingDeliveries from './PendingDeliveries';
import BoughtItems from './BoughtItems';

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

class Profile extends Component{
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
							<Link href="/" style={{"text-decoration": "none"}}>
								<Button color="default" variant="contained">Home</Button>
							</Link>
						</Box>
					</Toolbar>
				</AppBar>
				<Tabs
					value={this.state.tabValue}
					indicatorColor="primary"
					textColor="primary"
					onChange={this.changeTab}
					aria-label="tabs example"
					centered
					variant="fullWidth"
				>
				<Tab value="0" label="Your Orders" />
				<Tab value="1" label="Pending Deliveries" />
				</Tabs>
				{
					this.state.tabValue === "0" ?
						<BoughtItems getOrders={this.props.getOrders}/> :
						<PendingDeliveries getPendingDeliveries = {this.props.getPendingDeliveries} deliverListing = {this.props.deliverListing}/>
				}

			</div>
		)
	}
}

export default withStyles(styles)(Profile);