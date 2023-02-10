import axios from "axios";
import levenshtein from "fast-levenshtein";
import {
  DocumentReadResponse,
  SauceReference,
} from "models/api/response.types";
import { defaultOrganizationSchema } from "./bibtexSchema";
import detexify, { texify } from "./detexify";

export const parseBibTeX = (
  content: string
): {
  entrytype: string;
  citekey: string;
  index: number;
  properties: Record<string, string>;
}[] => {
  const cleanValue = (val: string): string => {
    return val
      .trim()
      .replace(/\s*\n\s*/, " ")
      .replace(/\s+/gm, " ");
  };
  // add comma to lines that end with } to avoid bug when trying to capture value like
  // publisher = {Elsevier {BV}}
  // which would otherwise capture group "Elsevier {BV" (missing right curly brace)
  const processed = content
    .split("\n")
    .map((line) => {
      if (line.trimEnd().endsWith("}")) {
        return `${line.trimEnd()},`;
      }
      return line;
    })
    .join("\n");
  const entryPattern = /@(\S+)\s*?{\s*?(.+?)?\s*?[,\n]+$/gm;
  const kvPattern =
    /(\w+)\s*=\s*(?:\{(.*?)\}"?\s*?(?:,|\})\s*?$|"(.*?)"\s*?(?:,|\})\s*?$|([0-9]+)\s*?(?:,|\})\s*?$)/gms;
  const matches = [...processed.matchAll(entryPattern)];
  const entries: Array<{
    entrytype: string;
    citekey: string;
    index: number;
    properties: Record<string, string>;
  }> = [];
  matches.forEach((match) => {
    const { index, 1: entrytype, 2: citekey } = match;
    entries.push({
      index: index as number,
      entrytype,
      citekey,
      properties: {},
    });
  });
  entries.forEach((entry, entryIndex) => {
    const nextIndex =
      entryIndex < entries.length - 1
        ? entries[entryIndex + 1].index
        : processed.length;
    const entryContent = processed.substr(entry.index, nextIndex - entry.index);
    const kvMatches = [...entryContent.matchAll(kvPattern)];
    const properties: Record<string, string> = Object.fromEntries(
      kvMatches.map((kvGroup) => {
        const name = kvGroup[1].toLowerCase().trim();
        const value = kvGroup[2] || kvGroup[3] || kvGroup[4];
        const clean = value ? cleanValue(value) : "";
        // check for extra opening or closing curly brace.
        const charCount = (s: string, c: string): number =>
          s.split(c).length - 1;
        const parity = charCount(clean, "{") - charCount(clean, "}");
        if (parity > 0 && clean.startsWith("{")) return [name, clean.slice(1)];
        if (parity < 0 && clean.endsWith("}"))
          return [name, clean.slice(0, clean.length - 1)];
        return [name, clean];
      })
    );
    entries[entryIndex].properties = properties;
  });
  return entries;
};

export const exportBibTeX = (
  document: DocumentReadResponse | SauceReference
): string => {
  const parts: string[] = [];
  const entryType =
    document.meta.entrytype && document.meta.entrytype !== ""
      ? document.meta.entrytype
      : "article";
  const citeKey =
    document.meta.citekey && document.meta.citekey !== ""
      ? document.meta.citekey
      : `kg-document-${document.id}`;
  parts.push(`@${entryType}{${citeKey},`);
  const props: string[] = [];
  defaultOrganizationSchema.forEach((schema) => {
    let value = document.meta[schema.name];
    if (schema.type === "author" && Array.isArray(value)) {
      value = value.join(" and ");
    }
    if (
      value &&
      !["citekey", "entrytype", "cite-key", "entry-type", "abstract"].includes(
        schema.name
      )
    ) {
      // apply indentation
      const valueStr = texify(`${value}`)
        .split("\n")
        .join(`\n${"".padStart(16, " ")}`);
      props.push(`${schema.name.padStart(12, " ")} = {${valueStr}}`);
    }
  });
  parts.push(props.join(",\n"));
  parts.push(`}`);
  return parts.join("\n");
};

export type BibtexEntry = Record<string, any>;

// get fraction between 0.0 and 1.0 of how similar two strings are
const getSimilarityRatio = (
  a: string | undefined,
  b: string | undefined
): number => {
  if (a === undefined || b === undefined) return 0;
  const length = Math.max(a.length, b.length);
  if (length === 0) return 0;
  return (length - levenshtein.get(a, b)) / length;
};

// get fraction between 0.0 and 1.0 of how similar two documents are
// according to a specific property
const getSimilarity = (
  property: string,
  entry: BibtexEntry,
  document: DocumentReadResponse
): number => {
  if (property === "citekey") {
    return getSimilarityRatio(entry.citekey as string, document.meta.citekey);
  }
  return getSimilarityRatio(entry[property] as string, document.meta[property]);
};

export interface DedupeMatch {
  id: number;
  score: number;
  incoming: BibtexEntry;
  current: BibtexEntry;
}

export const findMatches = (
  documents: DocumentReadResponse[] | undefined,
  entry: BibtexEntry
): DedupeMatch[] => {
  const matches: DedupeMatch[] = [];
  if (!documents) return matches;
  documents
    .filter((document) => !document.is_trash)
    .forEach((document) => {
      const score = getSimilarity("title", entry, document);
      matches.push({
        id: document.id,
        score,
        incoming: entry,
        current: document.meta,
      });
    });
  if (matches.length > 0) {
    // sort matches in descending order by score
    matches.sort((a, b) => {
      return b.score - a.score;
    });
  }
  return matches.length > 5 ? matches.slice(0, 5) : matches;
};

// TODO: make this more robust
export const entriesAreEqual = (a: BibtexEntry, b: BibtexEntry) => {
  return `${a.title}` === `${b.title}` && `${a.citekey}` === `${b.citekey}`;
};

function notEmpty(str: string) {
  if (!str) return false;
  return (`${str}` || "").trim() !== "";
}

export interface BibtexEntryDiffResult {
  currentMissing: string[];
  incomingMissing: string[];
  conflicts: string[];
}

export const bibtexEntryDiff = (
  current: Record<string, any>,
  incoming: Record<string, any>
): BibtexEntryDiffResult => {
  const toString = (value: any): string => {
    return Array.isArray(value) ? value.join(" and ") : `${value}`.trim();
  };
  const currentKeys = new Set<string>(
    Object.keys(current).filter((key) => toString(current[key]) !== "")
  );
  const incomingKeys = new Set<string>(
    Object.keys(incoming).filter((key) => toString(incoming[key]) !== "")
  );
  const incomingMissing = new Set(
    [...currentKeys].filter((x) => !incomingKeys.has(x))
  );
  const currentMissing = new Set(
    [...incomingKeys].filter((x) => !currentKeys.has(x))
  );
  const conflicts: string[] = [];
  const intersection = new Set(
    [...currentKeys].filter((x) => incomingKeys.has(x))
  );
  [...intersection].forEach((key) => {
    const currentValue = toString(current[key]);
    const incomingValue = toString(incoming[key]);
    if (currentValue !== incomingValue) {
      conflicts.push(key);
    }
  });
  return {
    currentMissing: [...currentMissing],
    incomingMissing: [...incomingMissing],
    conflicts,
  };
};

// Converts names into standard format:
// eslint-disable-next-line no-irregular-whitespace
// "Firstname A. LastName" => "F. A. LastName"
// eslint-disable-next-line no-irregular-whitespace
// "Lastname, Firstname A." => "F. A. LastName"
export function normalizeAuthor(name: string) {
  const hsp = "\u200A";
  const thsp = "\u2009";
  // const nbsp = "\u00A0";
  if (name.includes(",")) {
    const index = name.indexOf(",");
    const beforeComma = name.substring(0, index);
    const afterComma = name.substring(index + 1);
    const lastName = beforeComma.trim();
    const remainderAlpha = afterComma.trim().replace(/[^a-zA-Z]/g, " ");
    const parts = remainderAlpha.trim().split(/\s+/);
    const initials = parts
      .filter((part) => part.trim() !== "")
      .map((part) => part.charAt(0).toUpperCase());
    const firstPart = initials.map((ch) => `${ch}.`).join(hsp);
    return `${firstPart}${thsp}${lastName}`;
  }
  const tokens = name.split(/\s+/);
  const lastName = tokens[tokens.length - 1];
  const remainder = name.substring(0, name.length - lastName.length).trim();
  const remainderAlpha = remainder.replace(/[^a-zA-Z]/g, " ");
  const parts = remainderAlpha.trim().split(/\s+/);
  const initials = parts
    .filter((part) => part.trim() !== "")
    .map((part) => part.charAt(0).toUpperCase());
  const firstPart = initials.map((ch) => `${ch}.`).join(hsp);
  return `${firstPart}${thsp}${lastName}`;
}

export interface BibtexEntryFormatted {
  authors: string;
  title: string;
  remainder: string;
  // html: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bibtexEntry2html(
  p: any,
  selectMain?: boolean
): BibtexEntryFormatted {
  if (!p) {
    return {
      authors: "",
      title: "",
      remainder: "undefined",
    };
  }
  if (!p.author) {
    p.author = [];
  }
  if (!p.editor) {
    p.editor = [];
  }
  if (!!p.author && !Array.isArray(p.author)) {
    p.author = p.author.split(" and ");
  }
  if (!!p.editors && !Array.isArray(p.editors)) {
    p.editors = p.editors.split(" and ");
  }
  const num_authors = p.author.length;
  let authors = "";
  let formatted = p.author.map((author: string) => {
    return normalizeAuthor(author);
  });
  if (num_authors > 1) {
    const author_list = formatted.slice(0, formatted.length - 1);
    const last_author = formatted[formatted.length - 1];
    authors = `${author_list.join(", ")} and ${last_author}`;
  } else if (num_authors === 1) {
    // eslint-disable-next-line prefer-destructuring
    authors = formatted[0];
  }
  let editors = "";
  if (!!p.editor && Array.isArray(p.editor)) {
    const num_editors = p.editor.length;
    formatted = p.editor.map((editor: string) => {
      return editor.replace(" ", "\u00a0");
    });
    if (num_editors > 1) {
      const editor_list = formatted.slice(0, num_editors - 1);
      const last_editor = formatted[num_editors - 1];
      editors = `${editor_list.join(", ")} and ${last_editor}`;
      editors += " eds.";
    } else if (num_editors === 1) {
      // eslint-disable-next-line prefer-destructuring
      editors = formatted[0];
      editors += " ed.";
    }
  }
  let publisher = "";
  if (!!p.publisher && notEmpty(p.publisher)) {
    publisher = p.publisher;
    if (!!p.address && notEmpty(p.address)) {
      publisher += `, ${p.address}`;
    }
  }
  const bib: string[] = [];
  if (!p.entrytype) p.entrytype = "article";
  if ((p.entrytype as string).toLowerCase() === "article") {
    // journal
    if (!!p.journal && notEmpty(p.journal)) {
      if (!selectMain) {
        bib.push(`, ${p.journal}`);
      } else {
        bib.push(`, <span class="journal">${p.journal}</span>`);
      }
    }
    if (!!p.volume && notEmpty(p.volume)) {
      if (!selectMain) {
        bib.push(`, ${p.volume} (${p.year})`);
      } else {
        bib.push(`, ${p.volume} <span class="year">(${p.year})</span>`);
      }
    } else if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, (${p.year})`);
      } else {
        bib.push(`, <span class="year">(${p.year})</span>`);
      }
    }
    // pages
    if (!!p.pages && notEmpty(p.pages)) {
      bib.push(`, pp.\u00a0${p.pages}`);
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(" ");
      bib.push(`${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "book") {
    // volume
    if (!!p.volume && notEmpty(p.volume)) {
      bib.push(`, vol.\u00a0${p.volume}`);
    }
    // publisher
    if (notEmpty(publisher)) {
      bib.push(`, ${publisher}`);
    }
    // edition
    if (!!p.edition && notEmpty(p.edition)) {
      bib.push(`, ${p.edition}\u00a0ed.`);
    }
    // Month Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "inbook") {
    // booktitle
    if (!!p.booktitle && notEmpty(p.booktitle)) {
      bib.push(`, in\u00a0${p.booktitle}`);
    }
    // volume
    if (!!p.volume && notEmpty(p.volume)) {
      bib.push(`, vol.\u00a0${p.volume}`);
    }
    // publisher
    if (notEmpty(publisher)) {
      bib.push(`, ${publisher}`);
    }
    // edition
    if (!!p.edition && notEmpty(p.edition)) {
      bib.push(`, ${p.edition}\u00a0ed.`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    // chapter
    if (!!p.chapter && notEmpty(p.chapter)) {
      bib.push(`, ch.\u00a0${p.chapter}`);
    }
    // pages
    if (!!p.pages && notEmpty(p.pages)) {
      bib.push(`, pp.\u00a0${p.pages}`);
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "incollection") {
    // booktitle
    if (!!p.booktitle && notEmpty(p.booktitle)) {
      bib.push(`, in\u00a0${p.booktitle}`);
    }
    // editor(s)
    if (notEmpty(editors)) {
      bib.push(`, {editors}`);
    }
    // volume
    if (!!p.volume && notEmpty(p.volume)) {
      bib.push(`, vol.\u00a0${p.volume}`);
    }
    // publisher
    if (notEmpty(publisher)) {
      bib.push(`, ${publisher}`);
    }
    // edition
    if (!!p.edition && notEmpty(p.edition)) {
      bib.push(`, ${p.edition}\u00a0ed.`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    // chapter
    if (!!p.chapter && notEmpty(p.chapter)) {
      bib.push(`, ch.\u00a0${p.chapter}`);
    }
    // pages
    if (!!p.pages && notEmpty(p.pages)) {
      bib.push(`, pp.\u00a0${p.pages}`);
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "inproceedings") {
    // booktitle
    if (!!p.booktitle && notEmpty(p.booktitle)) {
      bib.push(`, in\u00a0${p.booktitle}`);
    }
    // editor(s)
    if (notEmpty(editors)) {
      bib.push(`, {editors}`);
    }
    // volume
    if (!!p.volume && notEmpty(p.volume)) {
      bib.push(`, vol.\u00a0${p.volume}`);
    }
    // address
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    // organization
    if (!!p.organization && notEmpty(p.organization)) {
      bib.push(`, ${p.organization}`);
    }
    // publisher
    if (!!p.publisher && notEmpty(p.publisher)) {
      bib.push(`, ${p.publisher}`);
    }
    // pages
    if (!!p.pages && notEmpty(p.pages)) {
      bib.push(`, pp.\u00a0${p.pages}`);
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "mastersthesis") {
    // school
    if (!!p.school && notEmpty(p.school)) {
      bib.push(`, ${p.school}`);
    }
    // adress
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "phdthesis") {
    // school
    if (!!p.school && notEmpty(p.school)) {
      bib.push(`, ${p.school}`);
    }
    // adress
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "manual") {
    // organization
    if (!!p.organization && notEmpty(p.organization)) {
      bib.push(`, ${p.organization}`);
    }
    // address
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // edition
    if (!!p.edition && notEmpty(p.edition)) {
      bib.push(`, ${p.edition}\u00a0ed.`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "misc") {
    // howpublished
    if (!!p.howpublished && notEmpty(p.howpublished)) {
      bib.push(`, ${p.howpublished}`);
    }
    // Year
    if (!!p.year && notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "proceedings") {
    // editors (default to authors if empty)
    // const authorList =
    // if (notEmpty(editors)) {
    //   bib.push(`, {editors}`);
    // } else if (num_authors > 1) {
    //   bib.push(`${authors}, eds.`);
    // } else {
    //   bib.push(`${authors}, ed.`);
    // }
    // volume
    if (!!p.volume && notEmpty(p.volume)) {
      bib.push(`, vol.\u00a0${p.volume}`);
    }
    // address
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    // organization
    if (!!p.organization && notEmpty(p.organization)) {
      bib.push(`, ${p.organization}`);
    }
    // publisher
    if (!!p.publisher && notEmpty(p.publisher)) {
      bib.push(`, ${p.publisher}`);
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "techreport") {
    // number
    if (!!p.number && notEmpty(p.number)) {
      bib.push(`, Tech.\u00a0Rep.\u00a0${p.number}`);
    }
    // institution
    if (!!p.institution && notEmpty(p.institution)) {
      bib.push(`, ${p.institution}`);
    }
    // address
    if (!!p.address && notEmpty(p.address)) {
      bib.push(`, ${p.address}`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
  } else if ((p.entrytype as string).toLowerCase() === "unpublished") {
    bib.push(".");
    // note
    if (!!p.note && notEmpty(p.note)) {
      bib.push(` ${p.note}.`);
    }
    // Year
    if (notEmpty(p.year)) {
      if (!selectMain) {
        bib.push(`, ${p.year}`);
      } else {
        bib.push(`, <span class="year">${p.year}</span>`);
      }
    }
  }

  let remainder = bib.join("");
  if (remainder.startsWith(",") || remainder.startsWith("."))
    remainder = remainder.slice(1);
  remainder = remainder.trim();

  const result = {
    authors: detexify(authors, false),
    title: detexify(p.title, false),
    remainder: detexify(remainder, false),
  };

  return result;
}

export const pmidToBibtex = async (pmid: string): Promise<string> => {
  const result = await axios.get(
    `https://www.bioinformatics.org/texmed/cgi-bin/list.cgi?PMID=${pmid}&linkOut`
  );
  return result.data;
};
