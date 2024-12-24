import {z} from 'zod';

export const userNameValidaton = z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must contain only letters and numbers');


export const signUpSchema = z.object({
    username: userNameValidaton,
    email: z.string().email({message: 'Invalid email address'}), 
    password: z.string().min(6,{
        message: 'Password must be at least 6 characters long'
    }),
})

        