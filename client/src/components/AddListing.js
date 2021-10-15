/**
 * Renders the form to add a new product to the market
 */
import React, { Component } from "react";
// import { Form, Input, Button, InputNumber} from 'antd';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class AddListing extends Component {
    state = {
        itemName: "",
        itemDescription: "",
        askingPrice: 0,
    }
    /**
     * changes the item name with the value provided in the input
     * @param newItemName the new item name
     */
    setItemName(newItemName) {
        this.setState({
            itemName: newItemName,
        }, () => {
            console.log(this.state)
        })
    }
    /**
     * changes the item descriptiong with the value provided in the input
     * @param newItemDescription the new item description
     */
    setItemDescription(newItemDescription) {
        this.setState({
            itemDescription: newItemDescription,
        })
    }
    /**
     * changes the item price with the value provided in the input
     * @param newAskingprice the new item price
     */
    setAskingPrice(newAskingPrice) {
        this.setState({
            askingPrice: newAskingPrice,
        })
    }
    /**
     * add a new product to the market (values must be filled in the form)
     */
    submit() {
        if(this.state.itemName == "") {
            alert("item name cannot be empty");
            return;
        }
        if(this.state.itemDescription == "") {
            alert("item Description cannot be empty");
            return;
        }
        if(this.state.askingPrice < 0) {
            alert("item price cannot be negative");
            return;
        }
        this.props.addListing(this.state);
        this.setState({
            itemName: "",
            itemDescription: "",
            askingPrice: "",
        })
    }
    render() {
        return (
            <div style = {{display: 'flex', flexDirection: 'column'}}>
                <TextField 
                    id="outlined-basic" 
                    label="Item Name" 
                    variant="outlined" 
                    value={this.state.itemName}
                    onChange={(newValue) => {this.setItemName(newValue.target.value)}}
				/>
                <TextField 
                    id="outlined-basic" 
                    label="Item Description" 
                    style={{marginTop: '5%'}}
                    variant="outlined" 
                    value={this.state.itemDescription}
                    onChange={(newValue) => {this.setItemDescription(newValue.target.value)}}
				/>
                <TextField 
                    id="outlined-basic" 
                    label="Price" 
                    style={{marginTop: '5%'}}
                    variant="outlined" 
                    type="number"
                    value={this.state.askingPrice}
                    onChange={(newValue) => {this.setAskingPrice(newValue.target.value)}}
				/>
                <Button 
                    color="primary" 
                    onClick={() => this.submit()}
                    style={{marginTop: '5%'}}
                >
                    <b>SUBMIT</b>
                </Button>

            </div>
        )
    }
}