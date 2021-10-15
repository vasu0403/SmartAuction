# Test Cases
Before running any test case, import atleast 4 different accounts using metamask. If you ever face an unexpected transaction failed, then make sure to reset your transaction history from metamask and then try the transaction again
## 1 - Adding a Listing/Auction
-   After starting up the dApp, navigate to ```localhost:3000/forms```. Fill the Listing/Auction Form with the required values and submit. Confirm the transaction from Metamask.
-   **Expected Outcome** - The transaction should be successful and to see the result, navigate to ```localhost:3000``` "Products"/"Auctions" tab. The new listing/auction should now be visible.

## 2 - Buying a Listing
-   Navigate to ```localhost:3000``` "Products" tab to see all the available listings. Click on the buy button (in the background, this generates a pair of public/secret key. Your pulick key will be transferred to the buyer). If you have sufficient funds in your wallet, the product will be removed from this view and moved to the ```Pending Deliveries``` tab of the profile section of the seller. Now change to the seller account and open ```localhost:3000/profile```. In the ```Pending Deliveries``` tab, you will now see a new entry. Enter the plaintext that represents the product (in the frontend itself, this plaintext will be encrypted by the public key of the buyer and only then will it be sent to the backend. This ensures that only hashed values are stored on the blockchain network)and click ```Deliver``` button. This will deliver the encrypted secret string to the buyer. Now, switch back to the buyer account and navigate to ```localhost:3000/profile``` "Your Orders" tab. You should now see a new item on this page (The item will be automatically decrypted using your secret key in the frontend. So what you will see represents the actual plain text sent by the seller)

## 3 - Placing a Bid
-   Navigate to the "Auctions" tab of the home page. To place a bid enter your bidding price and random text (the client code will generate a pair of public/secret key and a bid key. The public/private key pair is used for a similar purpose as described in test case 2. The random text will be used to hash the bid value on client side. This hashed bid will then be sent to the backend. This ensures that only hashed bids are stored on the backend during bidding phase) and then click ```PLACE BID```. Your bid is now placed. Do the same from 2 or 3 accounts.
-   Next, switch to the seller account and navigate to "Your Auctions" tab of the ```Profile``` page. Click on ```END BIDDING TIME``` to the end the bidding phase of the auction.
-   Next, from each account you placed a bid from, go to the ```Reveal Your Bid``` page. Enter the bid value you placed earlier (Note: The bid value provided should match the bid value provided during the *bidding phase* otherwise your bid will be considered invalud) and press the ```REVEAL BID``` button. Do this from all the accounts.
-   Now, for the final step, go the seller account and press ```END AUCTION``` button from the ```Your Auctions``` tab of the ```Profile``` page. The balances for all the bidders are now settled after deducting the winning price. You should now see a new entry in the ```Pending Deliveries``` tab for the seller. Now, the process is same as earlier (described in test case 2).

## Test Case 4
- With the first account start an average priced auction
- With second, third and fourth account, place bid values of 100, 200 and 300 respectively.
- With the first account, end the bidding period.
- With second, third and fourth account, reveal your bid.
- With the first account, end the auction.
- Navigate to the pending deliveries tab. The displayed price should be 200 (as it is second price auction). Deliver the item by providing the item text
- Switch to account 4. Go to your oders tab in your profile. You should see the delivered item there (account 4 is the winner as he placed the highest bid)