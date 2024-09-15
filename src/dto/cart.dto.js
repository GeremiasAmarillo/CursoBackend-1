class CartDTO {
    constructor(products) {
        this.products = products.map(product => ({
            productId: product.product,
            quantity: product.quantity
        }));
    }
}

export default CartDTO; 