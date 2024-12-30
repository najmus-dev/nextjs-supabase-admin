interface PaginationRange {
  from: number;
  to: number;
}

type Profile = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

type BusinessCategory = {
  id: string;
  name: string;
  is_featured: boolean;
  createdAt: Date;
  subCategories?: BusinessSubCategory[];
};

type BusinessSubCategory = {
  id: string;
  name: string;
  createdAt: Date;
};

type PostCategory = {
  id: string;
  name: string;
  createdAt: Date;
};
