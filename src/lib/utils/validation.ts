import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(7, "Phone number is required."),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(10, "Message is too short."),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required."),
  phone: z.string().min(7, "Phone is required."),
  email: z.string().email("Valid email is required."),
  address: z.string().min(5, "Address is required."),
  area: z.string().optional(),
  note: z.string().optional(),
});