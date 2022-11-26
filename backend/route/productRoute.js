const { getAllProducts ,createProduct,deleteProduct,getSingleProducts,updateProduct, getP, createAndUpdateReview, deleteReview} = require('../controller/productController');

const express = require('express');

const router = express.Router();
const {isAuthenticated , authorsizeRole} = require('../middleware/auth')

router.route('/products').get(getAllProducts );
router.route('/product/:id').get(getSingleProducts).delete(isAuthenticated , authorsizeRole('admin'), deleteProduct ).put(isAuthenticated ,authorsizeRole('admin'), updateProduct)
router.route('/product/new').post(isAuthenticated , authorsizeRole('admin'), createProduct);
router.route('/review').put(isAuthenticated , createAndUpdateReview)
router.route('/review/delete/:id').all(isAuthenticated,deleteReview)
module.exports = router;