// Funciones de transformación de mayúsculas, minúsculas y formatos de texto

export type CaseMode =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'alternating'
  | 'toggle'
  | 'kebab'
  | 'snake'
  | 'camel'
  | 'reverse';

export function transformText(str: string, mode: CaseMode): string {
  if (!str) return '';

  switch (mode) {
    case 'upper':
      return str.toUpperCase();

    case 'lower':
      return str.toLowerCase();

    case 'title':
      return str.toLowerCase().replace(/(^|[^\p{L}])(\p{L})/gu, (_, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });

    case 'sentence': {
      const lower = str.toLowerCase();
      return lower.replace(/(^|[.!?…\n]\s*[¿¡"'«»]*)(\p{L})/gu, (_, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });
    }

    case 'alternating': {
      let upper = false;
      return Array.from(str)
        .map(char => {
          if (/\p{L}/u.test(char)) {
            upper = !upper;
            return upper ? char.toUpperCase() : char.toLowerCase();
          }
          return char;
        })
        .join('');
    }

    case 'toggle': {
      return Array.from(str)
        .map(char => {
          if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            return char.toLowerCase();
          }
          if (char === char.toLowerCase() && char !== char.toUpperCase()) {
            return char.toUpperCase();
          }
          return char;
        })
        .join('');
    }

    case 'kebab': {
      return str
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    }

    case 'snake': {
      return str
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
    }

    case 'camel': {
      const words = str
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .split(/[\s_-]+/)
        .filter(Boolean);
      if (words.length === 0) return '';
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('')
      );
    }

    case 'reverse':
      return Array.from(str).reverse().join('');

    default:
      return str;
  }
}
