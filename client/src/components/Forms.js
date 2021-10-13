import React, { Component } from "react";
import AddListing from './AddListing';
import AddAuction from './AddAuction';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';


export default class Forms extends Component {
    render() {
        const classes = this.props;
        return (
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
                <div style = {{display: 'flex', justifyContent: 'space-evenly'}}>

                    <div>
                        <h2>Listing Form</h2>
                        <AddListing addListing={this.props.addListing}/>
                    </div>
                    <div>
                        <h2>Auction Form</h2>
                        <AddAuction addAuction={this.props.addAuction}/>
                    </div>
                </div>
            </div>
        )
    }
}