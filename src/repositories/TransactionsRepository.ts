import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);

    const transactions = await transactionRepository.find();
    let balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    if (transactions) {
      balance = transactions.reduce(
        (acc, obj) => {
          if (obj.type === 'income') {
            acc.income += obj.value;
          }

          if (obj.type === 'outcome') {
            acc.outcome += obj.value;
          }

          acc.total = acc.income - acc.outcome;

          return acc;
        },
        {
          income: 0,
          outcome: 0,
          total: 0,
        },
      );
    }

    return balance;
  }
}

export default TransactionsRepository;
