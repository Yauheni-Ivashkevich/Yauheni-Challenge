import { Transaction } from "@mysten/sui/transactions";

export const transferHero = (heroId: string, to: string) => {
  const tx = new Transaction();
  
  // EN: Transfer hero to another address.
  // RU: Переносим героя на другой адрес.
  tx.transferObjects(
    [tx.object(heroId)], // EN: Hero object. RU: Объект героя.
    to // EN: Recipient address. RU: Адрес получателя.
  );
  
  return tx;
};