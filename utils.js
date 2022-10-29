//Función estándar que permite seleccionar el máximo de prodcutos que queremos mostrar en nuestro sitio
const splitProducts = (size) => {
    let dividedProducts = [];
    for (let i = 0; i < productsArray.length; i+= size)
        dividedProducts.push(productsArray.slice(i, i + size));
        return dividedProducts;
};

//Función que permite organizar y controlar por qué parte del array estamos yendo para mostrarlo en nuestro sitio
const productsController = {
    dividedProducts: splitProducts(8),
    nextProductsIndex: 1, 
    productsLimit: splitProducts(8).length
};

//Calcula un número entero aleatorio
const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
};

//Actualiza el nombre de la zona de productos en base al filtro aplicado
const setSubTitle = (msg) => {
    tituloCategoria.innerHTML = msg;
}

//Estila la card para que se muestre como el filtro activo
const setActive = (activeCategory) => {
    const categories = [...categoryList];

    categories.forEach((cat) => {
        if (cat.dataset.category !== activeCategory) {
            cat.classList.remove("catActive");
            return;
        }
        cat.classList.add("catActive")
    })

}

//Ajustar altura carrito

const adjustCartHeight = () => {

    if (!cart.length) {
        cartActive.style.height = "300px"
    } else {
        cartActive.style.height = "100vh"
    }
}

//Formatear a estilo pesos

const formatCurrency = (price) => {
    
    
    
    return formattedPrice
}

