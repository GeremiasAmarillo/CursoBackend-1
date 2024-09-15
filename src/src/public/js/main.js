const socket = io();
let currentPage = 1;

function requestProductsPage(page) {
    currentPage = page;
    socket.emit('requestProductsPage', page);
}

socket.on("products", (data, totalPages, page) => {
    renderProducts(data);
    updatePagination(totalPages, page);
});

socket.on('paginatedProducts', (data, totalPages, page) => {
    renderProducts(data);
    updatePagination(totalPages, page);
});

function updatePagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = `
        <button class="btn btn-secondary me-2" onclick="requestProductsPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        Página ${currentPage} de ${totalPages}
        <button class="btn btn-secondary ms-2" onclick="requestProductsPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;
}

function updatePaginationworking(totalPages, currentPage) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = `
        ${currentPage > 1 ? `<button class="btn btn-secondary" onclick="requestProductsPage(${currentPage - 1})">Anterior</button>` : ''}
        Página ${currentPage} de ${totalPages}
        ${currentPage < totalPages ? `<button class="btn btn-secondary" onclick="requestProductsPage(${currentPage + 1})">Siguiente</button>` : ''}
    `;
}

function renderProducts(products) {
    
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = `
        <div class="card cool-card col-sm-6 col-md-3 col-lg-2 mb-4 mx-2 shadow-sm p-0">
            <img class="card-img-top img-fluid p-0" src="${product.thumbnails[0]}" alt="${product.title}" onerror="this.src='images/default-image.jpg'">
            <div class="card-body">
                <h5 class="card-title text-nowrap text-truncate">${product.title}</h5>
                <p class="card-text text-nowrap text-truncate">${product.description}</p>
                <p class="card-text text-nowrap text-truncate">Precio: $${product.price}</p>
                <p class="card-text text-nowrap text-truncate">Código: ${product.code}</p>
                <p class="card-text text-nowrap text-truncate">Stock: ${product.stock}</p>
                <p class="card-text text-nowrap text-truncate">Categoría: ${product.category}</p>
                <p class="card-text text-nowrap text-truncate">Estado: ${product.status ? 'Activo' : 'Inactivo'}</p>    
                <div class="text-center mt-auto">
                    <button class="btn btn-danger btn-md" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>
            </div>
        </div>
      `;
        productsContainer.innerHTML += productCard;
    });
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

document.getElementById("add-product-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const product = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        code: formData.get("code"),
        stock: formData.get("stock"),
        category: formData.get("category"),
        thumbnails: formData.get("thumbnails"),
        status: formData.get("status") === "true" ? true : false,
    };

    socket.emit("addProduct", product);
    event.target.reset();
});