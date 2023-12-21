import axios from 'axios'
import { Light } from '../model/light.model'
import { LightState } from '../model/light-state.model'

export class HueClient {

    constructor(public host: string, public username: string) { }

    get endpoint()
    {    
        return `${this.host}/api/${this.username}`
    }

    async fetchAllState() : Promise<Light[]>
    {
        const response = await axios.get(`${this.endpoint}/lights`)

        let lights: Light[] = []

        for (const hueId in response.data)
        {            
            lights.push({
                id: response.data.id,
                power: response.data.state.on,
                brightness: response.data.state.bri,
                color: response.data.state.hue,
                saturation: response.data.state.sat,
                mode: response.data.state.mode
            })
        }

        return lights
    }

    async fetchState(hueId: number) : Promise<Light>
    {
        const response = await axios
            .get(`${this.endpoint}/lights/${hueId}`)

        return {
            id: hueId,
            power: response.data.state.on,
            brightness: response.data.state.bri,
            color: response.data.state.hue,
            saturation: response.data.state.sat,
            mode: response.data.state.mode
        }
    }

    async applyState(hueId: number, state: LightState)
    {
        const hueState = {
            on: state.power,
            bri: state.brightness,
            hue: state.color,
            sat: state.saturation
        }

        await axios
            .put(`${this.endpoint}/lights/${hueId}/state`, hueState)
            .catch(error => console.log(error))

        return this.fetchState(hueId)
    }

    async applyColor(hueId: number, state: LightState)
    {
        const hueState = {
            hue: state.color,
            sat: state.saturation,
            transitiontime: 1
        }

        await axios
            .put(`${this.endpoint}/lights/${hueId}/state`, hueState)
            .catch(error => console.log(error))

        return this.fetchState(hueId)
    }
}