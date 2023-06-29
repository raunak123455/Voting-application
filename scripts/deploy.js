// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  const Voting_ = await Voting.deploy(["Mark", "Mike", "Henry", "Rock"], 90);
  console.log("Voting address", Voting_.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
