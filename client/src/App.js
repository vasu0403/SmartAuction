import React, { Component } from "react";
import SmartStore from "./contracts/SmartStore.json";
import getWeb3 from "./getWeb3";
import Forms from './components/Forms'
import Products from './components/Products'
import "./App.css";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';

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

		await contract.methods.addAuction(formValues.itemName, formValues.itemDescription, formValues.biddingTime, formValues.revealTime, formValues.method).send({from: accounts[0]});
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

	getAuctions = async() => {
		const {accounts, contract} = this.state;
		console.log("getting auctions");
		let numberOfAuctions = await contract.methods.getNumberOfAuctions().call();
		console.log(numberOfAuctions);
		var auctions = [];
		for(let i = 0; i < numberOfAuctions; i++){
			const data = await contract.methods.getParticularAuction(i).call();
			console.log(data);
			const auctionStatus = await contract.methods.getStatusOfAuction(data.auctionID, i).send({from: accounts[0]});
			console.log(auctionStatus);
			if(auctionStatus){
				auctions.push({
					itemName: data.itemName,
					itemDescription: data.itemDescription,
					sellerID: data.sellerID,
					auctionID: data.auctionID,
					method: data.method,
					biddingTime: data.biddingTime,
					startTime: data.startTime,
					revealTime: data.revealTime
				});
			}
		}
		console.log(auctions)
		return auctions;
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
		return (
			<Router>
				<div>
					<Switch>
						<Route exact path='/'>
							<Home getListings={this.getListings} buyListing={this.buyListing} getAuctions={this.getAuctions} getBidHash={this.getBidHash} placeBid={this.placeBid}/>
						</Route>
						<Route path='/profile'>
							<Profile getPendingDeliveries={this.getPendingDeliveries} deliverListing = {this.deliverListing} getOrders={this.getOrders}/>
						</Route>
						<Route path='/forms'>
							<Forms addListing={this.addListing} addAuction={this.addAuction}/>
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
