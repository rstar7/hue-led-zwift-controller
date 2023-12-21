import { bluetooth } from 'webbluetooth'
import { Sensor } from '../model/sensor.interface'

export class HeartRateSensor implements Sensor
{
    private device: any
    private server: any

    constructor(public deviceName: string) {}

    onChange?: (heartRate: number) => void

    public unit() {
        return 'bpm'
    }

    public async connect(): Promise<void>
    {
        this.device = await bluetooth.requestDevice({
            filters: [{ name: this.deviceName }]
        }).catch(error => {
            throw Error(`Unable to make connection due to: ${error}`)
        })

        this.server = await this.device.gatt.connect();
		const service = await this.server.getPrimaryService('heart_rate')

        const characteristic = await service.getCharacteristic('heart_rate_measurement');

		await characteristic.startNotifications();

        characteristic.addEventListener('characteristicvaluechanged', async (event: any) => {

            if (event.target.value.buffer.byteLength)  {

                let buffer = event.target.value.buffer
                let view = new DataView(buffer)

                let heartRate = view.getInt8(1)
                
                if(heartRate < 0)
                {
                    heartRate = heartRate * -1
                }

                if (this.onChange) {
                    this.onChange(heartRate)
                }
            }
        })
    }

    public isConnected(): boolean
    {
        return this.server?.connected
    }
}