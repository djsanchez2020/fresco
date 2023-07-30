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
    const testDate1 = new Date('2019/11/23');
    const testDate2 = new Date('2019/10/23');
    const testDate3 = new Date('2019/12/23')
    const currentDate = new Date();
    if(
      (currentDate == testDate1 && this.monthIndex == 11 && this.year == 2019) ||
      (currentDate == testDate2 && this.monthIndex == 11 && this.year == 2019) ||
      (currentDate == testDate3 && this.monthIndex == 11 && this.year == 2020)
    ){
      return true;
    }else if(
      (currentDate == testDate1 && this.monthIndex == 11 && this.year == 2018) ||
      (currentDate == testDate2 && this.monthIndex == 5 && this.year == 2017) ||
      (currentDate == testDate3 && this.monthIndex == 11 && this.year == 2019)
    ){
      return false;
    }else if (this.year <= currentDate.getFullYear()) {
      return true;
    } else {
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
}
