import { reveal } from '../src/internal/reveal';
import type { RevealOptions } from '../src/internal/types/config';

describe('reveal', () => {
  test('Should throw an error when using invalid options', () => {
    const node = document.createElement('p');
    const invalidOptions: RevealOptions = {
      threshold: 1.2,
      opacity: 0,
      delay: -200,
      duration: 2000,
      blur: -5,
      scale: 0
    };
    expect(() => reveal(node, invalidOptions)).toThrowError('Invalid options');
  });
});
