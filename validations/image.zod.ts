/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const uploadSchema = z.object({
  imageUri: z.string().min(1, { message: 'Please select an image' }),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
});

// Define the form data type based on the schema
export type UploadFormData = z.infer<typeof uploadSchema>;
