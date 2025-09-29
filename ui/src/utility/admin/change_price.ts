import { Transaction } from "@mysten/sui/transactions";

export const changePrice = (packageId: string, listHeroId: string, newPriceInSui: string, adminCapId: string) => {
  const tx = new Transaction();
  
  // EN: Convert SUI to MIST.
  // RU: Конвертируем SUI в MIST.
  const newPriceInMist = BigInt(newPriceInSui) * 1_000_000_000n;

  // EN: Add moveCall to change hero price (Admin only).
  // RU: Добавляем вызов Move-функции для изменения цены (только админ).
  tx.moveCall({
    target: `${packageId}::marketplace::change_the_price`,
    arguments: [
      tx.object(adminCapId), // EN: Admin capability. RU: Админская капабилити.
      tx.object(listHeroId), // EN: Listed hero. RU: Объявленный герой.
      tx.pure.u64(newPriceInMist) // EN: New price in MIST. RU: Новая цена в MIST.
    ]
  });
  
  return tx;
};
