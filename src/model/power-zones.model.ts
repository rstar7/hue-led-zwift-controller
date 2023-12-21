import { Range } from "./range.model";
import { Zone } from "./zone.model";

export class PowerZones
{
    public static calculate(FTP: number): Zone[]
    {
        const zone1max = Math.round(FTP * 0.55)
        const zone2max = Math.round(FTP * 0.75)
        const zone3max = Math.round(FTP * 0.90)
        const zone4max = Math.round(FTP * 1.05)
        const zone5max = Math.round(FTP * 1.20)

        const zone1 = new Zone('Power Zone 1',            0, zone1max, { color: 19536, saturation: 100 })
        const zone2 = new Zone('Power Zone 2', zone1max + 1, zone2max, { color: 29536, saturation: 125 })
        const zone3 = new Zone('Power Zone 3', zone2max + 1, zone3max, { color: 37577, saturation: 175 })
        const zone4 = new Zone('Power Zone 4', zone3max + 1, zone4max, { color:  6716, saturation: 175 })
        const zone5 = new Zone('Power Zone 5', zone4max + 1, zone5max, { color: 65000, saturation: 175 })
        
        let zones: Zone[] = [ zone1, zone2, zone3, zone4, zone5 ]

        return zones;
    }
}