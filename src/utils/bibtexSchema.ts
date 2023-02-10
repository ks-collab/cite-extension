import { OrganizationSchema } from "models/api/response.types";

export type EntryName =
  | "article"
  | "book"
  | "booklet"
  | "inproceedings"
  | "conference"
  | "inbook"
  | "incollection"
  | "manual"
  | "mastersthesis"
  | "misc"
  | "phdthesis"
  | "proceedings"
  | "techreport"
  | "unpublished";

interface Entry {
  label: string;
  description: string;
  required: string[];
  optional: string[];
}

export interface SchemaData {
  label: string;
  name: string;
  type: string;
  default: boolean;
  description: string;
}

export const entryTypes: Record<EntryName, Entry> = {
  article: {
    label: "Article",
    description: "An article from a journal or magazine",
    required: ["author", "title", "journal", "year"],
    optional: ["volume", "number", "pages", "month", "note"],
  },
  book: {
    label: "Book",
    description: "A book with an explicit publisher",
    required: ["author", "editor", "title", "publisher", "year"],
    optional: [
      "volume",
      "number",
      "series",
      "address",
      "edition",
      "month",
      "note",
    ],
  },
  booklet: {
    label: "Booklet",
    description:
      "A work that is printed and bound, but without a named publisher or sponsoring institution",
    required: ["title"],
    optional: ["author", "howpublished", "address", "month", "year", "note"],
  },
  inproceedings: {
    label: "Inproceedings",
    description: "An article in a conference proceedings",
    required: ["author", "title", "booktitle", "year"],
    optional: [
      "editor",
      "volume",
      "number",
      "series",
      "pages",
      "address",
      "month",
      "organization",
      "publisher",
      "note",
    ],
  },
  conference: {
    label: "Conference",
    description: "The same as INPROCEEDINGS",
    required: ["author", "title", "booktitle", "year"],
    optional: [
      "editor",
      "volume",
      "number",
      "series",
      "pages",
      "address",
      "month",
      "organization",
      "publisher",
      "note",
    ],
  },
  inbook: {
    label: "Inbook",
    description:
      "A part of a book, which may be a chapter (or section or whatever) and/or a range of pages",
    required: [
      "author",
      "editor",
      "title",
      "chapter",
      "pages",
      "publisher",
      "year",
    ],
    optional: [
      "volume",
      "number",
      "series",
      "type",
      "address",
      "edition",
      "month",
      "note",
    ],
  },
  incollection: {
    label: "Incollection",
    description: "A part of a book having its own title",
    required: ["author", "title", "booktitle", "publisher", "year"],
    optional: [
      "editor",
      "volume",
      "number",
      "series",
      "type",
      "chapter",
      "pages",
      "address",
      "edition",
      "month",
      "note",
    ],
  },
  manual: {
    label: "Manual",
    description: "Technical documentation",
    required: ["title"],
    optional: [
      "author",
      "organization",
      "address",
      "edition",
      "month",
      "year",
      "note",
    ],
  },
  mastersthesis: {
    label: "Mastersthesis",
    description: "A Master's thesis",
    required: ["author", "title", "school", "year"],
    optional: ["type", "address", "month", "note"],
  },
  misc: {
    label: "Misc",
    description: "Use this type when nothing else fits",
    required: [],
    optional: ["type", "address", "month", "note"],
  },
  phdthesis: {
    label: "Phdthesis",
    description: "A PhD thesis",
    required: ["author", "title", "school", "year"],
    optional: ["type", "address", "month", "note"],
  },
  proceedings: {
    label: "Proceedings",
    description: "The proceedings of a conference",
    required: ["title", "year"],
    optional: [
      "editor",
      "volume",
      "number",
      "series",
      "address",
      "month",
      "organization",
      "publisher",
      "note",
    ],
  },
  techreport: {
    label: "Techreport",
    description:
      "A report published by a school or other institution, usually numbered within a series",
    required: ["author", "title", "institution", "year"],
    optional: ["type", "number", "address", "month", "note"],
  },
  unpublished: {
    label: "Unpublished",
    description:
      "A reference having an author and title, but not formally published",
    required: ["author", "title", "note"],
    optional: ["month", "year"],
  },
};

export const defaultOrganizationSchema: SchemaData[] = [
  {
    label: "Entry-type",
    name: "entrytype",
    type: "entrytype",
    default: true,
    description: "entry type",
  },
  {
    label: "Cite-key",
    name: "citekey",
    type: "text",
    default: true,
    description: "BibTeX citekey",
  },
  {
    label: "Title",
    name: "title",
    type: "text",
    default: true,
    description: "title of the work",
  },
  {
    label: "Booktitle",
    name: "booktitle",
    type: "text",
    default: true,
    description: "title of the book",
  },
  {
    label: "Authors",
    name: "author",
    type: "list",
    default: true,
    description: "list of authors of the work",
  },
  {
    label: "Journal",
    name: "journal",
    type: "text",
    default: true,
    description: "name of the journal or magazine the article was published in",
  },
  {
    label: "Year",
    name: "year",
    type: "text",
    default: true,
    description: "year the work was published",
  },
  {
    label: "Month",
    name: "month",
    type: "text",
    default: true,
    description: "the month during the work was published",
  },
  {
    label: "Series",
    name: "series",
    type: "text",
    default: true,
    description: "name of the series or set of books",
  },
  {
    label: "Volume",
    name: "volume",
    type: "text",
    default: true,
    description: "volume number",
  },
  {
    label: "Number",
    name: "number",
    type: "text",
    default: true,
    description:
      "number of the report or the issue number for a journal article",
  },
  {
    label: "Edition",
    name: "edition",
    type: "text",
    default: true,
    description: "edition number of a book",
  },
  {
    label: "Pages",
    name: "pages",
    type: "text",
    default: true,
    description: "page numbers or a page range",
  },
  {
    label: "Chapter",
    name: "chapter",
    type: "text",
    default: true,
    description: "number of a chapter in a book",
  },
  {
    label: "Annotation",
    name: "annote",
    type: "text",
    default: true,
    description: "an annotation",
  },
  {
    label: "Editor",
    name: "editor",
    type: "text",
    default: true,
    description: "list of editors of a book",
  },
  {
    label: "Institution",
    name: "institution",
    type: "text",
    default: true,
    description:
      "name of the institution that published and/or sponsored the report",
  },
  {
    label: "DOI",
    name: "doi",
    type: "text",
    default: true,
    description: "DOI number (like 10.1038/d41586-018-07848-2)",
  },
  {
    label: "ISBN",
    name: "isbn",
    type: "text",
    default: true,
    description: "ISBN number (like 9780201896831)",
  },
  {
    label: "ISSN",
    name: "issn",
    type: "text",
    default: true,
    description: "ISSN number (like 1476-4687)",
  },
  {
    label: "URL",
    name: "url",
    type: "text",
    default: true,
    description: "URL of a web page",
  },
  {
    label: "Note",
    name: "note",
    type: "text",
    default: true,
    description: "notes about the reference",
  },
  {
    label: "Publisher",
    name: "publisher",
    type: "text",
    default: true,
    description: "name of the publisher",
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    default: true,
    description: "address of the publisher or the institution",
  },
  {
    label: "Organization",
    name: "organization",
    type: "text",
    default: true,
    description:
      "name of the institution that organized or sponsored the conference or that published the manual",
  },
  {
    label: "School",
    name: "school",
    type: "text",
    default: true,
    description: "name of the university or degree awarding institution",
  },
  {
    label: "Type",
    name: "type",
    type: "text",
    default: true,
    description: "type of the technical report or thesis",
  },
  {
    label: "Publication note",
    name: "howpublished",
    type: "text",
    default: true,
    description: "a publication notice for unusual publications",
  },
];

export const getSchema = (
  name: string
): {
  label: string;
  name: string;
  type: string;
  default: boolean;
  description: string;
} => {
  const filtered = defaultOrganizationSchema.filter(
    (schema) => schema.name === name
  );
  if (filtered.length > 0) {
    return filtered[0];
  }
  return {
    name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    type: "text",
    default: false,
    description: "",
  };
};

// sort separately "required", "optional", "others"
export const sortOrder = (
  a: string,
  b: string,
  entryType?: string,
  type?: string
): number => {
  // "required", "optional" - sort according to order defined in entrytypes,
  // "others" - in defaultOrganizationSchema order
  const schemaSearch =
    entryType && type
      ? (entryTypes as any)[entryType][type]
      : defaultOrganizationSchema.map((item) => item.name);

  const aIndex = schemaSearch.findIndex(
    (schema: any) => schema.toLowerCase() === a.toLowerCase()
  );
  const bIndex = schemaSearch.findIndex(
    (schema: any) => schema.toLowerCase() === b.toLowerCase()
  );
  // both are in the list;
  if (aIndex >= 0 && bIndex >= 0) {
    return aIndex - bIndex;
  }
  if (aIndex === -1 && bIndex === -1) {
    return a.localeCompare(b);
  }
  if (bIndex === -1) {
    return -1;
  }
  if (aIndex === -1) {
    return 1;
  }
  return 0;
};

// sort full array of OrganizationSchemas
export const sortSchemaOrder = (
  array: OrganizationSchema[],
  entryType: string
): OrganizationSchema[] => {
  const entrytypeItem: OrganizationSchema = defaultOrganizationSchema[0];
  const citekeyItem: OrganizationSchema = defaultOrganizationSchema[1];
  const requiredArray: OrganizationSchema[] = [];
  const optionalArray: OrganizationSchema[] = [];
  let othersArray: OrganizationSchema[] = [];
  if (entryType in entryTypes) {
    const { required, optional } = (entryTypes as Record<string, Entry>)[
      entryType
    ];
    array.forEach((item) => {
      if (required.includes(item.name.toLowerCase())) {
        requiredArray.push(item);
      } else if (optional.includes(item.name.toLowerCase())) {
        optionalArray.push(item);
      } else if (
        item.name !== "entrytype" &&
        item.name !== "citekey" &&
        item.name !== "abstract"
      ) {
        othersArray.push(item);
      }
    });
  } else {
    othersArray = array.filter(
      (item) =>
        item.name !== "entrytype" &&
        item.name !== "citekey" &&
        item.name !== "abstract"
    );
  }
  return [
    entrytypeItem,
    ...requiredArray.sort((a, b) =>
      sortOrder(a.name, b.name, entryType, "required")
    ),
    ...optionalArray.sort((a, b) =>
      sortOrder(a.name, b.name, entryType, "optional")
    ),
    ...othersArray.sort((a, b) => sortOrder(a.name, b.name)),
    citekeyItem,
  ];
};
