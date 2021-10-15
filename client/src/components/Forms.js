/**
 * renders forms to add a new product to market and also for starting a new auction
 */
import React, { Component } from "react";
import AddListing from './AddListing';
import AddAuction from './AddAuction';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import auction from '../images/auction.png';
import market from '../images/market3.png';

export default class Forms extends Component {
    render() {
        const classes = this.props;
        return (
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
                <div style = {{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                    <div >
                        <div style = {{display: 'flex', justifyContent: 'space-around', alignContent: 'space-around'}}>
                            <img src={market} style={{width: '50%'}}/>
                        </div>
                        <div style = {{display: 'flex', justifyContent: 'space-around', alignContent: 'space-around'}}>
                            <AddListing addListing={this.props.addListing}/>
                        </div>
                    </div>
                    <div >
                        <div style = {{display: 'flex', justifyContent: 'space-around', alignContent: 'space-around'}}>
                            <img src={auction} style={{width: '50%'}}/>
                        </div>
                        <div style = {{display: 'flex', justifyContent: 'space-around', alignContent: 'space-around'}}>
                            <AddAuction addAuction={this.props.addAuction}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}