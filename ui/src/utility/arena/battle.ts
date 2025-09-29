import { Transaction } from "@mysten/sui/transactions";

export const battle = (packageId: string, heroId: string, arenaId: string) => {
  const tx = new Transaction();
  
  // EN: Add moveCall to start a battle.
  // RU: Добавляем вызов Move-функции для начала битвы.
  tx.moveCall({
    target: `${packageId}::arena::battle`,
    arguments: [
      tx.object(heroId), // EN: Hero object. RU: Объект героя.
      tx.object(arenaId) // EN: Arena object. RU: Объект арены.
    ]
  });
  
  return tx;
};
