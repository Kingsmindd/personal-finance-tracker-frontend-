import z from "zod";
export const transactionSchema = z.object({
 occurredAt: z.iso.date("Select a valid transaction date"),
 title: z.string().trim().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
 amount: z.string().trim().regex(/^\d+(?:\.\d{1,4})?$/, "Enter a positive amount with up to four decimal places")
  .transform(Number).pipe(z.number().finite().positive("Amount must be greater than 0").max(999_999_999_999_999, "Amount is too large")),
 type: z.enum(["income", "expense"], { message: "Select a transaction type" }),
 category: z.string().trim().min(1, "Category is required").max(50, "Category is too long"),
});
export type TransactionFormInput = z.input<typeof transactionSchema>;
export type TransactionFormData = z.output<typeof transactionSchema>;
