const chalk = require("chalk");
const { ethers, providers, Wallet } = require("ethers");

const ETHEREUM_RPC_URL = "https://bsc-dataseed.binance.org";
const BIDOS = "0x6Ea4fd26f9E0Ba1BCAc8519Bd7D69296e32F9157";

const provider = new providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);


const later = (delay)=> {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (msg) => new Promise(function (resolve) {
    readline.question(msg, resolve);
});

const main = async() => {
    var priKey = await question(chalk.yellow("Your wallet's private key:"));
    const wallet = new Wallet(priKey).connect(provider);
    console.log(chalk.blue("Account address:"), chalk.yellow(wallet.address));
    var interval = await question(chalk.yellow("claim interval(30 secs):"));
    interval = Number(interval||"30");
    await loop(wallet, interval*1000);
}

const loop = async (wallet, interval) => {
    var i = 0;
    while (true) {
        try {
            const tx = await wallet.sendTransaction({ to: BIDOS, value: 0 });
            console.log("#", i++, tx.hash, "nonce", tx.nonce, "gasPrice:",tx.gasPrice.toString(),"gasLimit:",tx.gasLimit.toString());
            await later(interval);
        }
        catch (ex) {
            console.error(ex);
        }
    }

}

main();
