var orderList = [];
    var totalAmount = 0;

    function addToOrder(foodName, price) {
        orderList.push({ name: foodName, price: price });
        totalAmount += price;

        // Update the order details on the page
        updateOrderDetails();
    }

    function updateOrderDetails() {
        var orderListElement = document.getElementById('orderList');
        var totalAmountElement = document.getElementById('totalAmount');

        // Clear previous content
        orderListElement.innerHTML = '';

        // Populate the order list
        orderList.forEach(function (item) {
            var listItem = document.createElement('li');
            listItem.textContent = item.name + ' - $' + item.price.toFixed(2);
            orderListElement.appendChild(listItem);
        });

        // Update the total amount
        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    function placeOrder() {
        // Implement the logic to place the order, e.g., send a request to the server
        alert('Order placed! Total amount: $' + totalAmount.toFixed(2));

        // Reset order details after placing the order
        orderList = [];
        totalAmount = 0;
        updateOrderDetails();
    }