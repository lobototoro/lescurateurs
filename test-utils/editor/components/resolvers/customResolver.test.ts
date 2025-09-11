import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { customResolver } from '@/app/editor/components/resolvers/customResolver';

describe('customResolver', () => {
  // Define a simple schema for testing
  const testSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email({ message: 'Invalid email format' }),
    age: z.number().min(18, 'Must be at least 18 years old'),
  });

  it('should return values with no errors for valid data', async () => {
    const resolver = customResolver(testSchema);
    const validData = { name: 'John', email: 'john@example.com', age: 30 };

    const result = await resolver(validData);

    expect(result.values).toEqual(validData);
    expect(result.errors).toEqual({});
  });

  it('should return errors for invalid data', async () => {
    const resolver = customResolver(testSchema);
    const invalidData = { name: 'J', email: 'invalid-email', age: 15 };

    const result = await resolver(invalidData);

    expect(result.values).toEqual({});
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('age');
  });

  it('should handle unexpected errors gracefully', async () => {
    // Mock schema that throws an error
    const mockSchema = {
      safeParseAsync: vi.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      }),
    };

    const resolver = customResolver(mockSchema as unknown as z.ZodType);
    const result = await resolver({});

    expect(result.values).toEqual({});
    expect(result.errors).toHaveProperty('root');
    expect(result.errors.root.message).toBe(
      'An unknown error occurred during validation'
    );
  });

  it('should work with react-hook-form', () => {
    const { result } = renderHook(() =>
      useForm({
        resolver: customResolver(testSchema),
      })
    );

    expect(result.current.formState.errors).toEqual({});
  });
});
