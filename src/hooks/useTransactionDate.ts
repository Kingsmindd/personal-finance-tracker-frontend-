import { useEffect } from "react";
import type { UseFormGetFieldState, UseFormSetValue } from "react-hook-form";
import type { TransactionFormInput } from "../validations/transaction.schema";
import { todayDate } from "../utils/transactionDate";
// Refresh an untouched default at opening/midnight; never overwrite a chosen date.
export function useTransactionDate(active: boolean, getFieldState: UseFormGetFieldState<TransactionFormInput>, setValue: UseFormSetValue<TransactionFormInput>) {
 useEffect(() => {
  if (!active) return;
  const update = () => { if (!getFieldState("occurredAt").isDirty && !getFieldState("occurredAt").isTouched) setValue("occurredAt", todayDate()); };
  update(); const timer = window.setInterval(update, 60000);
  return () => window.clearInterval(timer);
 }, [active, getFieldState, setValue]);
}
