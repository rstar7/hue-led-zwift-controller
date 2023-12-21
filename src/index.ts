import { HueClient } from "./hue/hue-client"
import { HeartRateSensor } from "./heart-rate-sensor/heart-rate.sensor"
import { PowerSensor } from "./power-meter-sensor/power-monitor"
import { PowerZones } from "./model/power-zones.model"
import { Sensor } from "./model/sensor.interface"
import { Zone } from "./model/zone.model"

(async () => {

    let lights = [5, 9, 10, 11]

    let hue = new HueClient('http://192.168.0.218', 'nDimfX3ySIm4khLCB9pJI7SZrhrCBU1HEp77iUA8')

    const hrZone1 = new Zone('Heart Zone 1',   1, 119, { color: 19536, saturation: 100 })
    const hrZone2 = new Zone('Heart Zone 2', 120, 145, { color: 29536, saturation: 125 })
    const hrZone3 = new Zone('Heart Zone 3', 146, 159, { color: 37577, saturation: 175 })
    const hrZone4 = new Zone('Heart Zone 4', 160, 170, { color:  6716, saturation: 175 })
    const hrZone5 = new Zone('Heart Zone 5', 171, 188, { color: 65000, saturation: 175 })

    const zones = [hrZone1, hrZone2, hrZone3, hrZone4, hrZone5]
    let sensor:Sensor = new HeartRateSensor('HRM-Pro:406506')

    // sensor = new PowerSensor('Zwift Hub')
    // const zones = PowerZones.calculate(270)

    let currentZone: Zone = zones[0]
    lights.forEach(id => { hue.applyColor(id, currentZone.lightState) })

    sensor.connect()
    sensor.onChange = (sensorValue) => {

        let zone = zones.find(zone => zone.inZone(sensorValue))

        if(zone != null)
        {
            if(!currentZone || zone && currentZone.name !== zone.name)
            {
                currentZone = zone
                lights.forEach(id => { hue.applyColor(id, currentZone.lightState) })
            }
        }

        console.log(`Zone ${currentZone.name}, sensor value ${sensorValue} ${sensor.unit()}`)
    }
})()

let interval = 500
setInterval(() => {}, interval)