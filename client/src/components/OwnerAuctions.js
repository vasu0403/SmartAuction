import React, {Component} from 'react';
import OwnerAuction from './OwnerAuction';
import Box from '@material-ui/core/Box';

class OwnerAuctions extends Component{
    constructor(props){
        super(props)
        this.state = {
            auctions: []
        }
    }

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
        console.log("auctions", this.state.auctions);
        let auctionGrid = this.state.auctions.map(auction => <OwnerAuction type="owner" data={auction} endAuction={this.props.endAuction} endBiddingTime={this.props.endBiddingTime}/>)
        return(
            <Box margin="10px" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" alignItems="center" width="90%">
                {auctionGrid}
            </Box>
        )
    }
}

export default OwnerAuctions;