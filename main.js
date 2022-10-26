// Contenedor de productos donde se van a renderizar
const products = document.querySelector('.populares--container');
// Contenedor de productos recomendados donde se van a renderizar
const recomendados = document.querySelector('.recommendContainer');
// Categorias que se van a ir pulsando y se van a aplicar los filtros
const categories = document.querySelector('.categoryContainer');
// Lista de categorías
const categoryList = document.querySelectorAll('.category');
// Con esto modificamos el nombre de la sección elegida en categorías (por defecto es los más populares)
const tituloCategoria = document.querySelector('.prodSubTitle');
// Abrir el carrito
const cartButton = document.querySelector('.cart-label');
// Cerrar carrito
const cartHidden = document.querySelector('.btn-closeCart');
// Carrito
const cartActive = document.querySelector('.cart');
// Overlay
const divOverlay = document.querySelector('.overlay');
// Contenedor de productos del carrito
const productsCart = document.querySelector('.cart-productsContainer');
// span a rellenar con el total
const total = document.querySelector('.subtotal');
// boton comprar
const buyBtn = document.getElementById('btn-buy');
// boton agregar
const addBtn = document.querySelector('addBtn');

//Declaramos lo que va a tener el carrito, ya sea un array vacío o lo que traiga del LS
let cart = JSON.parse(localStorage.getItem('cart')) || [];

//Esta función lo que hace es guardar el carrito al LS
const saveToLS = (fullCart) => {
  localStorage.setItem('cart', JSON.stringify(fullCart));
};

// Función general que recibe un id y una lista de productos, y en base a eso realiza un filtro y te devuelve el producto deseado
const filtrarProducto = (id, productsList) => {
  const productoFiltrado = productsList.filter(
    (producto) => producto.id === id
  );
  return productoFiltrado;
};

//Función general que recibe un item y un listado de array, y lo pushea
const pushToArray = (item, itemsArray) => {
  itemsArray.push(item);
};

//Función que renderiza un producto en el DOM
const renderRecomendado = (product) => {
  'TODO: Definir si el isPopular lo dejamos, o reemplazamos porque lo haga en base al randomizer que armamos para el recomendados';

  console.log(product);
  const { id, nombre, descripcion, image, categoria, precio } = product;

  return `
        <div class="recommendCard">
            <img src="${image}" alt="nombre" class="recommendImg">
            <div class="recommendTextContainer">
                <h4 class="recommendTitle">${nombre}</h4>
                <p class="recommendDescription">${descripcion}</p>
                <p class="recommendPrice">$${precio}</p>
            </div>
            <button type="button" class="addBtn">Agregar</button>
        </div>
    `;
};

// Esta función lo que hace es renderizar la parte de recomendados, en base a un número al azar al cargar la página o llamar la función
const renderRecomendados = (productsList) => {
  let counter = 1;
  let productosRecomendados = [];
  let productoActual = [];
  let isChosen = false;

  do {
    let idNumber = randomInteger(1, productsList.length);

    //Revisa si este producto ya fue elegido antes, en dicho caso resulta true, sino resulta false
    if (filtrarProducto(idNumber, productosRecomendados).length === 1) {
      isChosen = true;
    } else {
      isChosen = false;
    }

    //En el caso de que el producto no haya sido elegido, elige uno nuevo y lo agrega al array y suma uno al counter. Caso contrario, vuelve a probar
    if (isChosen === false) {
      productoActual = filtrarProducto(idNumber, productsList);
      productosRecomendados = [...productosRecomendados, productoActual[0]];
      counter = counter + 1;
    }
  } while (counter <= 3);

  setSubTitle('Los más populares');

  recomendados.innerHTML = productosRecomendados
    .map(renderRecomendado)
    .join('');
};

//Renderiza los productos en la parte de populares y cuando se vayan aplicando los filtros
const renderProduct = (product) => {
  const { id, nombre, descripcion, image, categoria, precio } = product;

  //TODO: Hay que estilar la imagen de recommendImg, sino se rompe

  return `
    <div class="card">
        <div class="front--image">
            <img src="${image}" alt="nombre" class="recommendImg">
        </div>
        <div class="card--body">
            <h4>${nombre}</h4>
            <p>${descripcion}</p>
        </div>
        <div class="card--pricing">
            <span>$${precio}</span>
        <button type="button" class="addBtn" data-id="${id}" data-name="${nombre}" data-bid="${precio}" data-img="${image}">Agregar</button>
        </div>
    </div>
`;
};

//Función general que recibe un contenedor del DOM y una lista de productos
const renderProductos = (contenedor, productsList, category) => {
  if (category === 'populares') {
    let populares = productsList.filter((producto) => {
      return producto.isPopular === 'popular';
    });
    contenedor.innerHTML = populares.map(renderProduct).join('');
  } else {
    contenedor.innerHTML = productsList.map(renderProduct).join('');
  }
};

//Esta función lo que hará será manejar los filtros por categoría, haciendo que solamente se muestren los productos deseados
const filterCategory = (e) => {
  if (!e.target.classList.contains('category')) {
    return;
  } else if (e.target.dataset.category === 'populares') {
    renderProductos(products, productsArray, 'populares');
    products.classList.remove('noProducts');
    setSubTitle('Los más populares');
    setActive(e.target.dataset.category);
    return;
  }

  let categoriaElegida = productsArray.filter((producto) => {
    return producto.categoria === e.target.dataset.category;
  });

  if (categoriaElegida.length === 0) {
    products.innerHTML =
      'Por el momento no tenemos ningún producto de esa categoría. Por favor, seleccione otra categoría.';
    products.classList.add('noProducts');
    setSubTitle('Mexican');
    setActive(e.target.dataset.category);
  } else {
    renderProductos(products, categoriaElegida, e.target.dataset.category);
    products.classList.remove('noProducts');
    setSubTitle(e.target.dataset.category);
    setActive(e.target.dataset.category);
  }
};

// Funciones para abrir y cerrar carrito segun corresponda

const closeCart = (e) => {
  if (e.target.classList.contains('active')) return;
  cartActive.classList.toggle('active');
  divOverlay.classList.toggle('show-overlay');
};

const toggleCart = () => {
  cartActive.classList.toggle('active');
  divOverlay.classList.toggle('show-overlay');
};

const closeOnScroll = () => {
  if (!cartActive.classList.contains('active')) return;
  cartActive.classList.remove('active');
  divOverlay.classList.remove('show-overlay');
};

const closeOnDivOverlayClick = () => {
  cartActive.classList.remove('active');
  divOverlay.classList.remove('show-overlay');
};

// Funciones para el manejo del carrito

const renderCartProduct = (cartProduct) => {
  const { id, nombre, descripcion, precio, cantidad, image } = cartProduct;
  return ` 
  <div class="cart-product">
                <img src=${image} alt="Foto ilustrativa de ${nombre}" />
                <div class="cart-productDetalle">
                  <h4>${nombre}</h4>
                  <p>${descripcion}</p>
                  <p>${precio}</p>
                </div>
                <div class="cart-cantidadDetalle">
                  <button class="button btn-menosUno" data-id=${id}>-</button>
                  <p>${cantidad}</p>
                  <button class="button btn-masUno  data-id=${id}">+</button>
                </div>
</div>   
  `;
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `
    <p class"empty-cart">No hay productos en el carrito.</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(renderCartProduct).join('');
};

const calculateTotalCart = () => {
  return cart.reduce(
    (arr, cur) => acc + Number(cur.precio) * Number(cur.cantidad),
    0
  );
};

const showTotal = () => {
  total.innerHTML = `
  ${calculateTotalCart().toFixed(2)} $`;
};

const disableButton = (button) => {
  if (!cart.length) {
    button.classList.toggle('button');
    button.classList.add('disabled');
    return;
  }
  button.classList.remove('disabled');
};

const addUnit = (product) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, cantidad: cartProduct.cantidad + 1 }
      : cartProduct;
  });
};

const createCartProduct = (product) => {
  return (cart = [...cart, { ...product, cantidad: 1 }]);
};

const productData = (id, nombre, precio, image) => {
  return { id, nombre, precio, image };
};

const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

const checkCartState = () => {
  saveToLS(cart);
  renderCart(cart);
  showTotal(cart);
  disableButton(buyBtn);
};

const addProduct = (e) => {
  if (!e.target.classList.contains('addBtn')) return;
  const { id, nombre, precio, image } = e.target.dataset;
  const product = productData(id, nombre, precio, image);
  if (isExistingCartProduct(product)) {
    addUnit(product);
  } else {
    createCartProduct(product);
  }
  checkCartState;
};

//Esta función va a contener todas aquellas funciones que necesitemos ejecutar de forma conjunta y nos permita ahorra código
const refreshData = () => {};

//Arranca el sitio con las funciones requeridas para que la página sea funcional
const init = () => {
  renderRecomendados(productsArray);
  renderProductos(products, productsArray, 'populares');
  categories.addEventListener('click', filterCategory);
  cartButton.addEventListener('click', toggleCart);
  cartHidden.addEventListener('click', closeCart);
  window.addEventListener('scroll', closeOnScroll);
  divOverlay.addEventListener('click', closeOnDivOverlayClick);
  document.addEventListener('DOMContentLoaded', renderCart);
  document.addEventListener('DOMContentLoaded', showTotal);
  products.addEventListener('click', addProduct);
  disableButton(buyBtn);
};

init();
