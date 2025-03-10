export async function getProductList (){
    const res = await fetch("http://localhost:5001/products");
    const theData = await res.json();
    return {
        props : {theData}
    }
}