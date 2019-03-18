// Create crossfilter of our data

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
// supermarketItems 為一個 crossfilter 物件
// console.log(supermarketItems);


// First Dimension

// group_by(category)
let dimensionCategory = supermarketItems.dimension(item => item.category)
// summarise(n = sum(quantity))
let quantityByCategory = dimensionCategory.group().reduceSum(item => item.quantity)

// Beware, javascript will retromodify firstResult 
// (javascript loves saving things by parameters), 
// you must comment the filter to look at this result etc etc...
const firstResult = quantityByCategory.all()
console.log("First result:")
console.log(firstResult)
// group_by(category)
// summarise(n = sum(quantity))
// [{key: "fruit", value: 21},{key: "vegetable", value: 25}]


// How to filter

// filter(country == "Martinique")
let dimensionCountry = supermarketItems.dimension(item => item.country)
// dimensionCountry.filter("Martinique")
dimensionCountry.filter("Spain")
// console.log(dimensionCountry.filter("Martinique"));

const filteredResult = quantityByCategory.all()
console.log("Second result with filter:")
console.log(filteredResult)
// [{key: "fruit", value: 12},{key: "vegetable", value: 0}]

// Remove filter

dimensionCountry.filter(null)
const filterRemovedResult = quantityByCategory.all()
console.log("Third result filter removed:")
console.log(filterRemovedResult)

// // Tips and Tricks

// // 1: Separate value on distinct conditions
// let dimensionCountryAndCategory = supermarketItems.dimension(item => item.country + '_' + item.category)
// let quantityByCountryAndCategory = dimensionCountryAndCategory.group().reduceSum(item => item.quantity)

// const differentCategoriesResult = quantityByCountryAndCategory.all()
// console.log("Result 4 with 2 categories:")
// console.log(differentCategoriesResult)

// //2: Overall sum
// let dimensionTotal = supermarketItems.dimension(item => "total")
// let totalQuantity = dimensionTotal.group().reduceSum(item => item.quantity)

// const overallQuantity = totalQuantity.all()
// console.log("Result 5: total quantity")
// console.log(overallQuantity)

// //3: get a ratio instead of a sum
// let outOfDateQuantityByCategory = dimensionCategory.group().reduceSum(item => item.outOfDateQuantity)

// const ratioGoodOnOutOfDate = outOfDateQuantityByCategory.all().map((item, index) => {
// 	let ratio = {}
//   ratio.key = item.key
//   ratio.value = quantityByCategory.all()[index].value / item.value
//   return ratio
// })
// console.log("Result 6: ratio good on out of date")
// console.log(ratioGoodOnOutOfDate)