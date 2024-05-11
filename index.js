const axios = require("axios");
const fs = require("node:fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const prodLink = "https://www.fnp.com/all-cakes-lp?promo=redirectionsearch";

const headers = {
    "content-type" : "text/html"
}

const getAllData =  async(url) => {
    try {
        const response = await axios.get(url, headers)
        // console.log(response.data);
        fs.writeFileSync("webdata.txt", response.data)
    } 
    catch(err) {
        console.log("error_happened",err);
    }
} 

// getAllData(prodLink)


const readFileData = () => {
    return fs.readFileSync("webdata.txt", {encoding: "utf-8"})
}

const callReadData = readFileData()
// console.log(callReadData);
const $ = cheerio.load(callReadData);  
const data = $(".jss18").find(".products")

let products = [];

data.each((index, prod)=> {
    products.push (
         {
         name : $(prod).find(".product-card_product-title__32LFp").text(),
         rating : $(prod).find(".product-card_rating-sec__34VZH").text(),
         price: $(prod).find("[data-testid='price']").text()
        }
    )
})

// console.log(typeof products);

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(products);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "products.xlsx");



