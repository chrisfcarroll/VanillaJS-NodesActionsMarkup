import axios from "axios"
const urlGetProducts = "/depends-on/products.json";

function logThen(e){
  console.log(e)
  return e
}

// noinspection JSUnusedLocalSymbols
/* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
async function getProductsTestConstant(){
  await new Promise(res => setTimeout(res,2000))
  return Test_PRODUCTS
}

// noinspection JSUnusedLocalSymbols
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
async function getProductsTestJsonUsingAxios(){
  const json= (await axios.get(urlGetProducts).catch(e=>{throw logThen(e)})).data
  return json
}


async function getProductsTestJsonUsingFetch(){

  const json= await (await fetch(urlGetProducts).catch(e=>{throw logThen(e)})).json()
  return json
}

export default getProductsTestJsonUsingAxios


const Test_PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];
