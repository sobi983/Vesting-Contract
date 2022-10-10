const { ethers } = require("hardhat");

async function main () {
    const accounts = await ethers.provider.listAccounts();
    // console.log(accounts);

    const ERC20_Address = '0x9A676e781A523b5d0C0e43731313A708CB607508'
    const Vesting_Address = '0x0B306BF915C4d645ff596e518fAf3F9669b97016'

    const ERC20FC = await ethers.getContractFactory("AURA")       
    const VestingFC = await ethers.getContractFactory("vesting")       

    const ERC20 = await ERC20FC.attach(ERC20_Address)
    const VestingC = await VestingFC.attach(Vesting_Address)

    await ERC20.transfer(Vesting_Address, ethers.utils.parseUnits("300", 18))
    await VestingC.addVesting(accounts[1], ethers.utils.parseUnits("100", 18))
    let a = await VestingC.vestingMap(1)
    console.log(a)

    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(accounts[1], 1)
    await network.provider.send('evm_increaseTime', [604800])
    await VestingC.withdraw(accounts[1], 1)
    console.log(await ERC20.balanceOf(accounts[1]))





    


   



  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });