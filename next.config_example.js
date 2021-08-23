const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Important: return the modified config
      config.plugins = [
        ...config.plugins,
        new CopyWebpackPlugin({
            patterns: [
                { from: "node_modules/snarkjs/build/snarkjs.min.js", to: "../public" }
            ]
        })
      ]
      return config
    },
  }

  module.exports = {
    env: {
      STRIPE_SECRET_KEY: '',
      STRIPE_PUBLIC_KEY: '',
      STRIPE_RESTRICTED_KEY: '',
      ETH_PRIVATE_KEY: '',
      ETH_ADDRESS: '',
      ETH_MNEMONIC: '',
      INFURNA_URL: '',

      SOL_CONTRANCT_ADDRESS: '', // this changes after deploying new contract
      MONGODB_URI: '',
    },
  }