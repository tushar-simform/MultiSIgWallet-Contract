require('@nomicfoundation/hardhat-toolbox');
const {config}=require("dotenv")
config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.18',
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,//change RPC url for different networks
      accounts: [
        `${process.env.ACCOUNT_PRIVATE_KEY}`,
      ],
    },
  },
};
