import React, {Component} from 'react';
import Listing from './Listing';
import Box from '@material-ui/core/Box';
import PendingDelivery from './PendingDelivery';

class PendingDeliveries extends Component{
    constructor(props){
        super(props)
        this.state = {
            pendingDeliveries: []
        }
        this.deliverAndUpdateListing = this.deliverAndUpdateListing.bind(this);
    }
    
    async getPendingDeliveries(){
        console.log('here also')
        const pendingDeliveries = await this.props.getPendingDeliveries();
        return pendingDeliveries;
    }
	componentDidMount(){
        console.log('coming here')
        this.getPendingDeliveries().then(result => this.setState({
            pendingDeliveries: result
        }, () => console.log(this.state, 'these are your pending deliveries')));
    }
    deliverAndUpdateListing(itemID, itemText) {
        this.props.deliverListing(itemID, itemText);
        this.getPendingDeliveries().then(result => this.setState({
            pendingDeliveries: result
        }, () => console.log(this.state, 'these are your pending deliveries')));
    }


    render(){
        let pendingDeliveriesGrid = this.state.pendingDeliveries.map(pendingDelivery => <PendingDelivery 
            price={pendingDelivery.askingPrice} 
            desc={pendingDelivery.itemDescription} 
            name={pendingDelivery.itemName} 
            listingId={pendingDelivery.listingID} 
            publicKey={pendingDelivery.publicKey}
            deliverListing={this.deliverAndUpdateListing}
        />);
        return(
            <Box margin="10px" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" alignItems="center" width="90%">
                {pendingDeliveriesGrid}
            </Box>
        )
    }
}

export default PendingDeliveries;