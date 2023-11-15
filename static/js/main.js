function addToOrder(name, price) {
    // Implement the logic to add to the order here
    // You might want to store the quantity and other details here
    // For simplicity, let's assume quantity is always 1 in this example
    fetch('/add-to-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            price: price,
            quantity: 1, // Adjust as needed
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add item to order');
        }
        // Refresh order details after adding an item
        getOrderDetails();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getOrderDetails() {
    fetch('/order-details')
    .then(response => response.json())
    .then(order => {
        // Update the HTML to display order details
        const orderDetailsElement = document.querySelector('.order-details');
        orderDetailsElement.innerHTML = '<div class="food-card">Order Details</div>';
        
        order.items.forEach(item => {
            const foodCardElement = document.createElement('div');
            foodCardElement.classList.add('food-card');
            foodCardElement.textContent = `${item.name} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            orderDetailsElement.appendChild(foodCardElement);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function placeOrder() {
    // Implement the logic to place the order
    const userName = document.getElementById('user-name').value;
    const tableNumber = document.getElementById('table-number').value;

    // You may want to include additional validation here
    
    // Send the user name and table number to the server
    fetch('/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: userName,
            tableNumber: tableNumber,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        // Optionally, you can reset the order details after placing the order
        getOrderDetails();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Fetch and display initial order details when the page loads
document.addEventListener('DOMContentLoaded', getOrderDetails);