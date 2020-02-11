export interface Data{
    startLat: number;
    startLng: number;
    startTime: string;
    endLat?: number;
    endLng?: number;
    endTime?: string;
    userId: string;
    userName?: string;
    clockedIn: boolean;
    startAddress?: string;
    endAddress?: string;
    totalHours?: string;
    accuracyIn?: number;
    accuracyOut?: number;
    speedIn?: number;
    speedOut?: number;
}