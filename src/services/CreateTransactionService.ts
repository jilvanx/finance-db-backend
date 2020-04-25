import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionRequest): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type invalid');
    }

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        'Transaction not permitted, your outcome is bigger than total',
      );
    }

    const checkExistsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let categorySave: Category;
    if (checkExistsCategory) {
      categorySave = checkExistsCategory;
    } else {
      const newCategory = await categoryRepository.save({
        title: category,
      });
      categorySave = newCategory;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categorySave.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
