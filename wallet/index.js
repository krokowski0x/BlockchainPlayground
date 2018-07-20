const { INITIAL_BALANCE } = require('../config.js');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  };

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`;
  };

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  };

  createTransacton(recipient, amount, transactionPool) {
    if (amount > this.balance)
      throw new Error('You ain\'t got enough money in your wallet.');

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction)
      transaction.update(this, recipient, amount);
    else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  };
};

module.exports = Wallet;
