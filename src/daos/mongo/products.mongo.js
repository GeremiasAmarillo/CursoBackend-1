import { productModel } from "./models/products.models.js";

export const getProducts = async ({
  limit = 10,
  page = 1,
  sort,
  query,
} = {}) => {
  page = page == 0 ? 1 : page;
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;
  const sortOrderOptions = {
    asc: 1,
    desc: -1,
  };
  sort = sortOrderOptions[sort] || null;

  try {
    if (query) {
      query = JSON.parse(decodeURIComponent(query));
    }
  } catch (error) {
    console.log("Error al parsear:", error);
    query = {};
  }

  const queryProducts = productModel.find(query).limit(limit).skip(skip).lean();
  if (sort !== null) {
    queryProducts.sort({ price: sort });
  }
  const [productos, totalDocs] = await Promise.all([
    queryProducts,
    productModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;

  return {
    totalDocs,
    totalPages,
    limit,
    query: JSON.stringify(query),
    page,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    payload: productos,
    prevLink: hasPrevPage
      ? `/api/products?limit=${limit}&page=${prevPage}`
      : null,
    nextLink: hasNextPage
      ? `/api/products?limit=${limit}&page=${nextPage}`
      : null,
  };
};

export const getProductsById = async (pid) => {
  return await productModel.findById(pid);
};

export const addProduct = async (body) => {
  return await productModel.create({ ...body });
};

export const updateProduct = async (pid, rest) => {
  return await productModel.findByIdAndUpdate(pid, { ...rest }, { new: true });
};

export const deleteProduct = async (pid) => {
  return await productModel.findByIdAndDelete(pid);
};
