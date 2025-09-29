import { Transaction } from "@mysten/sui/transactions";

export const createArena = (packageId: string, heroId: string) => {
  const tx = new Transaction();
  
  // EN: Add moveCall to create a battle place.
  // RU: Добавляем вызов Move-функции для создания арены.
  tx.moveCall({
    target: `${packageId}::arena::create_arena`,
    arguments: [tx.object(heroId)] // EN: Hero object. RU: Объект героя.
  });
  
  return tx;
};
