import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SmartStore from "./contracts/SmartStore.json";
import getWeb3 from "./getWeb3";
import Forms from './components/Forms'
import Products from './components/Products'
import "./App.css";

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

  getListings = async() => {
    const {accounts, contract} = this.state;
    console.log("getting listings");
    let numberOfListings = await contract.methods.getNumberOfListings().call();
    const listings = [];
    for(let i = 0; i < numberOfListings; i++) {
      const data = await contract.methods.getParticularListing(i).call();
      const status = await contract.methods.getStatusOfListing(data.listingID);
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
    console.log(listings);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <Forms addListing={this.addListing}/>
        </div>
      </div>
    );
  }
}

export default App;
