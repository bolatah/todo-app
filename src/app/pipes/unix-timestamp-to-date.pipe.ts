import {Pipe, PipeTransform} from '@angular/core'
@Pipe({
    name:'unixTimestampToDate',
    standalone: true
})

export class UnixTimestampToDatePipe implements PipeTransform{
    transform(value: string) {
        const newDate = new Date(Number(value) * 1000)
        return newDate
    }
}