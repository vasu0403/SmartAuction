# README
## ABOUT
This repository contains the code for a smart contract written in solidity which can be deployed on the etherium blockchain.
This smart contract allows sellers to host their products which they want to sell or auction off on the blockchain network. Buyers can view the available products and auctions, and make purchases by paying the asked amount in ether or place bids if they win an auction. After a buyer makes a pruchase, the seller sends a string to the buyer (here the string represents the acutal product), and only once he delivers this thing, he gets paid. It is also made sure that this string (which represents the product) can only be made sense by the buyer (this is done by encrypting the string which can only be decrypted by the buyer).

## Installation
```
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc

npm install -g truffle

npm install eth-crypto 
```

## Steps to run
-   In one terminal window, run the following. This will start the blockchain and deploy the contracts.
```
truffle develop
deploy
```
-   In another terminal window, run the following. This will install the necessary modules and start a localhost server to interact with the smart contract.
```
npm install
npm start run
```

## Brief description about logic
This sections contains details about the smart contract that have been used to create the frontend of the dApp. The deployed smart contract exposes several functions, using which buyers and sellers can fulfill their reuirements.

### Listings
To add a product on sale, sellers can call the ```addListing()``` function. They must provide the item name, description and price. This item is then added to a list ```listings``` which maintains a record of all the products (irrespective of whether on sale or already sold).

To view all the available products for sale, ```getListings()``` functions can be called which returns all the products which are currently on sale (it does not display the products for which a buyer has already paid the price). This function basically selects those products from ```listings``` for which the status is not not sold. To maintain this status, a map ```status``` is maintained which maps item ID to its status. The status can take 4 values: ```UNDEFINED```, ```AVAILABLE```, ```PENDING_DELIVERY```, ```DELIVERED```. The function displays all products with status ```AVAILAVLE```

To buy a product, the buyer must call the ```buyListing()``` function and supply the item ID and a public-key. This public key is part of a public-private key pair which the user must generate himself (see sample test case 2). This key will be later used by the seller to encrypt the item text. If the buyer pays the required amount, then the status of that product is changed to ```PENDING_DELIVERY```. For each seller a map ```pendingDeliveries``` is maintained, which basically stores for each seller, what all products he need to deliver (products for which user have already paid). Thus, in functino ```buyListing()``` the corresponding product is added to the corresponding sellers list in ```pendingDeliveries```.

Sellers can view all their pending delieveries by calling the ```getPendingTransactions()``` function. This function returns them a list which contain the product name, description, ID as well the public-key for the products they need to deliver.

Sellers can deliver a product by calling the ```deliverItem()``` function. They must supply the item ID and the item text. They will generate the item text by encrypting it with the public-key of that product (they will get the public-key for that product by calling the ```getPendingTransactions()``` function). This changes the status of that product to ```DELIVERED```. A map ```myItems``` is maintained which stores for each buyer, what all product have been delivered to them. This map is thus modified in the ```deliverItem()``` function. As a last step, this function pays the amount to the seller (it is assumed that seller always provides the right ecnrypted item text)

To view all their delivered products, buyers call the ```getItems()``` function. This function returns them a list of all products delievered to them, along with their item text (note that item text here will be encrypted, and the buyer must decrypt it with his private-key, which he must already have. See sample test case 2 for more clarity)

Since the item-text is always encrypted with the public key provided by the user, even though everyone can access this text, only the buyer can make sense of it, as only he has the private-key.

### Auctions
To start an auction for a product, sellers can call the ```addAuction()``` function. They must provide the item name, description and the type of auction - ```FirstPrice```, ```SecondPrice``` or ```Third Price```. This item is then added to a list ```auctions``` which maintains a record of all the auctions (irrespective of whether active or not).

To view all the live auctions, ```getAuctions()``` functions can be called which returns all the auctions which are currently active (it does not display the auctions for which the bidding has ended or the auction has ended). This function basically selects those auctions from ```auctions``` for which the status is ```RUNNING```. To maintain this status, a map ```status``` is maintained which maps item ID to its status. The status can take 5 values: ```UNDEFINED```, ```RUNNING```, ```REVEAL_TIME```,```PENDING_DELIVERY```, ```DELIVERED```. The function displays all products with status ```RUNNING```.

Buyers are allowed to place only one bid for a product. To place a bid, the buyer must call the ```placeBid()``` function and provide the auction ID, a bid value and a public key (the private key for which is with the buyer). After some time, the owner of the auction, i.e. the seller, can decide to stop the bidding phase for an auction by calling the ```endBiddingTime``` function. Once the bidding phase for an auction ends, the bidders can now reveal their bids and transfer balance to the wallet using the ```revealBid``` function which takes the auctionID, the bid value and the public key as its arguments. If a bidder does not reveal their bid before the auction ends, they will not be considered for the final result of the auction. The seller can end an auction by calling ```endAuction()``` function. This function calculates the winner of the auction by calling the appropriate method of the auction object, changes the state of the auction to ```PENDING_DELIVERY``` and settles all the balances after deducting the price of the winning bid. After this step, the item corresponding to the auction gets added to the corresponding sellers list in ```pendingDeliveries```. After this, the process is the same as for ```Listings```.

**Note: To generate keys, go to ```/keys```**


