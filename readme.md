# Ostrom ID
  
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
