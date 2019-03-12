//geth节点相关服务：执行交易，向用户反馈账户信息等

const Web3 = require('web3');
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
let ver = () => {
    console.log(web3.version.node);
};
ver();

