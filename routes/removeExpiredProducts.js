const { Product } = require('../models/product');
const { ProductQuantity } = require('../models/productQuantity');

async function removeExpiredProducts() {
    try {
        // Find all products that are expired
        const expiredProducts = await Product.find({
            expiryDate: { $lte: new Date() }
        });

        if (expiredProducts.length === 0) {
            console.log('No expired products found');
            return;
        }

        // Remove expired products and associated product quantities
        for (const product of expiredProducts) {
            const productQuantities = await ProductQuantity.find({ product: product._id });

            for (const productQuantity of productQuantities) {
                await ProductHistory.create({
                    product: productQuantity.product,
                    user: productQuantity.user,
                    quantity: productQuantity.quantity,
                    action: 'remove'
                });
            }

            await ProductQuantity.deleteMany({ product: product._id });
            await product.remove();
        }

        console.log(`Removed ${expiredProducts.length} expired products and their associated product quantities`);
    } catch (error) {
        console.error(`Error removing expired products and their associated product quantities: ${error}`);
    }
}


// Call the function
removeExpiredProducts();
