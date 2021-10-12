import React, {Component} from 'react';
import BoughtItem from './BoughtItem';
import Box from '@material-ui/core/Box';

class BoughtItems extends Component{
    constructor(props){
        super(props)
        this.state = {
            items: []
        }
    }
    
    async getOrders(){
        var items = await this.props.getOrders();
        return items;
    }

    componentDidMount(){
        this.getOrders().then(result => this.setState({
            items: result
        }))
    }


    render(){
        console.log("hello", this.state.items)
        let itemGrid = this.state.items.map(item => <BoughtItem desc={item.itemDescription} name={item.itemName} listingId={item.listingID} text={item.itemText}/>);
        return(
            <Box margin="10px" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around" alignItems="center" width="90%">
                {itemGrid}
            </Box>
        )
    }
}

export default BoughtItems;