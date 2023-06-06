const hre = require('hardhat');

async function main() {
  //on sepolia network ,you can change data acouding to your network
  //https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  //visit thi site for supported network configuration
  const subscriptionId = 2155;// replace with your subscription Id 
  const vrfCoordinator = '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625';
  const keyHash =
    '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c';

  const RandomNumberConsumerV2 = await hre.ethers.getContractFactory(
    'RandomNumberConsumerV2',
  );
  const random = await RandomNumberConsumerV2.deploy(
    subscriptionId,
    vrfCoordinator,
    keyHash,
  );

  await random.deployed();

  console.log(` deployed to ${random.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
