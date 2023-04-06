const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

async function removeExpiredProducts() {
    try {
        // Find all products that are expired
        const expiredProducts = await Product.find(
            { expiryDate: { $lte: new Date() } },
            null,
            { timeout: 30000 } // increase timeout to 30 seconds
        );

        // Remove expired products and their associated product quantities
        for (const product of expiredProducts) {
            await ProductQuantity.deleteMany({ product: product._id }); // delete associated product quantities
            await product.remove(); // remove product
        }

        console.log(`Removed ${expiredProducts.length} expired products and their associated product quantities`);
    } catch (error) {
        console.error(`Error removing expired products and their associated product quantities: ${error}`);
    }
}

// Call the function
removeExpiredProducts();
