import { productModel } from "../models/products.js";

export const getProductsServices = async ({
  limit = 10,
  page = 1,
  sort,
  query,
} = {}) => {
  try {
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

    const queryProducts = productModel
      .find(query)
      .limit(limit)
      .skip(skip)
      .lean();
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
  } catch (error) {
    console.log("getProductsServices -> ", error);
    throw error;
  }
};
//-------------------------------------------------------------------------------

export const getProductsByIdServices = async (pid) => {
  try {
    return await productModel.findById(pid);
  } catch (error) {
    console.log("getProductsByIdServices -> ", error);
    throw error;
  }
};
//-------------------------------------------------------------------------------

export const addProductServices = async ({
  title,
  description,
  price,
  thumbnail,
  code,
  stock,
  status,
  category,
}) => {
  try {
    return await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
  } catch (error) {
    console.log("addProductServices -> ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const updateProductServices = async (pid, rest) => {
  try {
    return await productModel.findByIdAndUpdate(
      pid,
      { ...rest },
      { new: true }
    );
  } catch (error) {
    console.log("updateProductServices -> ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const deleteProductServices = async (pid) => {
  try {
    return await productModel.findByIdAndDelete(pid);
  } catch (error) {
    console.log("deleteProductServices -> ", error);
    throw error;
  }
};
