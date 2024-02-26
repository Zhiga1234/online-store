let cart = [];

document.addEventListener("DOMContentLoaded", function() {
    loadCartItems();
    displayCartProducts(); 
});

function isTimerEnded() {
    const now = new Date().getTime();
    const targetDate = new Date("2023-11-08T13:20:00").getTime();
    return now >= targetDate;
}

function loadCartItems() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else {
        cart = [];
    }
}

function displayCartProducts() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';  
    let currentRow;
    let total = 0; 

    if(cart.length === 0) {
        const emptyCartDiv = document.createElement('div');
        emptyCartDiv.className = 'empty-cart text-center py-5';

        emptyCartDiv.innerHTML = `
            <i class="fas fa-shopping-cart fa-5x mb-3"></i>
            <h3>Your Cart is Empty</h3>
            <p class="lead">Looks like you haven't added any products yet. Start shopping!</p>
            <a href="shop.html" class="btn btn-info mt-3">Go to Shop</a>
        `; 
        productContainer.appendChild(emptyCartDiv);
        document.getElementById('cart-footer').style.display = 'none'; 

        return;
    } else {
        cart.forEach((product, index) => {
            const isDiscountActive = !isTimerEnded();
            const priceToDisplay = isDiscountActive && product.discountPrice !== undefined ? product.discountPrice : product.price;
            const productTotalPrice = product.count * priceToDisplay; 
            total += productTotalPrice;
            if (index % 4 === 0) {
                currentRow = document.createElement('div');
                currentRow.className = 'row mb-3 justify-content-center product-row';
                productContainer.appendChild(currentRow);
            }
    
            const productCol = document.createElement('div');
            productCol.className = 'col-md-6 col-lg-3 text-center product-col';
            productCol.id = `product-col-${product.id}`;
            productCol.innerHTML = `
                <img src="${product.src}" alt="${product.name}" class="img-fluid" style="max-width: 100%; max-height: 200px;">
                <h4>${product.name}</h4>
                <p>${priceToDisplay} &euro;</p>
            `;

            const countControls = document.createElement('div');
            countControls.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mb-3');

            const decreaseButton = document.createElement('button');
            decreaseButton.type = 'button';
            decreaseButton.classList.add('btn', 'btn-info', 'btn-outline');
            decreaseButton.onclick = () => removeFromCart(product.id);
            decreaseButton.innerHTML = '<i class="fas fa-minus"></i>';

            const countDisplay = document.createElement('span');
            countDisplay.textContent = product.count;

            const increaseButton = document.createElement('button');
            increaseButton.type = 'button';
            increaseButton.classList.add('btn', 'btn-info');
            increaseButton.onclick = () => addToCart(product.id);
            increaseButton.innerHTML = '<i class="fas fa-plus"></i>';

            countControls.appendChild(decreaseButton);
            countControls.appendChild(countDisplay);
            countControls.appendChild(increaseButton);

            productCol.appendChild(countControls);

            currentRow.appendChild(productCol);
        });

        document.getElementById('total-items').textContent = cart.length;
        document.getElementById('total-price').textContent = total;
        document.getElementById('cart-footer').style.display = 'block'; // Show the footer
    }
}

function addToCart(productId) {
    const product = cart.find(p => p.id === productId);
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
function removeFromCart(productId) {
    const productIndex = cart.findIndex(p => p.id === productId);
    if (productIndex > -1) {
        const product = cart[productIndex];
        if (product.count === 1) {
            product.cartStatus = false;
            cart.splice(productIndex, 1);
        } else {
            product.count -= 1;
        }
        updateLocalStorage();
        displayCartProducts();
    }
}

function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}