const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

async function removeExpiredProducts() {
    try {
        // Find all products that are expired
        const expiredProducts = await Product.find({ expiryDate: { $lte: new Date() } });

        // Remove expired products and their corresponding product quantities
        for (const product of expiredProducts) {
            const { deletedCount } = await ProductQuantity.deleteMany({ product: product._id });
            console.log(`Removed ${deletedCount} product quantity records for product ${product.name} (ID: ${product._id})`);
            await product.remove();
            console.log(`Removed expired product ${product.name} (ID: ${product._id})`);
        }

        console.log(`Removed ${expiredProducts.length} expired products`);
    } catch (error) {
        console.error(`Error removing expired products: ${error}`);
    }
}

// Call the function
removeExpiredProducts();
