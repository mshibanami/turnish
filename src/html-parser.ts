import { parseWithoutNativeDOM } from '@/dom-fallback'

/*
 * Set up window for Node.js
 */

const root: typeof globalThis = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {} as any)

/*
 * Parsing HTML strings
 */

function canParseHTMLNatively() {
  const Parser = typeof root.DOMParser !== 'undefined' ? root.DOMParser : undefined;
  let canParse = false;
  if (!Parser) return false;
  // Adapted from https://gist.github.com/1129031
  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if (new Parser().parseFromString('', 'text/html')) {
      canParse = true;
    }
  } catch (e) { }
  return canParse;
}

export class HTMLParser {
  // This will be assigned per environment below
  parseFromString(_input: string, _type?: string): Document {
    throw new Error('Not implemented')
  }
}

function createParser(): HTMLParser {
  if (typeof window !== 'undefined') {
    // Browser environment: use DOM API
    class HTMLParserBrowser extends HTMLParser {
      parseFromString(input: string, _type?: string): Document {
        const doc = document.implementation.createHTMLDocument('');
        const template = document.createElement('template');
        template.innerHTML = input;
        doc.body.appendChild(template.content);
        return doc;
      }
    }
    return new HTMLParserBrowser()
  } else {
    class HTMLParserFallback extends HTMLParser {
      parseFromString(input: string, _type?: string): Document {
        return parseWithoutNativeDOM(input);
      }
    }
    return new HTMLParserFallback()
  }
}

export const createHTMLParser = (): HTMLParser =>
  canParseHTMLNatively()
    ? new root.DOMParser()
    : createParser()
