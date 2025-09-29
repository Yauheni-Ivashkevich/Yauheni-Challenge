import { Transaction } from "@mysten/sui/transactions";

export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();
  
   // Transfer admin capability to another address.
  
  tx.transferObjects(
    [tx.object(adminCapId)], // EN: Admin cap object. 
    to // Recipient address. 
  );
  
  return tx;
};
