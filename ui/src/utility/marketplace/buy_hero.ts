import { Transaction } from "@mysten/sui/transactions";

export const buyHero = (packageId: string, listHeroId: string, priceInSui: string) => {
  const tx = new Transaction();
  
  // EN: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST).
  // RU: Конвертируем SUI в MIST (1 SUI = 1_000_000_000 MIST).
  const priceInMist = BigInt(priceInSui) * 1_000_000_000n;

  // EN: Split coin for exact payment.
  // RU: Разделяем монеты для точного платежа.
  const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)]);

  // EN: Add moveCall to buy a hero.
  // RU: Добавляем вызов Move-функции для покупки героя.
  tx.moveCall({
    target: `${packageId}::marketplace::buy_hero`,
    arguments: [
      tx.object(listHeroId), // EN: ListHero object. RU: Объект объявления героя.
      paymentCoin // EN: Payment coin. RU: Монета для платежа.
    ]
  });
    
  return tx;
};
