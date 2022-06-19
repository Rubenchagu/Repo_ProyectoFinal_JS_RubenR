
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
    let notificacion
    let marketPrice

//Declaración de objetos y Arrays
    class Moneda {
        constructor(nombre, sigla, precioUSD, porcentajeCrecimiento, ath, logo) {
            this.nombre=nombre
            this.sigla=sigla
            this.precioUSD=precioUSD
            this.porcentajeCrecimiento= porcentajeCrecimiento
            this.ath= ath
            this.logo= logo
        }      
    }

    const moneda1= new Moneda("bitcoin", "btc", 0, 0, 0, "")
    const moneda2= new Moneda("ethereum", "eth", 0, 0, 0, "")
    const moneda3= new Moneda("binancecoin", "bnb", 0, 0, 0, "")
    const moneda4= new Moneda("cardano", "ada", 0, 0, 0, "")
    const moneda5= new Moneda("ripple", "xrp", 0, 0, 0, "")

    const monedas = [moneda1, moneda2, moneda3, moneda4, moneda5]

    //constructor para guardar las últmas simulaciones realizadas
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
    let historial = [] //array para guardar en localstorage las últimas simulaciones

//Funciones
    //Llamado de la API para obtener los precios en USD de las crypto en tiempo real
    const TraerValoresCrypto = () => {
        monedas.forEach((moneda, indice) => {
            fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${moneda.nombre}`)
            .then(Response => Response.json())
            .then(([{current_price, ath, image}]) =>{       //desestructuro el array/objeto para traer solo el precio en USD "current_price", "Logo" y "ATH"
                moneda.precioUSD = current_price
                moneda.ath = ath
                moneda.porcentajeCrecimiento = ((ath - current_price)/current_price)/30  //30 es el numero de meses esperado para q la moneda alcance su ATH (máximo hístorico)
                moneda.logo = image

                marketPrice.innerHTML +=`
                    <div class="card mb-3 DivLogos">
                        <h3 class="text-white bg-warning" style= "width: 100%; text-align: center">${moneda.sigla.toUpperCase()}</h3>
                        <img src="${moneda.logo}" alt="Logo de la moneda">
                        <p class="card-text text-white bg-secondary" style= "margin-bottom: 0.5rem">${moneda.precioUSD.toFixed(2)} USD</p>
                    </div>
                `
            })
            .catch(() => {
                notificacion="Error al cargar los datos de CriptoYa" 
                notificacionValidador(notificacion)
            })
        });
    }

    const validador = (Cantidad, meses) => {
        
        if((isNaN(Cantidad)) || (isNaN(meses)) || (meses>=60) || (Cantidad>10000000)){
            
            if(isNaN(Cantidad)){
                notificacion="Ingrese números validos" 
                notificacionValidador(notificacion)
            }
            if(isNaN(meses)){
                notificacion="Ingrese números validos" 
                notificacionValidador(notificacion)
            } 
                
            if(Cantidad>10000000){
                notificacion="Cantidad excede el limite" 
                notificacionValidador(notificacion)
            }
                
            if(meses>=60){
                notificacion="El número máximo de meses es 60" 
                notificacionValidador(notificacion)
            }
            
            validar=false    
        
        }else{validar=true}    
    }

    const notificacionValidador = (texto) =>{
        Toastify({
            text: texto,
            duration: 3000,
            gravity: "top",
            position: "center", 
            style: {
            background: "linear-gradient(to right, #F12F06, #3B0F06)",
            }
        }).showToast();
    }

    const Convertidor = (MonedaIn, Cantidad) => {    
        
        const MonedaConvertir = monedas.find(moneda => moneda.sigla === MonedaIn)
        console.log(MonedaConvertir)
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

    const calcularAhorro = (MonedaSim, USD, meses) => {
        
        const MonedaSimular = monedas.find(moneda => moneda.sigla === MonedaSim)
        simuladorAhorro.innerHTML =`` // Borro el HTML de la última busqueda para mostrar solo la nueva
        let TotalMoneda= 0
        let monedaUSD= MonedaSimular.precioUSD
        
        for(i=1; i<=meses; i++) {

            TotalMoneda= TotalMoneda + USD / monedaUSD
            ahorro= parseFloat(monedaUSD * TotalMoneda)
            monedaUSD = monedaUSD + (monedaUSD * MonedaSimular.porcentajeCrecimiento) 
        }

        busquedas.push(new Busqueda (MonedaSimular.nombre, MonedaSimular.sigla, meses, ahorro, USD))
        
        simuladorAhorro.innerHTML +=`
            <div class="card text-white bg-primary mb-3" >
                <h6 style="text-align:center" class="card-header">${(MonedaSimular.nombre.toUpperCase())} (${MonedaSimular.sigla.toUpperCase()})</h6>    
                <div class="card-body">
                    <p class="card-text">Ahorro mensual: ${USD} USD</p>
                    <p class="card-text">Total de meses: ${meses} meses</p>
                    <p class="card-text">Total ahorrado: ${ahorro.toFixed(2)} USD</p>
                </div>
            </div>
        `     
        if(busquedas.length>5){  // el máximo de simulaciones q se guardan en localStorage para mostrar el historial es 5
            busquedas.shift()
            historial=[...busquedas]
            localStorage.setItem("historial", JSON.stringify(historial))
        }
        else{
            historial=[...busquedas]
            localStorage.setItem("historial", JSON.stringify(historial))
        }
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
                    <p class="card-text">Total ahorrado: ${parseFloat(moneda.ahorro).toFixed(2)} USD</p>
                </div>
            </div>
        `
        });
    }

    const MostrarGraficas = () => {
        
        fetch(`/historico.json`)
        .then(Response => Response.json())
        .then(({ejeY, ejeX}) =>{ 

            const monedasGraficar = [ejeY.PreciosBTC, ejeY.PreciosETH, ejeY.PreciosBNB, ejeY.PreciosADA, ejeY.PreciosXRP]
            const colorGrafica = ["rgb(255, 99, 132)", "rgb(43, 0, 255", "rgb(26, 175, 28)", "rgb(189, 202, 10)", "rgb(202, 10, 128)"]
            const crypto = ["BITCOIN", "ETHEREUM", "BINANCE BNB", "CARDANO", "RIPPLE"]
            
            monedasGraficar.forEach((moneda, indice) => {
            
                const labels = ejeX;
                
                const data = {
                    labels: labels,
                    datasets: [{
                    label: crypto[indice],
                    borderColor: colorGrafica[indice],
                    data: moneda,
                    }]
                };
                
                const config = {
                    type: 'line',
                    data: data,
                    options: {}
                };
            
                const graficaHistorico = new Chart(document.getElementById(`graficaHistorico${indice+1}`), config);
            });        
        })
    }

//Main 

    //Mostrar logos y precios de las crypto en el DOM
    marketPrice= document.querySelector("#marketPrice")
    TraerValoresCrypto()
    
    //Actualiza los precios mostrados en el HTML llamando la API cada 100s
    setInterval(() => {
        marketPrice.innerHTML = ``
        TraerValoresCrypto()
    }, 100000);

    // Evento- conversor crypto
    formConversor = document.querySelector("#formConversor")
    resultadoConversor = document.querySelector("#resultadoConversor")

    formConversor.addEventListener("submit", (evento) => {
        
        evento.preventDefault()
        MonedaIngresada= (document.querySelector("#MonedaIngresada").value).toLowerCase()
        CantidadIngresada= parseFloat(document.querySelector("#CantidadIngresada").value)
        validador(CantidadIngresada, 0)

        if(validar==true){
            Convertidor(MonedaIngresada, CantidadIngresada)
        }
        formConversor.reset()
    })

    // Evento- simulador crypto
    formSimulador = document.querySelector("#formSimulador")
    simuladorAhorro = document.querySelector("#simuladorAhorro")

    formSimulador.addEventListener("submit", (evento) => {

        evento.preventDefault()
        MonedaIngresadaSim= (document.querySelector("#MonedaIngresadaSim").value).toLowerCase()
        CantidadIngresadaUSD= parseFloat(document.querySelector("#CantidadIngresadaUSD").value)
        MesesIngresados= parseFloat(document.querySelector("#MesesIngresados").value)
        validador(CantidadIngresadaUSD, MesesIngresados)

        if(validar==true){
            calcularAhorro(MonedaIngresadaSim, CantidadIngresadaUSD, MesesIngresados)
        }    
        formSimulador.reset()
    })

    botonBusqueda= document.querySelector("#botonBusqueda")
    botonBusqueda.addEventListener("click", () => {verHistorial()})

    //Graficar 

    MostrarGraficas()
    
    

    