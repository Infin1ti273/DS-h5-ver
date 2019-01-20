//geth节点相关服务：执行交易，向用户反馈账户信息等

const Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const ver = () => {console.log(web3.version);};

ver();