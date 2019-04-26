/*
 * jQuery Simple Shopping Cart v0.1
 * Basis shopping cart using javascript/Jquery.
 *
 * Authour : Sirisha
 */


/* '(function(){})();' this function is used, to make all variables of the plugin Private */

(function ($, window, document, undefined) {

    /* Default Options */
    let defaults = {
        cart: [],
        addtoCartClass: '.sc-add-to-cart',
        removeFromCartClass: '.sc-remove-from-cart',
        checkoutClass: '.sc-checkout',
        cartProductListClass: '.cart-products-list',
        totalCartCountClass: '.total-cart-count',
        totalCartCostClass: '.total-cart-cost',
        showcartID : '#show-cart',
        itemCountClass : '.item-count'
    };

    function Item(itemid, name, price, count) {
        this.itemid = itemid;
        this.name = name;
        this.price = price;
        this.count = count;
    }
    /*Constructor function*/
    function simpleCart(domEle, options) {

        /* Merge user settings with default, recursively */
        this.options = $.extend(true, {}, defaults, options);
        //Cart array
        this.cart = [];
        //Dom Element
        this.cart_ele = $(domEle);
        //Initial init function
        this.init();
    }


    /*plugin functions */
    $.extend(simpleCart.prototype, {
        init: function () {
            console.log("1");
            this._setupCart();
            console.log("2");
            this._setEvents();
            console.log("3");
            this._loadCart();
            console.log("4");
            this._updateCartDetails();
            console.log("5");
        },
        _setupCart: function () {
            this.cart_ele.addClass("cart-grid panel panel-defaults");
            this.cart_ele.append("<div class='panel-heading cart-heading'><div class='total-cart-count'>Your Cart 0 items</div><div class='spacer'></div><i class='fa fa-dollar total-cart-cost'>0</i><div></div></div>")
            this.cart_ele.append("<div class='panel-body cart-body'><div class='cart-products-list' id='show-cart'><!-- Dynamic Code from Script comes here--></div></div>")
            this.cart_ele.append("<div class='cart-summary-container'>\n\
                                <div class='cart-offer'></div>\n\
                                        <div class='cart-total-amount'>\n\
                                            <div>Total</div>\n\
                                            <div class='spacer'></div>\n\
                                            <div><i class='fa fa-dollar total-cart-cost'>0</i></div>\n\
                                            </div>\n\
                                            <div class='cart-checkout'>\n\
                                            <form action='#'>\n\
                                                <textarea></textarea>\n\
                                                <button type='submit' class='btn btn-primary sc-checkout'>Proceed To Checkout</button>\n\
                                            </form>\n\
                                        </div>\n\
                                 </div>");
        },
        _addProductstoCart: function () {
        },
        _updateCartDetails: function () {
            let mi = this;
            $(this.options.cartProductListClass).html(mi._displayCart());
            $(this.options.totalCartCountClass).html("Your Cart " + mi._totalCartCount() + " items");
            $(this.options.totalCartCostClass).html(mi._totalCartCost());
        },
        _setCartbuttons: function () {

        },
        _setEvents: function () {
            let mi = this;

            $(".panel-body .row").on("click", this.options.addtoCartClass,function (e) {
                e.preventDefault();
                let itemid = $(this).attr("data-id");
                let name = $(this).attr("data-name");
                let cost = Number($(this).attr("data-price"));
                mi._addItemToCart(itemid, name, cost, 1);
                mi._updateCartDetails();
            });

            $(this.options.checkoutClass).on("click", function (e) {
                e.preventDefault();
            });

            $(this.options.addtoCartClass).on("click", function (e) {
                e.preventDefault();
                let itemid = $(this).attr("data-id");
                let name = $(this).attr("data-name");
                let cost = Number($(this).attr("data-price"));
                mi._addItemToCart(itemid, name, cost, 1);
                mi._updateCartDetails();
            });

            $(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {
                let ci = this;
                e.preventDefault();
                let count = $(this).val();
                let itemid = $(this).attr("data-id");
                let name = $(this).attr("data-name");
                let cost = Number($(this).attr("data-price"));
                mi._removeItemfromCart(itemid, name, cost, count);
                mi._updateCartDetails();
            });

            $(this.options.showcartID).on("click", this.options.removeFromCartClass,function (e) {
                let ci = this;
                e.preventDefault();
                let count = 0;
                let itemid = $(this).attr("data-id");
                let name = $(this).attr("data-name");
                let cost = Number($(this).attr("data-price"));
                mi._removeItemfromCart(itemid, name, cost, count);
                mi._updateCartDetails();
            });
        },
        /* Helper Functions */
        _addItemToCart: function (itemid, name, price, count) {
            for (let i in this.cart) {
                console.log(this.cart[i]);
                if (this.cart[i].itemid == itemid) {
                    this.cart[i].count++;
                    this.cart[i].price = price * this.cart[i].count;
                    this._saveCart();
                    return;
                }
            }
            let item = new Item(itemid, name, price, count);
            this.cart.push(item);
            this._saveCart();
        },
        _removeItemfromCart: function (itemid, price, count) {
            for (let i in this.cart) {
                if (this.cart[i].itemid === itemid) {
                    let singleItemCost = Number(price / this.cart[i].count);
                    this.cart[i].count = count;
                    this.cart[i].price = singleItemCost * count;
                    if (count == 0) {
                        this.cart.splice(i, 1);
                    }
                    break;
                }
            }
            this._saveCart();
        },
        _clearCart: function () {
            this.cart = [];
            this._saveCart();
        },
        _totalCartCount: function () {
            return this.cart.length;
        },
        _displayCart: function () {
            let cartArray = this._listCart();
            //console.log(cartArray);
            let output = "";
            if (cartArray.length <= 0) {
                output = "<h4>Your cart is empty</h4>";
            }
            for (let i in cartArray) {
                //console.log(cartArray[i]);
                let dataId = (cartArray[i].itemid) ? cartArray[i].itemid : 0;

                output += "<div class='cart-each-product'>\n\
                       <div class='name'>" + cartArray[i].name + "</div>\n\
                       <div class='quantityContainer'>\n\
                            <input type='number' class='quantity form-control item-count' data-name='" + cartArray[i].name + "' data-price='" + cartArray[i].price + "' data-id='" + dataId + "' min='0' value=" + cartArray[i].count + " name='number'>\n\
                       </div>\n\
                       <div class='quantity-am'><i class='fa fa-dollar'>" + cartArray[i].price + "</i></div>\n\
                       </div>\n\
                       <div class='add-button'>\n\
                            <button class='btn btn-primary sc-remove-from-cart' data-name='" + cartArray[i].name + "' data-price='" + cartArray[i].price + "type='submit'>x</button>\n\
                       </div>";
            }
            return output;
        },
        _totalCartCost: function () {
            let totalCost = 0;
            for (let i in this.cart) {
                totalCost += this.cart[i].price;
            }
            return totalCost;
        },
        _listCart: function () {
            let cartCopy = [];
            for (let i in this.cart) {
                let item = this.cart[i];
                let itemCopy = {};
                for (let p in item) {
                    itemCopy[p] = item[p];
                }
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        },
        _calGST: function () {
            let GSTPercent = 18;
            let totalcost = this.totalCartCost();
            let calGST = Number((totalcost * GSTPercent) / 100);
            return calGST;
        },
        _saveCart: function () {
            localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
        },
        _loadCart: function () {
            this.cart = JSON.parse(localStorage.getItem("shoppingCart"));
            if (this.cart === null) {
                this.cart = [];
            }
        }
    });
    /* Defining the Structure of the plugin 'simpleCart'*/
    $.fn.simpleCart = function (options) {
        return this.each(function () {
            $.data(this, "simpleCart", new simpleCart(this));
            //console.log($(this, "simpleCart"));
        });
    }
    ;
})(jQuery, window, document);


