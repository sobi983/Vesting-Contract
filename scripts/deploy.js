const hre = require("hardhat");

async function main() {
 
  const ERC20 = await hre.ethers.getContractFactory("AURA");
  const erc20 = await ERC20.deploy();
  await erc20.deployed();

  const _Vesting = await ethers.getContractFactory("vesting")
  VestingC = await _Vesting.deploy(erc20.address)
  VestingC.deployed()

  console.log(
    `ERC20 Address  ${erc20.address}`
  );
  console.log(
    `Vesting Address  ${VestingC.address}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
