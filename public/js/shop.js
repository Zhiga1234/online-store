const products = [
    {id: 0, src: "product1.png", name: "Cardigan", price: 10, discountPrice: 7,cartStatus:false,count:0},
    {id: 1, src: "product2.png", name: "Hat", price: 15,cartStatus:false,count:0},
    {id: 2, src: "product3.png", name: "Jeans", price: 20, discountPrice: 15,cartStatus:false,count:0},
    {id: 3, src: "product4.png", name: "Bag", price: 25, discountPrice: 10,cartStatus:false,count:0},
    {id: 4, src: "product5.png", name: "Windbreaker", price: 30,cartStatus:false,count:0},

    {id: 5, src: "product6.png", name: "Sweater", price: 40,cartStatus:false,count:0},
 
    {id: 6, src: "product7.png", name: "Shirt", price: 25, discountPrice: 20,cartStatus:false,count:0},

    {id: 7, src: "product8.png", name: "T-shirt", price: 30, discountPrice: 20,cartStatus:false,count:0},
    {id: 8, src: "1.PNG", name: "T-shirt", price: 15, discountPrice: 10,cartStatus:false,count:0},
    {id: 9, src: "2.PNG", name: "T-shirt", price: 20, discountPrice: 10,cartStatus:false,count:0},
    {id: 10, src: "3.PNG", name: "T-shirt", price: 47, discountPrice: 40,cartStatus:false,count:0},
    {id: 11, src: "4.PNG", name: "T-shirt", price: 10, discountPrice: 5,cartStatus:false,count:0},
    {id: 12, src: "5.PNG", name: "T-shirt", price: 40, discountPrice: 20,cartStatus:false,count:0},
    {id: 13, src: "6.PNG", name: "T-shirt", price: 78, discountPrice: 50,cartStatus:false,count:0},
    {id: 14, src: "7.PNG", name: "T-shirt", price: 27, discountPrice: 15,cartStatus:false,count:0},
    {id: 15, src: "8.PNG", name: "T-shirt", price: 30, discountPrice: 20,cartStatus:false,count:0},

    
];
let cart = [];

function isTimerEnded() {
    const now = new Date().getTime();
    const targetDate = new Date("2023-11-22T11:08:00").getTime();
    return now >= targetDate;
}

document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
    displayProducts();
});

function loadCartItems() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);

        cart.forEach(cartProduct => {
            const product = products.find(p => p.id === cartProduct.id);
            if (product) {
                product.cartStatus = true;
            }
        });
    } else {
        cart = [];
    }
}

function displayProducts() {
    const productContainer = document.getElementById('product-container');
    let currentRow;

    products.forEach((product, index) => {
        if (index % 4 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row mb-3 justify-content-center product-row';
            productContainer.appendChild(currentRow);
        }

        const productCol = document.createElement('div');
        productCol.className = 'col-md-6 col-lg-3 text-center product-col';
        productCol.id = `product-col-${product.id}`;

        productCol.innerHTML = `
            <a href="#" onclick="openModal('${product.src}', '${product.name}'); return false;">
                <img src="${product.src}" alt="${product.name}" class="img-fluid" style="max-width: 100%; max-height: 200px;">
            </a>
            <h4>${product.name}</h4>
            <p>
                ${product.price} $
            </p>
            <button type="button" class="btn btn-info" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        currentRow.appendChild(productCol);
    });
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.count += 1;
        product.cartStatus = true;

        const existingProductIndex = cart.findIndex(p => p.id === productId);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex] = product;
        } else {
            cart.push(product);
        }

        updateLocalStorage();
        displayCartProducts();
    }
}




function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}



function filterProducts() {
    const priceFilter = document.getElementById('priceFilter').value;

   
    if (priceFilter === 'sale') {
       
        const filteredProducts = products.filter(product => product.discountPrice !== undefined);
        
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
        displayFilteredProducts(filteredProducts);
    } else if (priceFilter === 'low') {
       
        products.sort((a, b) => ((a.discountPrice|| a.price) - (b.discountPrice|| b.price)));
       
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
        displayProducts();
    } else if (priceFilter === 'high') {
        
        products.sort((a, b) => ((b.discountPrice|| b.price) - (a.discountPrice|| b.price)));
        
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
        displayProducts();
    } else if (priceFilter === 'all') {
        
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
        displayProducts();
    }
}

function displayFilteredProducts(filteredProducts) {
    const productContainer = document.getElementById('product-container');
    let currentRow;

    filteredProducts.forEach((product, index) => {
        if (index % 4 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row mb-3 justify-content-center product-row';
            productContainer.appendChild(currentRow);
        }

        const productCol = document.createElement('div');
        productCol.className = 'col-md-6 col-lg-3 text-center product-col';
        productCol.id = `product-col-${product.id}`;
        const isDiscountActive = !isTimerEnded();
        const priceToDisplay = isDiscountActive && product.discountPrice !== undefined ? product.discountPrice : product.price;

        
        const cartProduct = cart.find(p => p.id === product.id);
        if (cartProduct) {
            product.count = cartProduct.count;
        }

        productCol.innerHTML = `
            <img src="${product.src}" alt="${product.name}" class="img-fluid" style="max-width: 100%; max-height: 200px;">
            <h4>${product.name}</h4>
            <p>
                ${isDiscountActive && product.discountPrice !== undefined ? `<strike>${product.price} $</strike>` : ''}
                ${priceToDisplay} $
            </p>
            <button type="button" class="btn btn-info btn-font-weight-bold" onclick="addToCart(${product.id})">Add to Cart</button> 
            
        `;
        currentRow.appendChild(productCol);
    });
}
