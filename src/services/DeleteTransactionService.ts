import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionDelete = await transactionsRepository.findOne(id);

    if (!transactionDelete) {
      throw new AppError('Transaction does not exists.');
    }

    await transactionsRepository.remove(transactionDelete);
  }
}

export default DeleteTransactionService;
