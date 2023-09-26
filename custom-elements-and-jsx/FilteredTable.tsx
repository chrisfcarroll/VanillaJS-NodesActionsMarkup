import getProducts from "./depends-on/getProducts.js";

// @ts-ignore
console.assert(window.axios, "expected axios to be loaded as a global variable by index.html")

export interface Product {
  category: string,
  price: string,
  stocked: boolean,
  name: string
}

type ProductFilter = {
  searchText:string,
  inStockOnly:boolean
}

const ref = {nextId:1}

type ProductFilterBarProps = {
  searchId:string,
  inStockId:string
  products:Product[],
  filter:ProductFilter,
  setFilter:(_:ProductFilter)=>void,
  title:string
}
function SearchForm({products,filter, setFilter, title, searchId, inStockId} : ProductFilterBarProps) {

  const checkedattr = filter.inStockOnly ? {"checked":""} : {}
  return <form>
    <legend>{title}</legend>
    <div class="twoColumnNarrowWideGrid">
      <label htmlFor={searchId}>🔎&nbsp;&nbsp;</label>
      <input type='text' placeholder='Search...'
             id={searchId}
             value={filter.searchText}
             onInput={(e) => {
               console.log("oninput", filter, e.target.value, e)
               setFilter({...filter,searchText: e.target.value})
             }}
      />
      <input type='checkbox' id={inStockId} {...checkedattr}
                      onChange={e => setFilter({
                        ...filter,
                        inStockOnly: e.target.checked
                      })}/>
      <label htmlFor={inStockId}>Only show in-stock products</label>
    </div>
  </form>
}

function ProductCategoryRow({ category , key}) {
  return (
    <tr>
      <th colSpan={2} data-key={key}>
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product , key}) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }} data-key={key}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}


function ProductResultsTable({products,filter}:{products:Product[],filter:ProductFilter}) {
  const rows=[]
  let lastCategory:string;

  products.forEach((product) => {
    if(filter.inStockOnly && !product.stocked)return
    if(filter.searchText &&
      !( new RegExp(filter.searchText,'i').test(
        product.category + ' ' + product.name))){
      return
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

class FilteredTable extends HTMLElement {

  products : Product[]
  title: string
  filter = { searchText:'' , inStockOnly:false}
  autofocus:boolean
  id='filtered-table' + (ref.nextId++)
  searchId:string
  inStockId:string

  get resultsTable() : HTMLTableElement {return document.querySelector(`#${this.id} table`)}
  get searchBox() : HTMLInputElement {return document.querySelector(`#${this.id} form #${this.searchId}`)}

  setFilter= (filter: ProductFilter )=> {
    this.filter=filter
    this.resultsTable.replaceWith(
      <ProductResultsTable products={this.products} filter={this.filter}/>)
  }

  constructor(){
    super()
    this.products=[]
  }

  connectedCallback() {
    this.autofocus=this.hasAttribute("autofocus")
    this.title=this.getAttribute("title")??"Filter Table"
    this.searchId = 'filter-bar-search-' + ref.nextId++
    this.inStockId = 'filter-bar-instock-' + ref.nextId++
    getProducts()
      .then(d=> this.products= d)
      .then(()=>{
        this.replaceWith(  <div class="filtered-table" id={this.id} >
                  <SearchForm title={this.title}
                              products={this.products}
                              filter={this.filter}
                              setFilter={this.setFilter}
                              searchId={this.searchId} inStockId={this.inStockId}/>
                  <ProductResultsTable products={this.products} filter={this.filter} />
                </div>
        )
        if(this.autofocus){ this.searchBox.focus() }
      })
  }
}
customElements.define('filtered-table', FilteredTable)
