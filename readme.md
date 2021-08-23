   ____       __                          ____    __
  / __ \_____/ /__________  ____ ___     /  _/___/ /
 / / / / ___/ __/ ___/ __ \/ __ `__ \    / // __  / 
/ /_/ (__  ) /_/ /  / /_/ / / / / / /  _/ // /_/ /  
\____/____/\__/_/   \____/_/ /_/ /_/  /___/\__,_/  


**Set up**

1. Clone repository
2. run npm i
3. Copy next.config_example.js to next.config.js
4. Deploy contracts
   Go to ./ethereum and run 
   node compile.js to get new build files
   node deploy.js to get new contract factory address
   copy address that is printed out on command line to next.config.js at env.SOL_CONTRANCT_ADDRESS
5. Obtain other credentials needed to run project
   5.1 Stripe 
      secret key
      private key
      restricted key (this will need to be set to view.....)
   5.2 MongoDB uri
   5.3 Rinkeby Infura url
   5.4 Ethereum 
      Address  
      Corresponding private key & mnemonic 
6. Open terminal and run stripe listen --forward-to localhost:3000/api/stripe_hook
7. From root directory run 'npm run dev'


---------------------- Eth contract address ----------------------
/backend/ethBackend.js
/backend/ethOpenVerification.js
/ethereum/verification.js
/pages/api/create-verification-session.js

