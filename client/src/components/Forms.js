import React, { Component } from "react";
import AddListing from './AddListing'
import AddAuction from './AddAuction'

export default class Forms extends Component {
    render() {
        return (
            <div style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                <div>
                    <AddListing addListing={this.props.addListing}/>
                </div>
                <div>
                    <AddAuction />
                </div>
            </div>
        )
    }
}