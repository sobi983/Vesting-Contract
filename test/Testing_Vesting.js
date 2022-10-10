const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var colors = require('colors');
const { TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS } = require("hardhat/builtin-tasks/task-names");

describe(colors.red("Vesting Contract Testing").bgGreen, function () {
  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });
  
  let owner, vester1,vester2,vester3, ERC20, VestingC


  it("Deployment of the Contracts", async()=>{
    [owner, vester1,vester2,vester3 ] = await ethers.getSigners();

    const _ERC20 = await ethers.getContractFactory("AURA")
    ERC20 = await _ERC20.deploy()
    ERC20.deployed()

    const _Vesting = await ethers.getContractFactory("vesting")
    VestingC = await _Vesting.deploy(ERC20.address)
    VestingC.deployed()
  })

  it("Checking the Balance of the Owner", async()=>{
    expect(ethers.utils.parseUnits("100000000",18)).to.equal(await ERC20.balanceOf(owner.address))
    
  })
  
  // it("Transferring the tokens to the ", async()=>{
  //   await ERC20.transfer(vester1.address, ethers.utils.parseUnits("100", 18))
  //   await ERC20.transfer(vester2.address, ethers.utils.parseUnits("100", 18))
  //   await ERC20.transfer(vester3.address, ethers.utils.parseUnits("100", 18))
  //   expect(ethers.utils.parseUnits("1000",18)).to.not.equal(await ERC20.balanceOf(vester3.address))
  //   expect(ethers.utils.parseUnits("100",18)).to.equal(await ERC20.balanceOf(vester2.address))
  // })

  it("Checking the function by Adding vesting throught the unknown address rather than the owner", async()=>{
    try{
      await VestingC.connect(vester3).addVesting(vester2.address, ethers.utils.parseUnits("100", 18))
    }catch(err){
      console.log(colors.green("      Done by purpose"))
    }
    // await VestingC.connect(vester2).addVesting(vester3.address, ethers.utils.parseUnits("100", 18))
    // await VestingC.connect(vester3).addVesting(vester1.address, ethers.utils.parseUnits("100", 18))
  })
  
  it("Without the owners Vesting or even transferring the tokens Try to vest from the owner", async()=>{
    try{
      await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("100", 18))
    }catch(err){
      console.log(colors.green("      Done by purpose"))
    }
  })
  
  it("Tranferring the tokens to the Vesting contract from the ERC20 by the Owner", async()=>{
    await ERC20.transfer(VestingC.address, ethers.utils.parseUnits("300", 18))
  })
  
  it("Checking the balance of the Vesting contract", async()=>{
    expect(ethers.utils.parseUnits("300",18)).to.equal(await ERC20.balanceOf(VestingC.address))
  })
  
  it("Now again checking if the Other users are able to vest for themself or for the others", async()=>{
    
    // await VestingC.connect(vester2).addVesting(vester2.address, ethers.utils.parseUnits("100", 18))
    // await VestingC.connect(vester1).addVesting(vester2.address, ethers.utils.parseUnits("100", 18))
    try{
      await VestingC.connect(vester3).addVesting(vester2.address, ethers.utils.parseUnits("100", 18))
    }catch(err){
      console.log(colors.green("      Done by purpose"))
    }
  })

  it("Vesting from the onwers account to just one vester", async()=>{
    await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("100", 18))
    await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("10", 18))
    await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("20", 18))
    await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("30", 18))
    await VestingC.addVesting(vester1.address, ethers.utils.parseUnits("40", 18))
    await VestingC.addVesting(vester2.address, ethers.utils.parseUnits("40", 18))
  })

  it("fetching the user data record", async()=>{
    let a = await VestingC.vestingMap(6)
    // console.log(a)
    expect(a[4]).to.equal(ethers.utils.parseUnits("40", 18))
  })

  // it("Wthdrawing the amount from the User's account by interacting with users personal account", async()=>{
  //   await network.provider.send('evm_increaseTime', [604800])
  //   await VestingC.connect(vester1).withdraw(vester1.address, 1)
  //   await network.provider.send('evm_increaseTime', [604800])
  //   await VestingC.connect(vester1).withdraw(vester1.address, 1)
  //   expect(ethers.utils.parseUnits("100", 18)).to.equal(await ERC20.balanceOf(vester1.address))
  // })

  it("Wthdrawing the amount from the Owner account for the USERS", async()=>{
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 1)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 1)
    expect(ethers.utils.parseUnits("100", 18)).to.equal(await ERC20.balanceOf(vester1.address))

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 2)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 2)
    expect(ethers.utils.parseUnits("110", 18)).to.equal(await ERC20.balanceOf(vester1.address))

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 3)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 3)
    expect(ethers.utils.parseUnits("130", 18)).to.equal(await ERC20.balanceOf(vester1.address))

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 4)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 4)
    expect(ethers.utils.parseUnits("160", 18)).to.equal(await ERC20.balanceOf(vester1.address))

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 5)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(vester1.address, 5)
    expect(ethers.utils.parseUnits("200", 18)).to.equal(await ERC20.balanceOf(vester1.address))

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.connect(vester2).withdraw(vester2.address, 6)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.connect(vester2).withdraw(vester2.address, 6)
    expect(ethers.utils.parseUnits("40", 18)).to.equal(await ERC20.balanceOf(vester2.address))


  })

  it("Checking the ownership transfer()", async()=>{
    await VestingC.transferOwnership(vester1.address)
    expect(vester1.address).to.equal(await VestingC.ContractOwner())
  })

  
});