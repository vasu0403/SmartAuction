import React, { Component } from "react";
import SmartStore from "./contracts/SmartStore.json";
import getWeb3 from "./getWeb3";
import Forms from './components/Forms'
import Products from './components/Products'
import "./App.css";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Reveal from './components/Reveal';
import Keys from './components/Keys';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';


class App extends Component {
	state = { storageValue: 0, web3: null, accounts: null, contract: null };
	componentDidMount = async () => {
		try {
		// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = SmartStore.networks[networkId];
			const instance = new web3.eth.Contract(
				SmartStore.abi,
				deployedNetwork && deployedNetwork.address,
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance });
			this.getListings();
		} catch (error) {
		// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	addListing = async (formValues) => {
		const { accounts, contract } = this.state;
		console.log('in App.js', formValues);
		console.log(accounts)
		// // Stores a given value, 5 by default.
		await contract.methods.addListing(formValues.itemName, formValues.itemDescription, formValues.askingPrice).send({ from:  accounts[0] });

		// // Get the value from the contract to prove it worked.

		// // Update state with the result.
		// this.setState({ storageValue: response });
	};

	addAuction = async (formValues) => {
		const {accounts, contract} = this.state;

		await contract.methods.addAuction(formValues.itemName, formValues.itemDescription, formValues.method).send({from: accounts[0]});
	}

	buyListing = async (itemId, key, price) => {
		const {accounts, contract} = this.state;
		console.log(accounts);
		await contract.methods.buyListing(itemId, key).send({from: accounts[0], value: price});
	}

	deliverListing = async (itemId, text) => {
		const {accounts, contract} = this.state;
		await contract.methods.delieverItem(itemId, text).send({from: accounts[0]});
	}

	getListings = async() => {
		const {accounts, contract} = this.state;
		console.log("getting listings");
		let numberOfListings = await contract.methods.getNumberOfListings().call();
		var listings = [];
		for(let i = 0; i < numberOfListings; i++) {
			const data = await contract.methods.getParticularListing(i).call();
			const status = await contract.methods.getStatusOfListing(data.listingID).call();
			if(status) {
				listings.push({
				askingPrice: data.askingPrice,
				itemDescription: data.itemDescription,
				itemName: data.itemName,
				listingID: data.listingID,
				sellerID: data.sellerID,
				});
			}
		}
		return listings;
	}

	getAuctions = async(status) => {
		const {accounts, contract} = this.state;
		console.log("getting auctions");
		let numberOfAuctions = await contract.methods.getNumberOfAuctions().call();
		console.log(numberOfAuctions);
		var auctions = [];
		for(let i = 0; i < numberOfAuctions; i++){
			const data = await contract.methods.getParticularAuction(i).call();
			const auctionStatus = await contract.methods.getStatusOfAuction(data.auctionID).call();
			if(auctionStatus == status){
				auctions.push({
					itemName: data.itemName,
					itemDescription: data.itemDescription,
					sellerID: data.sellerID,
					auctionID: data.auctionID,
					method: data.method,
				});
			}
		}
		console.log("auctions", auctions)
		return auctions;
	}

	getOwnerAuctions = async() => {
		const {accounts, contract} = this.state;
		console.log("getting your auctions");
		let numberOfAuctions = await contract.methods.getNumberOfOwnerAuctions().call({from: accounts[0]});
		console.log(numberOfAuctions);
		var auctions = [];
		for(let i = 0; i < numberOfAuctions; i++){
			const data = await contract.methods.getOwnerAuction(i).call({from: accounts[0]});
			const auctionStatus = await contract.methods.getStatusOfAuction(data.auctionID).call();
			auctions.push({
				itemName: data.itemName,
				itemDescription: data.itemDescription,
				sellerID: data.sellerID,
				auctionID: data.auctionID,
				method: data.method,
				status: auctionStatus
			})
		}
		return auctions;
	}

	endBiddingTime = async(auctionId) => {
		const {accounts, contract} = this.state;
		await contract.methods.endBiddingTime(auctionId).send({from: accounts[0]});
	}

	endAuction = async(auctionId) => {
		const {accounts, contract} = this.state;
		await contract.methods.endAuction(auctionId).send({from: accounts[0]});
	}

	getBidHash = async(bidValue, secret) => {
		const {accounts, contract} = this.state;

		let hash = await contract.methods.getHash(bidValue, secret);
		return hash;
	}

	placeBid = async(auctionId, _blindedBid, publicKey) => {
		const {accounts, contract} = this.state;
		await contract.methods.placeBid(auctionId, _blindedBid, publicKey).send({from: accounts[0]});
	}

	revealBid = async(auctionId, bidValue, bidKey) => {
		const {accounts, contract} = this.state;
		await contract.methods.revealBid(auctionId, bidValue, bidKey).send({from: accounts[0], value: bidValue});
	}

	getPendingDeliveries = async() => {
		const {accounts, contract} = this.state;
		console.log("getting pending deliveries");
		let numberOfPendingDeliveries = await contract.methods.getNumberOfPendingTransactions().call({from: accounts[0]});
		var pendingDeliveries = [];
		console.log(numberOfPendingDeliveries)
		for(let i = 0;i < numberOfPendingDeliveries; i++){
			const data = await contract.methods.getParticularPendingListing(i).call({from: accounts[0]});
			pendingDeliveries.push({
				askingPrice: data.askingPrice,
				itemDescription: data.itemDescription,
				listingID: data.listingID,
				publicKey: data.publicKey,
				itemName: data.itemName,
			});
		}
		return pendingDeliveries;
	}

	getOrders = async() => {
		const {accounts, contract} = this.state;
		console.log("getting your orders");
		let numberOfOrders = await contract.methods.getNumberOfItems().call({from: accounts[0]});
		var yourOrders = [];
		console.log(numberOfOrders)
		for(let i = 0;i < numberOfOrders; i++){
			const data = await contract.methods.getParticularOrderItem(i).call({from: accounts[0]});
			yourOrders.push({
				itemText: data.itemText,
				itemDescription: data.itemDescription,
				listingID: data.listingID,
				itemName: data.itemName,
			});
		}
		console.log(yourOrders);
		return yourOrders;
	}

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		const classes = this.props
		return (
			<Router>
				<div>
					<Switch>
						<Route exact path='/'>
							<Home userId={this.state.accounts[0]} hasher={this.state.web3} getListings={this.getListings} buyListing={this.buyListing} getAuctions={this.getAuctions} getBidHash={this.getBidHash} placeBid={this.placeBid} revealBid={this.revealBid}/>
						</Route>
						<Route path='/reveal'>
							<Reveal userId={this.state.accounts[0]} hasher={this.state.web3} getAuctions={this.getAuctions} placeBid={this.placeBid} revealBid={this.revealBid}/>
						</Route>
						<Route path='/profile'>
							<Profile userId={this.state.accounts[0]} endBiddingTime={this.endBiddingTime} endAuction={this.endAuction} getAuctions={this.getOwnerAuctions} getPendingDeliveries={this.getPendingDeliveries} deliverListing = {this.deliverListing} getOrders={this.getOrders}/>
						</Route>
						<Route path='/forms'>
							<Forms addListing={this.addListing} addAuction={this.addAuction}/>
						</Route>
						<Route path='/keys'>
							<Keys />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
