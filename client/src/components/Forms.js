import React, { Component } from "react";
import AddListing from './AddListing'
import AddAuction from './AddAuction'

export default class Forms extends Component {
    render() {
        return (
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
        )
    }
}