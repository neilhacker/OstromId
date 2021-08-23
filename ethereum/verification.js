import web3 from './web3';
import IdVerification from './build/IdVerification.json';

const instance = new web3.eth.Contract(
    JSON.parse(IdVerification.interface),
    process.env.SOL_CONTRANCT_ADDRESS
);

export default instance;