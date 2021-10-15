/**
 * Renders the form for adding a new auction
 */
import React, { Component } from "react";
// import { Form, Input, Button, InputNumber} from 'antd';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
export default class AddAuction extends Component {
    state = {
        itemName: "",
        itemDescription: "",
        biddingTime: "",
        revealTime: "",
        method: "FirstPrice",
    }
    /**
     * updates item name
     * @param newItemName 
     */
    setItemName(newItemName) {
        this.setState({
            itemName: newItemName,
        }, () => {
            console.log(this.state)
        })
    }
    
    /**
     * updates item description
     * @param newItemDescription 
     */
    setItemDescription(newItemDescription) {
        this.setState({
            itemDescription: newItemDescription,
        })
    }
    
    /**
     * updates the auction method
     * @param newMethod 
     */
    setMethod(newMethod) {
        this.setState({
            method: newMethod,
        })
    }
    /**
     * Called after clicking the submit button. Adds a new auction
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
        this.props.addAuction(this.state);
        this.setState({
            itemName: "",
            itemDescription: "",
            biddingTime: "",
            revealTime: "",
            method: ""
        })
    }
    render() {
        const onFinish = (values: any) => {
            console.log('Success:', values);
        };
        
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
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
                <FormControl sx={{ m: 1, minWidth: 120}} style={{marginTop: '9%'}}>
                    <InputLabel id="demo-simple-select-helper-label">Method</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={this.state.method}
                        label="Method"
                        onChange={(newValue) => {this.setMethod(newValue.target.value)}}
                    >
                        <MenuItem value="FirstPrice">First Price</MenuItem>
                        <MenuItem value="SecondPrice">Second Price</MenuItem>
                        <MenuItem value="AveragePrice">Average Price</MenuItem>
                    </Select>
                </FormControl>
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