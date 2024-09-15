import ProductManager from '../dao/db/product-manager-db.js';
import ProductDTO from '../dto/product.dto.js';

class ProductRepository {


    async getProducts(queryParams) {
        const productsData = await ProductManager.getProducts(queryParams);
        return productsData.docs.map(product => new ProductDTO(
            product.title,
            product.description,
            product.price,
            product.code,
            product.status,
            product.stock,
            product.category,
            product.thumbnails
        ));
    }

    async getProductById(id) {
        const product = await ProductManager.getProductById(id);
        return product ? new ProductDTO(
            product.title,
            product.description,
            product.price,
            product.code,
            product.status,
            product.stock,
            product.category,
            product.thumbnails
        ) : null;
    }

    async addProduct(productData) {
        const productDTO = new ProductDTO(
            productData.title,
            productData.description,
            productData.price,
            productData.code,
            productData.status,
            productData.stock,
            productData.category,
            productData.thumbnails
        );
        return await ProductManager.addProduct(productDTO);
    }

    async updateProduct(id, updatedFields) {
        return await ProductManager.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await ProductManager.deleteProduct(id);
    }
}

export default new ProductRepository;
