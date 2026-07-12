export type DocNavItem = {
  title: string;
  description: string;
  slug: string;
  href: string;
  group: string;
};

export type DocNavGroup = {
  group: string;
  pages: DocNavItem[];
};

export type DocHeading = {
  id: string;
  text: string;
  depth: number;
};

export type DocPage = DocNavItem & {
  content: string;
  headings: DocHeading[];
  previous?: DocNavItem;
  next?: DocNavItem;
};

export type DocSearchItem = {
  title: string;
  description: string;
  group: string;
  href: string;
  headings: string[];
  body: string;
};
