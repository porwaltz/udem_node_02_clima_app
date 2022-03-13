require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer')
const Busquedas = require('./models/busquedas')


const main = async() => {
    console.clear()
    const busquedas = new Busquedas()
    let opt

    do{
        opt = await inquirerMenu()
        console.log({opt})
        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ')

                //Buscar lugares
                const lugares = await busquedas.ciudad(termino)
                
                //Seleccionar un lugar
                const id = await listarLugares(lugares)
                if( id === '0') continue

                
                const lugarSeleccionado = lugares.find(l => l.id == id)
                //console.log(lugarSeleccionado)
                
                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                //clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)
                let { temp, min, max, desc} = clima

                //mostrar resultados
                console.clear()
                console.log('\nInformación de la ciudad\n'.green)
                console.log('Ciudad: ', lugarSeleccionado.nombre.green)
                console.log('Lat: ', lugarSeleccionado.lat)
                console.log('Lng: ', lugarSeleccionado.lng)
                console.log('Temperatura: ', temp)
                console.log('Minima: ', min)
                console.log('Maxima: ', max)
                console.log('Descripcion: ', desc.green)
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1}. `.green
                    console.log(`${ idx } ${ lugar }`)
                })


                break;
            default:
                break;
        }

        if (opt !== 0) await pausa()

    } while( opt !== 0)
}

main()