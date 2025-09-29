import { Transaction } from "@mysten/sui/transactions";

export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();
  
   // EN: Transfer admin capability to another address.
  // RU: Переносим админскую капабилити на другой адрес.
  tx.transferObjects(
    [tx.object(adminCapId)], // EN: Admin cap object. RU: Объект админской капабилити.
    to // EN: Recipient address. RU: Адрес получателя.
  );
  
  return tx;
};
