export const generateSlug = (str: string) => {
  const slug = str
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  return slug;
};
