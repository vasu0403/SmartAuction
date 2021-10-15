/**
 * renders the tab to reveal your bid an an auction
 */
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
import "../App.css";

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

class Reveal extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    /**
     * gets all the auctions in which you have participated
     * @returns auctions
     */
    async getAuctions(){
        var auctions = await this.props.getAuctions();
        return auctions;
    }

    componentDidMount(){
        this.getAuctions().then(result => this.setState({
            auctions: result
        }))
    }

    render(){
        const classes = this.props
        return(
            <div>
				<AppBar position="static">
					<Toolbar>
						<Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
							<Typography variant="h6" className={classes.title}>
								Smart Auction dApp
							</Typography>
                            <Link href="/" style={{"text-decoration": "none"}}>
                                <Button color="default" variant="contained">Home</Button>
                            </Link>
						</Box>
					</Toolbar>
				</AppBar>
				<Box display="flex" alignItems="center" justifyContent="center">
					<Auctions userId={this.props.userId} hasher={this.props.hasher} auctionStatus={2} type="reveal" getAuctions={this.props.getAuctions} getBidHash={this.props.getBidHash} placeBid={this.props.placeBid} revealBid={this.props.revealBid}/>
				</Box>
			</div>
        )
    }
}

export default withStyles(styles)(Reveal);