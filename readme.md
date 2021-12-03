# Ostrom ID
 
## Description
* This program will create a front end that allows a user to verify their proof of personhood with stripe ID.
* Once a successful verification has occured they are given a random preimage and MiMC hash of that preimage.
* This hash will have been submitted by the server to a smart contract if the id verification passed.
* They can then used these details to generate a zero-knowledge proof and submit this to the smart contract.
* The contract checks if the hash was also submited by the server and if so will deactivate the hash and flag the sending address as TRUE (i.e belonging to a unique person)

## Goal
* This is meant to be a proof of concept for using a zkp to help reintroudce anonyminty to proof of unique personhood procedures that using a centralised id checking service removes.
* Centralised services are very user friendly and very secure at checking that a real person is verifiying their real id.
* This provides a very strong proof of unique personhood but creates the opportunity to then link addresses with real identities that some users may find more intrusive than they want for a simple PoUP.
* By using zkp we decopule the verification and the submission in a way that we cannot link addresses to the identies that control them. 

## Demo
This is a 6ish minute screen recording of running through the user flow https://drive.google.com/file/d/1i0LCGnA4C1H2LVTmJgrap9iZohL9uVl1/view


## Set up
Clone repository
```sh
git clone https://github.com/neilhacker/OstromId.git
```

Install dependencies
```sh
npm i
```

Copy next.config.js
```sh
cp next.config_example.js  next.config.js
```
Deploy contracts
```sh
cd ethereum
node compile.js
node deploy.js
// copy address from console to .env.SOL_CONTRANCT_ADDRESS
```
Obtain other credentials needed to run project
| Source  | Variable |
| ------  | ------ |
| Stripe  | Secret Key |
| Stripe  | Public Key |
| Stripe  | Restricted Key* |
| MongoDB | uri |
| Infura  | Rinkeby Infura url |
| Ethereum | Address |
| Ethereum | Private Key |
| Ethereum | Mnemonic |

\* Once you have a Stripe account you can create this key in dashboard.stripe.com/test/apikeys for permissions everything stays as NONE except in the Identity section have 'Verification Sessions and Reports' & 'Access recent detailed verification results' marked as READ

Run stripe webhook listener:
```sh
stripe listen --forward-to localhost:3000/api/stripe_hook
```
In second tab run:
```sh
npm run dev
```
