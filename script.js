
//Declaración de variables
let MonedaIngresada
let CantidadIngresada
let CantidadIngresadaUSD
let MesesIngresados
let TotalUSD
let validar
let ahorro
let formConversor
let resultadoConversor
let simuladorAhorro
let formSimulador
let botonBusqueda
let verBusquedasAnteriores

//Declaración de objetos y Arrays
class Moneda {
    constructor(nombre, sigla, precioUSD, porcentajeCrecimiento) {
        this.nombre=nombre
        this.sigla=sigla
        this.precioUSD=precioUSD
        this.porcentajeCrecimiento= porcentajeCrecimiento
    }      
}

const moneda1= new Moneda("bitcoin", "btc", 38000, 0.05)
const moneda2= new Moneda("etherium", "eth", 2800, 0.04)
const moneda3= new Moneda("oasis Protocol", "rose", 0.17, 0.03)
const moneda4= new Moneda("cardano", "ada", 0.81, 0.02)
const moneda5= new Moneda("gala games", "gala", 0.14, 0.01)

const monedas = [moneda1, moneda2, moneda3, moneda4, moneda5]

class Busqueda {
    constructor(nombre, sigla, meses, ahorro, USDmensual) {
        this.nombre=nombre
        this.sigla=sigla
        this.meses=meses
        this.ahorro= ahorro
        this.USDmensual= USDmensual
    }      
}

const busquedas = []  //array q guarda la última simulación de ahorro, cada objeto es una simulación del ahorro para cada moneda
let historial = []   

//Funciones
const validador = (MonedaIn, Cantidad, meses) => {
    
    if((isNaN(Cantidad)) || (isNaN(meses)) || (meses>=60) || (Cantidad>10000000)){
        
        if(isNaN(Cantidad)) 
            Toastify({
                text: "Ingrese números validos",
                duration: 3000,
                gravity: "top",
                position: "center", 
                style: {
                background: "linear-gradient(to right, #F12F06, #3B0F06)",
                }
            }).showToast();
        if(isNaN(meses)) 
            Toastify({
                text: "Ingrese números validos",
                duration: 3000,
                gravity: "top",
                position: "center",
                style: {
                background: "linear-gradient(to right, #F12F06, #3B0F06)",
                }
            }).showToast();
          if(Cantidad>10000000)
            Toastify({
                text: "Cantidad excede el limite",
                duration: 3000,
                gravity: "top",
                position: "center",
                style: {
                background: "linear-gradient(to right, #F12F06, #3B0F06)",
                }
            }).showToast();
          if(meses>=60)
            Toastify({
                text: "Limite maximo: 60 meses",
                duration: 3000,
                gravity: "top",
                position: "center",
                style: {
                background: "linear-gradient(to right, #F12F06, #3B0F06)",
                }
            }).showToast();

        validar=false    
    }else{validar=true}    
}

const Convertidor = (MonedaIn, Cantidad) => {    
    
    const MonedaConvertir = monedas.find(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)
    TotalUSD= Cantidad*MonedaConvertir.precioUSD
    resultadoConversor.innerHTML = `
        <div class="card text-white border-danger mb-3">
            <div class="card-body">
                <p class="card-text">${Cantidad} ${MonedaIn.toUpperCase()}= ${TotalUSD.toFixed(2)} USD</p>
                <p class="card-text">TRM: 1 ${MonedaIn.toUpperCase()}= ${MonedaConvertir.precioUSD} </p>
            </div>
        </div>
    `
}

const calcularAhorro = (USD, meses) => {
    
    simuladorAhorro.innerHTML =`` // Borro el HTML de la última busqueda para mostrar solo la nueva
    busquedas.length=0
    monedas.forEach((moneda, indice) => {
        let TotalMoneda= 0
        let monedaUSD= moneda.precioUSD
        
        for(i=1; i<=meses; i++) {

            TotalMoneda= TotalMoneda + USD / monedaUSD
            ahorro= parseFloat(monedaUSD * TotalMoneda)
            monedaUSD = monedaUSD + (monedaUSD * moneda.porcentajeCrecimiento) 
        }
    
        busquedas.push(new Busqueda (moneda.nombre, moneda.sigla, meses, ahorro, USD))
        
        simuladorAhorro.innerHTML +=`
            <div class="card text-white bg-primary mb-3" >
                <h6 style="text-align:center" class="card-header">${(moneda.nombre.toUpperCase())} (${moneda.sigla.toUpperCase()})</h6>    
                <div class="card-body">
                    <p class="card-text">Ahorro mensual: ${USD} USD</p>
                    <p class="card-text">Total de meses: ${meses} meses</p>
                    <p class="card-text">Total ahorrado: ${ahorro.toFixed(2)} USD</p>
                </div>
            </div>
        `     
    });
    
    console.log(busquedas)
    historial=[...busquedas]
    console.log(historial)
    localStorage.setItem("historial", JSON.stringify(historial))
}

const verHistorial = () => {

    let VerBusqueda = JSON.parse(localStorage.getItem("historial"))
    console.log(VerBusqueda)
    simuladorAhorro.innerHTML =`` // Borro el HTML de la última busqueda para mostrar solo la última busqueda guardada en localstorage
    
    VerBusqueda.forEach(moneda => {
        simuladorAhorro.innerHTML +=`
        <div class="card border-info mb-3" >
            <h6 style="text-align:center" class="card-header">${(moneda.nombre.toUpperCase())} (${moneda.sigla.toUpperCase()})</h6>
            <div class="card-body">
                <p class="card-text">Ahorro mensual: ${moneda.USDmensual} USD</p>
                <p class="card-text">Total de meses: ${moneda.meses} meses</p>
                <p class="card-text">Total ahorrado: ${moneda.ahorro.toFixed(2)} USD</p>
            </div>
        </div>
    `
    });
}

//Main  

formConversor = document.querySelector("#formConversor")
resultadoConversor = document.querySelector("#resultadoConversor")

formConversor.addEventListener("submit", (evento) => {
    
    evento.preventDefault()
    MonedaIngresada= (document.querySelector("#MonedaIngresada").value).toLowerCase()
    CantidadIngresada= parseFloat(document.querySelector("#CantidadIngresada").value)
    validador(MonedaIngresada, CantidadIngresada, 0)

    if(validar==true){
        Convertidor(MonedaIngresada, CantidadIngresada)
    }
    formConversor.reset()
})

formSimulador = document.querySelector("#formSimulador")
simuladorAhorro = document.querySelector("#simuladorAhorro")

formSimulador.addEventListener("submit", (evento) => {

    evento.preventDefault()
    CantidadIngresadaUSD= parseFloat(document.querySelector("#CantidadIngresadaUSD").value)
    MesesIngresados= parseFloat(document.querySelector("#MesesIngresados").value)
    validador("btc", CantidadIngresadaUSD, MesesIngresados)

    if(validar==true){
        calcularAhorro(CantidadIngresadaUSD, MesesIngresados)
    }    
    formSimulador.reset()
})

botonBusqueda= document.querySelector("#botonBusqueda")
botonBusqueda.addEventListener("click", () => {verHistorial()})