/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const userSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    day: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.day || data.month || data.year) {
        return data.day && data.month && data.year; // All must be provided if one is provided
      }
      return true; // None are required
    },
    {
      message: 'Day, month, and year are required if one is provided',
      path: ['day'], // Error will show on the day field
    }
  )
  .refine(
    (data) => {
      if (data.year) {
        const year = parseInt(data.year, 10);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear;
      }
      return true;
    },
    {
      message: `Year must be between 1900 and ${new Date().getFullYear()}`,
      path: ['year'],
    }
  )
  .refine(
    (data) => {
      if (data.day && data.month && data.year) {
        const day = parseInt(data.day, 10);
        const monthIndex = months.indexOf(data.month) + 1; // 1-12
        const year = parseInt(data.year, 10);
        const date = new Date(year, monthIndex - 1, day);
        return (
          date.getDate() === day &&
          date.getMonth() === monthIndex - 1 &&
          date.getFullYear() === year
        );
      }
      return true;
    },
    {
      message: 'Invalid date',
      path: ['day'],
    }
  );

export type UserFormData = z.infer<typeof userSchema> & { dateOfBirth?: string };

// Define months for validation
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
