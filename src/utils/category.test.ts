import { normalizeCategory, toProductType } from './category';

describe('category utilities', () => {
  test('normalizeCategory trims, collapses spaces and uppercases', () => {
    expect(normalizeCategory('  hello  world  ')).toBe('HELLO WORLD');
    expect(normalizeCategory('')).toBe('');
    expect(normalizeCategory('   ')).toBe('');
  });

  test('toProductType maps fields correctly', () => {
    const input = {
      id: 123,
      arqProductId: 456,
      productName: 'foo',
      price: '9.99',
      categoryId: 789,
      comments: ['a'],
      information: 'info',
      category: 'cat',
      preparationTime: 10,
      image: 'url',
      quantity: 5,
      description: 'desc',
    };
    const result = toProductType(input);
    expect(result).toEqual({
      id: '123',
      arqid: '456',
      productName: 'foo',
      price: 9.99,
      categoryId: '789',
      comments: ['a'],
      information: 'info',
      category: 'cat',
      preparationTime: 10,
      image: 'url',
      quantity: 5,
      description: 'desc',
    });
  });
});