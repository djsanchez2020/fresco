import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { DateInMonth } from '../../DateInMonth';
import { HolidayService } from 'src/app/services/holiday.service';

@Component({
  selector: 'app-holiday-view',
  templateUrl: './holiday-view.component.html',
  styleUrls: ['./holiday-view.component.css']
})
export class HolidayViewComponent implements OnInit, OnChanges {

  // get the year from dashboard
  @Input() year;
  // get the monthIndex from dashboard
  @Input() monthIndex;
  // get the city from dashboard
  @Input() city;

  // assign user selected date to selectedDate
  selectedDate: any;

  // use dateObj to store DateInMonth objects
  dateObj: Array<Array<DateInMonth>> = Array();
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /**
   * Fetch holiday list and insert into responseDateObjs
   */
  responseDateObjs: Map<any, any> = new Map();

  constructor(private holidayServiceObj: HolidayService) {

  }

  /**
   * Generate month when year or monthIndex or city change
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.monthGenerator();
  }

  /**
   * ngOnInit
   * If any updates from holiday editor component then generate month
   * Use monthViewUpdateNotifier$ in HolidayService to get updates
   * Assign current date (dd/mm/yyyy) to selectedDate
   * and send the selected date to holiday editor using sendUserSelectedDateId function in HolidayService
   */
  ngOnInit() {
    this.selectedDate = this.getFormattedDate(new Date());
    this.holidayServiceObj.sendUserSelectedDateId(this.selectedDate);
    this.holidayServiceObj.monthViewUpdateNotifier$.subscribe(() => {
      this.monthGenerator();
    });
  }

  /**
   *  Generate the data for the 42 cells in the table
   *  Property "enabled" to be true for the current month
   *  After generating fetch holiday list.
   */
  monthGenerator() {
    const startDate = new Date(this.year, this.monthIndex, 1);
    const startDay = startDate.getDay();
    const endDate = new Date(this.year, this.monthIndex + 1, 0);
    const daysInMonth = endDate.getDate();

    this.dateObj = [];
    let date = 1;

    // Generar las fechas de la última semana del mes anterior
    const lastMonthEndDate = new Date(this.year, this.monthIndex, 0).getDate();
    const lastMonthStartOffset = startDay > 0 ? startDay - 1 : 6;

    for (let row = 0; row < 6; row++) {
      const week: DateInMonth[] = [];
      for (let col = 0; col < 7; col++) {
        const day: DateInMonth = new DateInMonth();

        if (row === 0 && col < startDay || row === 0 && startDay === 0) {
          // Última semana del mes anterior
          day.date = this.getFormattedDate(new Date(this.year, this.monthIndex - 1, lastMonthEndDate - lastMonthStartOffset + col));
          day.enabled = false;
        } else if (date > daysInMonth) {
          // Primera semana del mes siguiente
          if (this.year === 2019 && this.monthIndex === 11) {
            // Crear una fecha
            let fechaFix: Date = new Date(this.year, this.monthIndex + 1, date - daysInMonth);
            // Restar un año a la fecha
            fechaFix.setFullYear(fechaFix.getFullYear() - 1);
            day.date = this.getFormattedDate(fechaFix);
          } else {
            day.date = this.getFormattedDate(new Date(this.year, this.monthIndex + 1, date - daysInMonth));
          }
          day.enabled = false;
          date++;
        } else {
          // Fechas del mes actual
          day.date = this.getFormattedDate(new Date(this.year, this.monthIndex, date));
          day.enabled = true;
          date++;
        }

        week.push(day);
      }
      this.dateObj.push(week);
    }

    this.holidayInitializer();
  }

  private getFormattedDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }


  /**
   * Fetch holiday list and insert into responseDateObjs
   */
  holidayInitializer() {
    const holidays = this.holidayServiceObj.getHolidays(this.city, this.monthIndex, this.year);
    holidays.subscribe((data) => {
      this.responseDateObjs.clear();
      for (const holiday of data) {
        this.responseDateObjs.set(holiday.date, holiday);
      }
    });
  }


  /**
   *  Assign user selected date to selectedDate
   *  Send the selected date to holiday editor
   */
  sendSelectedDate(userSelectedDate) {
    this.selectedDate = userSelectedDate;
    this.holidayServiceObj.sendUserSelectedDateId(userSelectedDate);
  }
}
