let supermarketItems = crossfilter([{
        name: "banana",
        category: "fruit",
        country: "Martinique",
        outOfDateQuantity: 3,
        quantity: 12
    },
    {
        name: "apple",
        category: "fruit",
        country: "Spain",
        outOfDateQuantity: 7,
        quantity: 9
    },
    {
        name: "tomato",
        category: "vegetable",
        country: "Spain",
        outOfDateQuantity: 2,
        quantity: 25
    }
])

// let dimensionCategory = supermarketItems.dimension(item => item.category)
//     .group()
//     .reduceSum(item => item.quantity)
//     .all()
// console.log(dimensionCategory);

// let out1 = supermarketItems.dimension(item => item.category)
//     .group()
//     .reduceSum(item => item.quantity)
//     .all()

// console.log(out1);

let dimensionCategory = supermarketItems.dimension(item => item.category)
let quantityByCategory = dimensionCategory.group().reduceSum(item => item.quantity)
console.log(1);
const Result1 = quantityByCategory.all()
console.log(Result1);

// let dimensionCountry = supermarketItems.dimension(item => item.country)
// dimensionCountry.filter("Spain")
// console.log(2);
// const Result2 = quantityByCategory.all()
// console.log(Result2);