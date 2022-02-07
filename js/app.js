// Variables
const monedaSelect = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');

const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear Promie - Function Expression
const obtenerCriptomoneda = criptomoneda => new Promise(resolve => {
    // Se ejecuta cuando se resuelva y pueda descargar las criptomonedas
    resolve(criptomoneda);
})

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda();

    monedaSelect.addEventListener('change', leerValor);
    criptomonedaSelect.addEventListener('change', leerValor);
    formulario.addEventListener('submit', submitFormulario);
})

function consultarCriptomoneda() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomoneda(resultado.Data))
        .then(criptomoneda => seleccionarCriptomoneda(criptomoneda))
}

function seleccionarCriptomoneda(criptomoneda) {

    criptomoneda.forEach(cripto => {

        const {
            Name,
            FullName
        } = cripto.CoinInfo;

        // Se crea el elemento option, donde se rellenará con la 10 criptomonedas mejor valoradas
        const option = document.createElement('option');
        option.value = Name;
        option.innerHTML = FullName;

        criptomonedaSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    const {
        moneda,
        criptomoneda
    } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje) {

    // Obtenemos error
    const error = document.querySelector('.error');

    if (!error) {

        const parrMensaje = document.createElement('p');
        parrMensaje.classList.add('error', 'rounded-3');

        // Mensaje de error
        parrMensaje.innerHTML = mensaje;

        resultado.appendChild(parrMensaje);

        // Se elimina el mensaje tras 3 segundos
        setTimeout(() => {
            parrMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {

    const { moneda, criptomoneda } = objBusqueda;
    
    mostrarSpinner();
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))
}


function mostrarCotizacion(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: ${PRICE}`;

    const precioAlto = document.createElement('p');
    precioAlto.classList.add('precio');
    precioAlto.innerHTML = `Precio más alto del día: ${HIGHDAY}`;

    const precioBajo = document.createElement('p');
    precioBajo.classList.add('precio');
    precioBajo.innerHTML = `Precio más bajo del día: ${LOWDAY}`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.classList.add('precio');
    ultimasHoras.innerHTML = `Variación últimas 24 horas: ${CHANGEPCT24HOUR}%`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.classList.add('precio');
    ultimaActualizacion.innerHTML = `Última Actualización: ${LASTUPDATE}`;


    console.log(cotizacion);
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {

    const spinner = document.createElement('div');

    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    resultado.appendChild(spinner);
}