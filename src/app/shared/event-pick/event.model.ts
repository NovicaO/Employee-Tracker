import { User } from 'src/app/auth/user.model';

export interface Event {
    id: string,
    title: string,
    desc: string,
    startTime: string,
    endTime: string,
    allDay: boolean,
    employees?: User[],
    isCanceled?: boolean
}