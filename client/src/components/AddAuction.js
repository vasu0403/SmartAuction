import React, { Component } from "react";
import { Form, Input, Button, InputNumber} from 'antd';
export default class AddAuction extends Component {
    state = {
        itemName: "",
        itemDescription: "",
        biddingTime: "",
        revealTime: "",
        method: "",
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
    setBiddingTime(newBiddingTime) {
        this.setState({
            biddingTime: newBiddingTime,
        })
    }
    setRevealTime(newRevealTime) {
        this.setState({
            revealTime: newRevealTime,
        })
    }
    setMethod(newMethod) {
        this.setState({
            method: newMethod,
        })
    }
    submit() {
        console.log(this.state);
    }
    render() {
        const onFinish = (values: any) => {
            console.log('Success:', values);
        };
        
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
        };
        return (
            <div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Item Name"
                        name="itemName"
                    >
                        <Input 
                            value={this.state.itemName}
                            onChange={(newItemName) => this.setItemName(newItemName.target.value)}
                        />
                    </Form.Item>
            
                    <Form.Item
                        label="Item Description"
                        name="itemDescription"
                    >
                        <Input 
                            value={this.state.itemDescription}
                            onChange={(newItemDescription) => this.setItemDescription(newItemDescription.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Bidding Time"
                        name="biddingTime"
                    >
                        <InputNumber
                            value={this.state.biddingTime}
                            onChange={(newBiddingTime) => this.setBiddingTime(newBiddingTime)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reveal Time"
                        name="revealTime"
                    >
                        <InputNumber
                            value={this.state.revealTime}
                            onChange={(newRevealTime) => this.setRevealTime(newRevealTime)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Method"
                        name="method"
                    >
                        <Input 
                            value={this.state.method}
                            onChange={(newMethod) => this.setMethod(newMethod.target.value)}
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