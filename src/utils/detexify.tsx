/* eslint-disable no-else-return */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/no-array-index-key */
import { DocumentReadResponse } from "models/api/response.types";
import { tex_to_unicode, unicode_to_tex } from "utils/unidata";

// lookup table to cache results
let detexifyLut: Record<string, string> = {};
let cacheHits = 0;
let cacheMisses = 0;
let texifyLut: Record<string, string> = {};

// converts TeX-escaped strings to unicode
const detexify = (textProp: string | JSX.Element[], bibtexSafe = false) => {
  const key = `${bibtexSafe} - ${textProp}`;
  if (key in detexifyLut) {
    cacheHits += 1;
    if ((cacheHits + cacheMisses) % 1000 === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Detexify cache: ${cacheHits} / ${
          cacheHits + cacheMisses
        } (${Math.round(
          (cacheHits / (cacheHits + cacheMisses)) * 100
        )}%) size: ${Object.keys(detexifyLut).length}`
      );
    }
    return detexifyLut[key];
  } else {
    cacheMisses += 1;
  }
  let text = Array.isArray(textProp) ? textProp.join(", ") : `${textProp}`;
  const mathBlocks: string[] = [];
  const mathPlaceholder = "MATHPLACEHOLDER";

  // replace math with placeholders (we want to keep math un-modified from symbol substitution)
  // So "foo $x^2$ bar" or "foo \(x^2$ bar\)" -> "foo {mathPlaceholder} bar"
  text = text.replace(/(\$+)(?:(?!\1)[\s\S])*\1|\\\(.*?\)/gm, (result) => {
    mathBlocks.push(result);
    return mathPlaceholder;
  });

  const existingSymbols: string[] = [];
  for (const texSymbol in tex_to_unicode) {
    if (text.indexOf(texSymbol) > -1) {
      existingSymbols.push(texSymbol);
    }
  }
  // sort symbols by length
  existingSymbols.sort((a, b) => b.length - a.length);
  // replace symbols by descending
  existingSymbols.forEach((symbol) => {
    text = text.replaceAll(
      symbol,
      (tex_to_unicode as Record<string, string>)[symbol]
    );
  });
  // emdash
  text = text.replaceAll("---", "\u2014");
  // endash
  text = text.replaceAll("--", "\u2013");
  // if also process non-symbol, e.g. spacing, delimiters, etc.
  if (bibtexSafe === false) {
    text = text.replaceAll("{", "");
    text = text.replaceAll("}", "");
    text = text.replaceAll("\\ ", " ");
    text = text.replaceAll("`", "\u2018");
    text = text.replaceAll("'", "\u2019");
    text = text.replaceAll("~", " ");
  }
  // restore math placeholders
  for (let i = 0; i < mathBlocks.length; i += 1) {
    text = text.replace(mathPlaceholder, mathBlocks[i]);
  }
  // reset lookup-table
  if (Object.keys(detexifyLut).length > 100_000) {
    // eslint-disable-next-line no-console
    console.log("Resetting detexify cache");
    detexifyLut = {};
    cacheHits = 0;
    cacheMisses = 0;
  }
  detexifyLut[key] = text;
  return text;
};

// escape unicode string using tex, ignoring text in mathmode
export const texify = (textProp: string | JSX.Element[]) => {
  let text = Array.isArray(textProp) ? textProp.join(", ") : `${textProp}`;
  const existingSymbols: string[] = [];
  // convert to unicode before converting back (to avoid double-escaping)
  text = detexify(text, true);

  if (`${textProp}` in texifyLut) {
    return texifyLut[`${textProp}`];
  }
  const mathBlocks: string[] = [];
  const mathPlaceholder = "MATHPLACEHOLDER";

  // replace math with placeholders (we want to keep math un-modified from symbol substitution)
  // So "foo $x^2$ bar" or "foo \(x^2$ bar\)" -> "foo {mathPlaceholder} bar"
  text = text.replace(/(\$+)(?:(?!\1)[\s\S])*\1|\\\(.*?\)/gm, (result) => {
    mathBlocks.push(result);
    return mathPlaceholder;
  });

  for (const symbol in unicode_to_tex) {
    if (text.indexOf(symbol) > -1) {
      existingSymbols.push(symbol);
    }
  }
  // sort symbols by length
  existingSymbols.sort((a, b) => b.length - a.length);
  // replace symbols by length
  existingSymbols.forEach((symbol) => {
    text = text.replaceAll(
      symbol,
      (unicode_to_tex as Record<string, string>)[symbol]
    );
  });
  text = text.replaceAll("\u2013", "--");
  text = text.replaceAll("\u2018", "`");
  text = text.replaceAll("\u2019", "'");
  // restore math placeholders
  for (let i = 0; i < mathBlocks.length; i += 1) {
    text = text.replace(mathPlaceholder, mathBlocks[i]);
  }
  // reset lookup-table
  if (Object.keys(texifyLut).length > 100_000) {
    texifyLut = {};
  }
  texifyLut[`${textProp}`] = text;
  return text;
};

export const applyDocumentDetexification = (document: DocumentReadResponse) => {
  const detexiFiedMeta: { [k: string]: any } = {};
  for (const metaField in document.meta) {
    if (
      typeof document.meta[metaField] !== "number" &&
      typeof document.meta[metaField] !== "boolean"
    ) {
      if (Array.isArray(document.meta[metaField])) {
        // detexify authors separately
        if (metaField === "author") {
          detexiFiedMeta[metaField] = document.meta[metaField].map(
            (author: string) => detexify(author, false)
          );
        } else {
          detexiFiedMeta[metaField] = document.meta[metaField];
        }
      } else {
        detexiFiedMeta[metaField] = detexify(document.meta[metaField], false);
      }
    }
  }

  return { ...document, detexiFiedMeta };
};

export default detexify;
