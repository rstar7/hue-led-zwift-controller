import { bluetooth } from 'webbluetooth'
import { Sensor } from '../model/sensor.interface'

export class PowerSensor implements Sensor
{
    private device: any
    private server: any

    constructor(public deviceName: string) {}

    onChange?: (heartRate: number) => void

    public unit() {
        return 'watt'
    }

    public async connect(): Promise<void>
    {
        this.device = await bluetooth.requestDevice({
            filters: [{ name: this.deviceName }]
        }).catch(error => {
            throw Error(`Unable to make connection due to: ${error}`)
        })

        this.server = await this.device.gatt.connect();

        console.log(`Connected to ${this.deviceName} status ${this.server.connected}`)

		const service = await this.server.getPrimaryService('cycling_power')

        const characteristic = await service.getCharacteristic('cycling_power_measurement');

        const services =  this.server.getPrimaryServices()

		await characteristic.startNotifications();

        characteristic.addEventListener('characteristicvaluechanged', async (event: any) => {

            if (event.target.value.buffer.byteLength)  {

                let buffer = event.target.value.buffer
                let view = new DataView(buffer)

                let value = view.getInt16(1);

                if (this.onChange) {
                    this.onChange(value)
                }
            }
        })
    }

    public isConnected(): boolean
    {
        return this.server?.connected
    }
}