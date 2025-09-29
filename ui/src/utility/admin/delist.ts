import { Transaction } from "@mysten/sui/transactions";

export const delist = (
  packageId: string,
  listHeroId: string,
  adminCapId: string,
) => {
  const tx = new Transaction();

  // EN: Add moveCall to delist a hero (Admin only).
  // RU: Добавляем вызов Move-функции для снятия героя с продажи (только админ).
  tx.moveCall({
    target: `${packageId}::marketplace::delist`,
    arguments: [
      tx.object(adminCapId), // EN: Admin capability. RU: Админская капабилити.
      tx.object(listHeroId) // EN: Listed hero. RU: Объявленный герой.
    ]
  });

  return tx;
};
