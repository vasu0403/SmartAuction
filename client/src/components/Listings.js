import React, {Component} from 'react';
import Listing from './Listing';
import Box from '@material-ui/core/Box';

class Listings extends Component{
    constructor(props){
        super(props)
        this.state = {
            listings: []
        }
    }
    
    async getListings(){
        var listings = await this.props.getListings();
        return listings;
    }

    componentDidMount(){
        this.getListings().then(result => this.setState({
            listings: result
        }))
    }


    render(){
        console.log("hello", this.state.listings)
        let listingGrid = this.state.listings.map(listing => <Listing data={listing} buyListing={this.props.buyListing}/>);
        return(
            <Box margin="10px" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" alignItems="center" width="90%">
                {listingGrid}
            </Box>
        )
    }
}

export default Listings;