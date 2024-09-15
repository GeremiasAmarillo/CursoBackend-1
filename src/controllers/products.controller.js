import ProductService from '../services/products.service.js';

class ProductController {

    async getProducts(req, res) {
        const { limit = 10, page = 1, sort, category, availability } = req.query;
        try {
            const products = await ProductService.getProducts({ limit, page, sort, category, availability });
            res.json({
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&category=${category}&availability=${availability}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&category=${category}&availability=${availability}` : null
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await ProductService.addProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al agregar producto:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(updatedProduct);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.pid);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(deletedProduct);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductController;
