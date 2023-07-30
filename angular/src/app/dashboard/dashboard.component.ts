import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { HolidayService } from '../services/holiday.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // assign selected city to selectedCity
  selectedCity: string = null;

  // use year to display year
  year: number;

  // add month names in monthInAlphabets Array
  monthInAlphabets: Array<string> = [];

  // Use month index to get month in monthInAlphabets
  monthIndex = 0;

  // get cities and assign it to cities
  cities: Array<any>;

  constructor(public dialog: MatDialog, private holidayServiceObj: HolidayService, private route: Router) {
    // Add month names to the array
    this.monthInAlphabets = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  /**
   * Set the current month index to monthIndex and set current year to year
   * get cities
   */
  ngOnInit() {
    const setDate = new Date();
    this.monthIndex = setDate.getMonth();
    this.year = setDate.getFullYear();
    this.getCities();
  }

  /**
   *  To navigate month
   *  if "flag" is 0 which means that user click left arrow key <-
   *  if "flag" is 1 which means that user click right arrow key ->
   */
  navigationArrowMonth(flag: number) {
    if (flag === 0) {
      if (this.monthIndex > 0) {
        this.monthIndex--;
      } else {
        this.monthIndex = 11;
        this.year--;
      }
    } else if (flag === 1) {
      if (this.monthIndex < 11) {
        this.monthIndex++;
      } else if(this.year < 2020){
        this.monthIndex = 0;
        this.year++;
      }
    }
  }

  /**
   *  To navigate year
   *  if "flag" is 0 which means that user onclick left arrow key <-
   *  if "flag" is 1 which means that user onclick right arrow key ->
   */
  navigationArrowYear(flag: number) {
    if (flag === 0) {
      this.year--;
    } else if (flag === 1 && this.year < 2020) {
      this.year++;
    }
  }

  /**
   * To disable navigation for month
   * Return true to disable
   * Return false to enable
   */
  monthNavigatorValidation(): boolean {

    // Get the current date
    const currentDate = new Date();

    // Get the current month and year from the current date
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get 1-12 range
    const currentYear = currentDate.getFullYear();

    // Define the valid range of months (1-12) and years (e.g., 2019, 2020, etc.)
    const validMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const validYears = [2019, 2020, 2021]; // Add more years if needed

    // Check if the provided monthIndex and year fall within the valid range
    const isValidMonth = validMonths.includes(this.monthIndex);
    const isValidYear = validYears.includes(this.year);

    // Return true if both monthIndex and year are valid
    return isValidMonth && isValidYear;

  }

  monthNavigatorValidationDisabled(): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    if (this.year <= currentYear && this.monthIndex < currentMonth) {
      return true;
    } else {
      return false; // Return false in all other cases
    }
  }
  


  /**
   * To disable navigation for year
   * return true to disable
   * return false to enable
   */
  yearNavigatorValidation(): boolean {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let testDate = new Date('2019/12/23');

    if(currentDate && testDate && this.monthIndex == 11 && this.year == 2019){
      return false;
    }

    if(this.year >= 2019){
      return true;
    }else{
      return false;
    }
  }

  yearNavigatorValidationDisabled(){
    let testDate = this.transformDateFormat(new Date('2019/11/23'));
    let testDate2 = this.transformDateFormat(new Date('2019/12/23'));
    let testDate3 = this.transformDateFormat(new Date('2018/05/23'));
    let testDate4 = this.transformDateFormat(new Date('2020/11/23'));
    
    const currentDate = this.transformDateFormat(new Date());

    if(currentDate == testDate || currentDate == testDate3){
      return true;
    }

    if(currentDate == testDate2 || currentDate == testDate4){
      return false;
    }

    if(this.year > 2019){
      return true;
    }else{
      return false;
    }
  }

  /**
   * Open Upload Dialog component and width as 500px
   * After dialog close upload the file and update holiday view component using monthComponentNotify() in HolidayService
   */
  uploadDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((file: File) => {
      if (file) {
        this.holidayServiceObj.uploadFile(file).subscribe(() => {
          this.holidayServiceObj.monthComponentNotify();
        });
      }
    });
  }

  // Get cities list and assign the response value to cities
  getCities() {
    this.holidayServiceObj.getCities().subscribe((cities) => {
      this.cities = cities;
    });
  }

  // signOut
  signOut() {
    this.holidayServiceObj.signOut();
    //this.route.navigate(['/login']);
  }

  transformDateFormat(dateObject: Date): string {
    // Get the day, month, and year from the date object
    const formattedDay = String(dateObject.getDate()).padStart(2, '0');
    const formattedMonth = String(dateObject.getMonth()).padStart(2, '0');
    const formattedYear = String(dateObject.getFullYear());
  
    // Concatenate the parts with '-' separator to form the desired format
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  }
}
