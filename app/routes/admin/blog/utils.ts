import { listBlogCategories } from "~/lib/cms/blogCategories";
import type { BlogCategory } from "~/lib/types";

export const getBlogCategoryOptions = async (): Promise<BlogCategory[]> => {
  try {
    return await listBlogCategories();
  } catch {
    return [];
  }
};
