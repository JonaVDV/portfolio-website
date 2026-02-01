import { form } from '$app/server';
import z from 'zod';

const schema = z.object({
	name: z.string().min(2).max(100),
	email: z.email({ error: 'Invalid email address' }),
	message: z.string().min(10).max(1000)
});

export const testForm = form(schema, async () => {
	return { success: true };
});
