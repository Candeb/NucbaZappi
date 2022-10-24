// Contenedor de productos donde se van a renderizar
const products = document.querySelector('.populares--container');
// Contenedor de productos recomendados donde se van a renderizar
const recomendados = document.querySelector('.recommendContainer');
// Categorias que se van a ir pulsando y se van a aplicar los filtros
const categories = document.querySelector('.categoryContainer');
// Lista de categorías
const categoryList = document.querySelectorAll('.category');
//Abrir el carrito
const cartButton = document.querySelector('.cart-label');
// cerrar carrito
const cartHidden = document.querySelector('.btn-closeCart');
// carrito
const cartActive = document.querySelector('.cart');
// overlay
const divOverlay = document.querySelector('.overlay');
//Con esto modificamos el nombre de la sección elegida en categorías (por defecto es los más populares)
const tituloCategoria = document.querySelector('.prodSubTitle');

//Declaramos lo que va a tener el carrito, ya sea un array vacío o lo que traiga del LS
let cart = JSON.parse(localStorage.getItem('Cart')) || [];

//Esta función lo que hace es guardar el carrito al LS
const saveToLS = (fullCart) => {
  localStorage.setItem('Cart', JSON.stringify(fullCart));
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
        <button type="button" class="addBtn">Agregar</button>
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

const toggleCart = () => {
  cartActive.classList.toggle('active');
  divOverlay.classList.toggle('show-overlay');
};

const closeCart = () => {
  cartActive.classList.remove('active');
  divOverlay.classList.toggle('show-overlay');
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
};

init();
