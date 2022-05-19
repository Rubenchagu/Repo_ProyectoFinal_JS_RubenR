
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
    constructor(nombre, sigla, meses, ahorro) {
        this.nombre=nombre
        this.sigla=sigla
        this.meses=meses
        this.ahorro= ahorro
    }      
}

const busquedas = []  //Guarda cada objeto de una nueva busqueda
let Variasbusquedas = [] // Esto es un array de las busquedas
let historial = []   //Aqui se guarda el historial en localstorage

//Funciones
const validador = (MonedaIn, Cantidad, meses) => {
    
    if((monedas.some(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)==false) || (isNaN(Cantidad)) || (isNaN(meses))){
        
        if(monedas.some(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)==false) 
            alert("Esa moneda no existe, vuelva a intentarlo")
        if(isNaN(Cantidad))
            alert("Ingrese números válidos")
        if(isNaN(meses))
            alert("Ingrese números válidos")
        validar=false    
    }else{validar=true}    
}

const Convertidor = (MonedaIn, Cantidad) => {    
    
    const MonedaConvertir = monedas.find(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)
    TotalUSD= Cantidad*MonedaConvertir.precioUSD
    resultadoConversor.innerHTML = `
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <p class="card-text">${Cantidad} ${MonedaIn}= ${TotalUSD} USD</p>
                <p class="card-text">TRM utilizada: 1 ${MonedaIn}= ${MonedaConvertir.precioUSD} </p>
            </div>
        </div>
    `
}

const calcularAhorro = (USD, meses) => {
    
    busquedas.length=0
    monedas.forEach((moneda) => {
        let TotalMoneda= 0
        
        for(i=1; i<=meses; i++) {

            TotalMoneda= TotalMoneda + USD / moneda.precioUSD
            ahorro= parseFloat(moneda.precioUSD * TotalMoneda)
            moneda.precioUSD = moneda.precioUSD + (moneda.precioUSD * moneda.porcentajeCrecimiento) 
        }
    
        busquedas.push(new Busqueda (moneda.nombre, moneda.sigla, meses, ahorro))
    
        simuladorAhorro.innerHTML +=`
            <div class="card" style="width: 24rem;">
                <div class="card-body">
                    <h5 class="card-title">${(moneda.nombre.toUpperCase())}(${moneda.sigla})</h5>
                    <p class="card-text">Total ahorrado en ${meses} meses=${ahorro.toFixed(2)}  USD</p>
                </div>
            </div>
        `     
    });

    Variasbusquedas.push(busquedas)
    

}

const verHistorial = () => {

    Variasbusquedas.forEach(busqueda => {
        historial.push(busqueda)
        localStorage.setItem("historial", JSON.stringify(historial))
    });
    localStorage.setItem("historial", JSON.stringify(historial))

    let VerBusquedas = JSON.parse(localStorage.getItem("historial"))
    console.log(VerBusquedas)
}

//Main  

if(localStorage.getItem("historial")){
    historial = JSON.parse(localStorage.getItem("historial"))
}else{
    localStorage.setItem("historial", JSON.stringify(historial))
}

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

botonBusqueda.addEventListener("click", () => {
    
    verHistorial()

})