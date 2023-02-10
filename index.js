require("dotenv").config();
const ethers = require("ethers");
const fs = require("fs-extra")

async function main () {

    const providers = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, providers);
    

    let encryptedKeyJson = fs.readFileSync("./encryptedKey.json", "utf-8")

    let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedKeyJson, process.env.PRIVATE_KEY_PASSWORD)

    wallet = await wallet.connect(providers)
    const abi = fs.readFileSync("./SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStoage_sol_SimpleStorage.bin", "utf-8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log("Deploying please wait....")
    const contractDeploy = await contractFactory.deploy()

    console.log(`Contract address : ${contractDeploy.address}`)

    const deploymentReceipt = await contractDeploy.deployTransaction.wait(1)
    // console.log(deploymentReceipt)
    // console.log(contractDeploy)

    const currentFavouriteNumber = await contractDeploy.getFavouriteNumber()
    console.log(`My current favourite number: ${currentFavouriteNumber.toString()}`)


    // Update the favourite number
    const updateFavouriteNumber = await contractDeploy.storeFavouriteNumber('15');
    // console.log(updateFavouriteNumber)
    await updateFavouriteNumber.wait(1)

    // After updating the favourite number
    const updatedFavouriteNumber = await contractDeploy.getFavouriteNumber()
    console.log(`My updated favourite number: ${updatedFavouriteNumber.toString()}`)

}

main().then(() => process.exit(0))