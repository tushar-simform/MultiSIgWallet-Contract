const { network } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { ethers } = require('ethers');
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { assert, expect } = require("chai");

describe("MultiSigWallet", function () {
  let MultiSigWallet;
  let multiSigWallet;
  let owner1;
  let owner2;
  let sender;
  let receiver;
  const numConfirm = 2; // Set the number of confirmations required for a transaction

  beforeEach(async function () {
    MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    [owner1, owner2, sender, receiver] = await ethers.getSigners();
    multiSigWallet = await MultiSigWallet.deploy(
      [owner1.address, owner2.address],
      numConfirm
    );
    await multiSigWallet.deployed();
  });

  describe("Deployment", async function () {
    it("Should initialize correctly", async function () {
      expect(Number(await multiSigWallet.numConfirm())).to.equal(numConfirm);
      expect(await multiSigWallet.owners(0)).to.equal(owner1.address);
      expect(await multiSigWallet.owners(1)).to.equal(owner2.address);
    });
  });

  it("Should submit a transaction", async function () {
    const amount = ethers.utils.parseEther("1");
    const transaction = await multiSigWallet
      .connect(sender)
      .submitTrnsaction(receiver.address, {
        value: amount,
      });

    await transaction.wait();

    const transactionDetails = await multiSigWallet.transactions(0);
    expect(transactionDetails.to).to.equal(receiver.address);
    expect(transactionDetails.value).to.equal(amount);
    expect(transactionDetails.executed).to.equal(false);

    expect(transaction)
      .to.emit(multiSigWallet, "TransactionSubmitted")
      .withArgs(0, sender.address, receiver.address, amount);
  });

  it("Should confirm a transaction", async function () {
    const amount = ethers.utils.parseEther("1");

    await multiSigWallet
      .connect(sender)
      .submitTrnsaction(receiver.address, { value: amount });

    await multiSigWallet.connect(owner1).confirmTransaction(0);
    expect(await multiSigWallet.isConfirmed(0, owner1.address)).to.equal(true);
    expect(await multiSigWallet.isTransactionConfirmed(0)).to.equal(false); // Transaction is not yet confirmed fully
  });

  it("Should execute a confirmed transaction", async function () {
    const amount = ethers.utils.parseEther("1");
    await multiSigWallet
      .connect(sender)
      .submitTrnsaction(receiver.address, { value: amount });

    const beforeBalance = await ethers.provider.getBalance(receiver.address);
    await multiSigWallet.connect(owner1).confirmTransaction(0);
    await multiSigWallet.connect(owner2).confirmTransaction(0);
    expect(await multiSigWallet.isTransactionConfirmed(0)).to.equal(true);

    const afterBalance = await ethers.provider.getBalance(receiver.address);

    expect(afterBalance.sub(beforeBalance)).to.equal(amount);
    console.log(await multiSigWallet.transactions(0).executed);
    // expect(await multiSigWallet.transactions(0).executed).to.equal(true);
  });
});
