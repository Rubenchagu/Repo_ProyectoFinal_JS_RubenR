
//Declaración de variables
let Monedaingresada
let CantidadIngresada
let CantidadIngresadaUSD
let MesesIngresados
let TotalUSD
let TotalMoneda
let validar
let ahorro
let servicio

//Declaración de objetos y Arrays
class Moneda {
    constructor(nombre, sigla, precioUSD, porcentajeCrecimiento) {
        this.nombre=nombre
        this.sigla=sigla
        this.precioUSD=precioUSD
        this.porcentajeCrecimiento= porcentajeCrecimiento
    }      
}

const moneda1= new Moneda("Bitcoin", "BTC", 38000, 0.05)
const moneda2= new Moneda("Etherium", "ETH", 2800, 0.04)
const moneda3= new Moneda("Oasis Protocol", "ROSE", 0.17, 0.03)
const moneda4= new Moneda("Cardano", "ADA", 0.81, 0.02)
const moneda5= new Moneda("Gala Games", "GALA", 0.14, 0.01)

const monedas = [moneda1, moneda2, moneda3, moneda4, moneda5]

//Funciones
const Convertidor = (MonedaIn, Cantidad) => {    
    
    const MonedaConvertir = monedas.find(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)
    TotalUSD= Cantidad*MonedaConvertir.precioUSD
    console.log(MonedaConvertir)
    return TotalUSD
}

calcularAhorro = (MonedaIn, USD, meses) => {

    const monedaAhorro = monedas.find(moneda => moneda.nombre === MonedaIn || moneda.sigla === MonedaIn)
    TotalMoneda= 0
    
    for(i=1; i<=meses; i++) {

        TotalMoneda= TotalMoneda + USD / monedaAhorro.precioUSD
        ahorro= monedaAhorro.precioUSD * TotalMoneda
        console.log(i + " Mes: ahorro en" + monedaAhorro.nombre + "= " + TotalMoneda)
        console.log(i + " Mes: Precio estimado de " + monedaAhorro.nombre + "= " + monedaAhorro.precioUSD + " USD")
        console.log(i + " Mes: Ahorro estimado= " + ahorro + " USD")
        monedaAhorro.precioUSD = monedaAhorro.precioUSD + (monedaAhorro.precioUSD * monedaAhorro.porcentajeCrecimiento) 
    }
    return ahorro 
}

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

//Cuerpo
do{
    servicio = prompt("¿Qué desea hacer? - 1.Conversión || 2.Proyección ahorro || 3.Salir")

    if(servicio == 1){
        
        do{
            Monedaingresada= prompt("Ingrese la moneda a convertir a USD")
            CantidadIngresada= prompt("Ingrese la cantidad a convertir")
            validador(Monedaingresada, CantidadIngresada, 0)
            
        }while(validar==false)

        Convertidor(Monedaingresada, CantidadIngresada)
        console.log("Total= " + TotalUSD + "  USD")
        alert("Total= " + TotalUSD + "  USD")       
    }
    else if(servicio==2){

        do{
            Monedaingresada= prompt("Ingrese la moneda en la que quiere ahorrar")
            CantidadIngresadaUSD= prompt("Ingrese la cantidad en dólares mensual que quiere ahorrar")
            MesesIngresados= parseInt(prompt("Ingrese la cantidad de meses que hará el ahorro"))
            validador(Monedaingresada, CantidadIngresadaUSD, MesesIngresados)
        }while(validar == false)

        calcularAhorro(Monedaingresada, CantidadIngresadaUSD, MesesIngresados)
        console.log("Total ahorro estimado en " + MesesIngresados + " meses = " + ahorro + " USD")

    }else if(servicio==3){
        break
    }
    else{alert("opción invalida, vuelva a intentarlo")}

}while(servicio!=1 || servicio!=2)