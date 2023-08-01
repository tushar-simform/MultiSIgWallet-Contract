const hre = require("hardhat");

async function main() {
  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(
    [
      "0x38C32d2c37FE6Fb5361bC3b01e9ABB4Bf4e00E4e",
      "0x3c3Ef146859aA5ECA941738b9Cad70eFE539eBB7",
    ],
    2
  );

  await multiSigWallet.deployed();

  console.log(` deployed to ${multiSigWallet.address}`); //0x7c3B1E1bf391Aa5d64d8f01aAD71decB68348bD4
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
