const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

async function removeExpiredProducts() {
    try {
        // Find all products that are expired
        const expiredProducts = await Product.find({
            expiryDate: { $lte: new Date() },
        });

        // Find all product quantities associated with the expired products
        const expiredProductQuantities = await ProductQuantity.find({
            product: { $in: expiredProducts.map((p) => p._id) },
        });

        // Remove the product quantities
        for (const productQuantity of expiredProductQuantities) {
            await productQuantity.remove();
        }

        // Remove the expired products
        for (const product of expiredProducts) {
            await product.remove();
        }

        console.log(`Removed ${expiredProducts.length} expired products and ${expiredProductQuantities.length} product quantities`);
    } catch (error) {
        console.error(`Error removing expired products: ${error}`);
    }
}

// Call the function
removeExpiredProducts();
