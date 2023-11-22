

const mongoose = require('mongoose');
const Product = require('../model/productModel');
const Category=require('../model/categoryModel')


async function findProductLargestOffer(productId) {
    try {
       
        const result = await Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(productId) }
            },
            {
                $lookup: {
                    from: 'offers',
                    localField: 'offer',
                    foreignField: '_id',
                    as: 'productOffer'
                }
            },
            {
                $unwind: { path: '$productOffer', preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryDocs'
                }
            },

            {
                $unwind: { path: '$categoryDocs', preserveNullAndEmptyArrays: true }
            },
            {
                $match:{
                    'categoryDocs.status': true
                }
            },
            {
                $lookup: {
                    from: 'offers',
                    localField: 'categoryDocs.offer',
                    foreignField: '_id',
                    as: 'categoryOffers'
                }
            },
            {
                $unwind: { path: '$categoryOffers', preserveNullAndEmptyArrays: true }
            },            {
                $sort: {
                    'categoryOffers.discountPercentage': -1
                }
            },
            {
                $group: {
                    _id: null,
                    largestOffer: {
                        $first: '$categoryOffers'
                    },
                    productOffer:{
                        $first:'$productOffer.discountPercentage'
                    }
                }
            },

        ]);
        console.log('---------',result,result[0] )


        if (result.length === 0) {
            result[0]={
                productOffer :0,
                largestOffer:{discountPercentage:0}
            }
            
        }else{
            if( !result[0].largestOffer?.discountPercentage ){
                console.log(1)
                result[0].largestOffer={discountPercentage:0}
            }
            if(!result[0].productOffer ){
                console.log(2)
                 result[0].productOffer =0
            }
        }

        return result[0]
    } catch (error) {
        console.error(`Error finding product offer: ${error.message}`);
        throw error;
    }
}

async function  setEffectedDiscounts(categoryId){
    
const products = await Product.aggregate([
    {
        $match: {
            category: {
                $elemMatch: {
                    $eq: new mongoose.Types.ObjectId(categoryId)
                }
            }
        }
    },
    {
        $lookup: {
            from: 'offers',
            localField: 'offer',
            foreignField: '_id',
            as: 'productOffer'
        }
    },
    {
        $unwind: { path: '$productOffer', preserveNullAndEmptyArrays: true }
    }
]);


    for(let product of products){



        const offer=await findProductLargestOffer(product._id)
        console.log(offer)
        if(offer){
            let effectedDiscount
            if(product.productOffer?.discountPercentage && offer?.largestOffer){
             effectedDiscount=Math.max(Number(offer.largestOffer.discountPercentage),Number(product.productOffer?.discountPercentage))
            }else if(offer?.largestOffer){
                effectedDiscount=Number(offer.largestOffer.discountPercentage)
            }else if(product.productOffer?.discountPercentage){
                effectedDiscount=Number(product.productOffer?.discountPercentage)
            }else{
                effectedDiscount=0
            }

            await Product.updateOne({_id:product._id},{$set:{effectedDiscount:effectedDiscount}})
        }

    }
}



module.exports={
    findProductLargestOffer,
    setEffectedDiscounts
}