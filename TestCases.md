# Test Cases

## 1 - Adding a Listing/Auction
-   After starting up the dApp, navigate to ```localhost:3000/forms```. Fill the Listing/Auction Form with the required values and submit. Confirm the transaction from Metamask.
-   **Expected Outcome** - The transaction should be successful and to see the result, navigate to ```localhost:3000``` "Products"/"Auctions" tab. The new listing/auction should now be visible.

## 2 - Buying a Listing
-   Navigate to ```localhost:3000``` "Products" tab to see all the available listings. To buy a listing, enter the ```public key``` from your public-private key pair in the provided space and press ```BUY``` button. If you have sufficient funds in your wallet, the product will be removed from this view and moved to the ```Pending Deliveries``` tab of the profile section of the seller. Now change to the seller account and open ```localhost:3000/profile```. In the ```Pending Deliveries``` tab, you will now see a new entry. Enter the ```secret item string``` in the space provided for a pending delivery and click ```Deliver``` button. This will deliver the encrypted secret string to the buyer. Now, switch back to the buyer account and navigate to ```localhost:3000/profile``` "Your Orders" tab. You should now see a new item on this page.

## 3 - Placing a Bid
-   Navigate to the "Auctions" tab of the home page. To place a bid, enter the bid value, your public key and a secret string using which to hash your bid (to keep it secret from others) and then click ```PLACE BID```. Your bid is now placed. Do the same from 2 or 3 accounts.
-   Next, switch to the seller account and navigate to "Your Auctions" tab of the ```Profile``` page. Click on ```END BIDDING TIME``` to the end the bidding phase of the auction.
-   Next, from each account you placed a bid from, go to the ```Reveal Your Bid``` page. Enter your public key and the bid value you placed earlier (Note: The bid value provided should match the bid value provided during the *bidding phase*) and press the ```REVEAL BID``` button. Do this from all the accounts.
-   Now, for the final step, go the seller account and press ```END AUCTION``` button from the ```Your Auctions``` tab of the ```Profile``` page. The balances for all the bidders are now settled after deducting the winning price. You should now see a new entry in the ```Pending Deliveries``` tab for the seller. Now, the process is same as earlier.

## 4 - Testing with Values
We ran the following test case for backend. You can use the same to enter values in frontend.
```
truffle deploy
let instance = await SmartStore.deployed()
let balance = await web3.eth.getBalance(accounts[9]);
balance
balance = await web3.eth.getBalance(accounts[8]);
balance
balance = await web3.eth.getBalance(accounts[7]);
balance
instance.addAuction("a", "b", "SecondPrice")
instance.getAuctions()
instance.placeBid(0, "0x9ef52e4d197927acb5e5c10833e2170abfc06f7903045d836c573d50b18dffae", "public key 1", {from: accounts[7]})
instance.placeBid(0, "0xdea636804cad18896dcd36555175aaaf01a96d8c6c04bf8be44e2374ff7864b2", "public key 2", {from: accounts[8]})
instance.placeBid(0, "0xdd044e774ba476726a39ca417f8ccc829d3c1b0c9f9c85b027f9123d2d701d49", "public key 3", {from: accounts[9]})
instance.endBiddingTime(0);
instance.revealBid(0, 10, "0x7465737400000000000000000000000000000000000000000000000000000000", {from: accounts[7], value: 10})
instance.revealBid(0, 1000, "0x7465737400000000000000000000000000000000000000000000000000000000", {from: accounts[8], value: 1000})
instance.revealBid(0, 100, "0x7465737400000000000000000000000000000000000000000000000000000000", {from: accounts[9], value: 100})
balance = await web3.eth.getBalance(accounts[9]);
balance
balance = await web3.eth.getBalance(accounts[8]);
balance
balance = await web3.eth.getBalance(accounts[7]);
balance
instance.endAuction(0)
instance.getPendingTransactions()
instance.delieverItem(0, 'this is your text')
balance = await web3.eth.getBalance(accounts[9]);
balance
balance = await web3.eth.getBalance(accounts[8]);
balance
balance = await web3.eth.getBalance(accounts[7]);
balance
```
This is an example of a SecondPrice auction where the following bids were made (10, 1000, 100) and the public key used is the same ```0x7465737400000000000000000000000000000000000000000000000000000000```. The winner of the auction comes out to be the 2nd bidder.