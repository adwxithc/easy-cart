

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
            },
            {
                $match:{
                    'categoryOffers.startDate':{
                        $lte:new Date()
                    },
                    'categoryOffers.expireDate':{
                        $gte:new Date()
                    }
                }
            },
            {
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
                    productOffStartDate:{
                        $first:'$productOffer.startDate'
                    },
                    productOffEndDate:{
                        $first:'$productOffer.expireDate'
                    },
                    productOffer:{
                        $first:'$productOffer.discountPercentage'
                    }
                }
            },

        ]);


        if (result.length === 0) {
            result[0]={

                largestOffer:{discountPercentage:0,startDate:null,expireDate:null}
            }
            
        }else{

            if( !result[0].largestOffer?.discountPercentage ){


                result[0].largestOffer={discountPercentage:0,startDate:null,expireDate:null}
            }
            if(!result[0].productOffer ){
                
                
                result[0].productOffer =0
                result[0].productOffStartDate=null
                result[0].productOffEndDate=null
                
            }
        }

        return result[0]
    } catch (error) {
        
        throw error;
    }
}

async function  setEffectedDiscounts(categoryId){
    try {
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
            setEffectedDiscountsForProduct(product)
        }
    } catch (error) {
        throw error
    }

}

async function setEffectedDiscountsForProduct(product){
try {
    const offer=await findProductLargestOffer(product._id)

    if(offer){
        const currentDate=new Date()
        let effectedDiscount,effectedOfferStartDate,effectedOfferEndDate,productOffer=0,largestOffer=0;
    
        if(product.productOffer){
            
            if(product.productOffer?.startDate<=currentDate && product.productOffer?.expireDate>currentDate){
            
                productOffer=product.productOffer?.discountPercentage?product.productOffer.discountPercentage:0
            }
        }
        
        if(offer.largestOffer?.discountPercentage){
            largestOffer=offer.largestOffer?.discountPercentage
        }


        if(largestOffer>=productOffer){
                effectedDiscount=largestOffer;
                effectedOfferStartDate=offer.largestOffer.startDate
                effectedOfferEndDate=offer.largestOffer.expireDate
        }else{
            effectedDiscount=productOffer;
            effectedOfferStartDate=product.productOffer.startDate
            effectedOfferEndDate=product.productOffer.expireDate
        }
         await Product.updateOne({_id:product._id},{$set:{effectedDiscount:effectedDiscount,effectedOfferStartDate:effectedOfferStartDate,effectedOfferEndDate,effectedOfferEndDate}})

    }
} catch (error) {
    throw error
}
 

    
}

module.exports={
    findProductLargestOffer,
    setEffectedDiscounts,
    setEffectedDiscountsForProduct
}