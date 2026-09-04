import z from "zod";

export const transactionSchema = z.object({
  title: z.string().min(3, "Title is required"),

  amount: z.number().positive("Amount must be greater than 0"),

  type: z.enum(["income", "expense"], {
    message: "Select a transaction type",
  }),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category is too long"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
