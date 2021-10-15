/**
 * Renders all the auctions
 */
import React, {Component} from 'react';
import Auction from './Auction';
import Box from '@material-ui/core/Box';

class Auctions extends Component{
    constructor(props){
        super(props)
        this.state = {
            auctions: []
        }
    }

    /**
     *  used for getting all the auctions
     * @returns all the auctions
     */
    async getAuctions(){
        var auctions = await this.props.getAuctions(this.props.auctionStatus);
        return auctions;
    }

    componentDidMount(){
        this.getAuctions().then(result => this.setState({
            auctions: result
        }))
    }

    render(){
        console.log("auctions", this.state.auctions);
        let auctionGrid = this.state.auctions.map(auction => <Auction hasher={this.props.hasher} type={this.props.type === "reveal" ? "reveal" : "bidding"} data={auction} getBidHash={this.props.getBidHash} placeBid={this.props.placeBid} revealBid={this.props.revealBid}/>)
        return(
            <Box margin="10px" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" alignItems="center" width="90%">
                {auctionGrid}
            </Box>
        )
    }
}

export default Auctions;