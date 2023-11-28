import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image Prompt is required"
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1)
});

export const amountOptions =  new Array(5).fill(0).map((_, index) => ({
  value: `${index + 1}`,
  label: `${index + 1} Photo`,
}));

export const resolutionOptions =  new Array(3).fill(0).map((_, index) => ({
  value: `${2 ** index * 256}✕${2 ** index * 256}`,
  label: `${2 ** index * 256}✕${2 ** index * 256}`,
}));
