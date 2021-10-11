import React, { Component } from "react";
import { Form, Input, Button, InputNumber} from 'antd';
export default class AddListing extends Component {
    state = {
        itemName: "",
        itemDescription: "",
        askingPrice: "",
    }
    setItemName(newItemName) {
        this.setState({
            itemName: newItemName,
        }, () => {
            console.log(this.state)
        })
    }
    setItemDescription(newItemDescription) {
        this.setState({
            itemDescription: newItemDescription,
        })
    }
    setAskingPrice(newAskingPrice) {
        this.setState({
            askingPrice: newAskingPrice,
        })
    }
    submit() {
        this.props.addListing(this.state);
        this.setState({
            itemName: "",
            itemDescription: "",
            askingPrice: "",
        })
    }
    render() {
        return (
            <div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Item Name"
                        name="itemName"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input 
                            value={this.state.itemName}
                            onChange={(newItemName) => this.setItemName(newItemName.target.value)}
                        />
                    </Form.Item>
            
                    <Form.Item
                        label="Item Description"
                        name="itemDescription"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input 
                            value={this.state.itemDescription}
                            onChange={(newItemDescription) => this.setItemDescription(newItemDescription.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                    label="Asking Price"
                    name="askingPrice"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <InputNumber
                            value={this.state.askingPrice}
                            onChange={(newAskingPrice) => {this.setAskingPrice(newAskingPrice)}}
                        />
                    </Form.Item>
            
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" onClick={() => this.submit()}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}