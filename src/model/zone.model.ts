import { LightState } from "./light-state.model"
import { Range } from "./range.model"

export class Zone
{
    public range:Range

    constructor(public name: string, public min: number, public max: number, public lightState: LightState)
    {
        this.range = new Range(min, max)
    }

    inZone(value: number): boolean
    {
        return value >= this.range.min && value <= this.range.max
    }
}