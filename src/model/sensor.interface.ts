export interface Sensor
{
    onChange?: (value: number) => void
    connect(): Promise<void>
    unit(): string
}