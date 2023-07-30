import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HolidayService } from 'src/app/services/holiday.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-holiday-editor',
  templateUrl: './holiday-editor.component.html',
  styleUrls: ['./holiday-editor.component.css']
})
export class HolidayEditorComponent implements OnInit, OnChanges {
  // get the city from dashboard
  @Input() city = '';

  // get the selected date from holiday view and assign it to selectedDate
  selectedDate = '';
  // get the response and assign it to holidayObj
  holidayObj: any = {};

  // Use the editorFlag to display or hide form
  editorFlag = false;

  /**
   * holidayEditor should contain the following Form control
   * 1. holidayName -> should contain only alphabets, required.
   */
  holidayEditor: FormGroup;

  constructor(private holidayServiceObj: HolidayService) {

  }

  /**
   * When city changes, get Holiday information
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.city && !changes.city.firstChange) {
      this.getSelectedHolidayInfo();
    }
  }

  /**
   * Get user-selected date from holiday view component and assign it to selectedDate
   * Call getSelectedHolidayInfo() when the user selects a date
   */
  ngOnInit() {
    this.holidayEditor = new FormGroup({
      holidayName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')])
    });
  }

  /**
   *    ---> getSelectedHolidayInfo()<---
   *
   * Validate the selected date with the current date.
   *  ->  If the selected date is greater than the current date, do the following
   *      1. Display the editor
   *      2. Get Holiday information and assign it to the holidayObj variable.
   *  -> If the selected date is lesser than the current date, do the following.
   *      1. Hide the editor
   *      2. Do not fetch holiday information
   */
  getSelectedHolidayInfo() {
    const currentDate = new Date();
    const selectedDateObj = new Date(this.formatDate(this.selectedDate));
    if (selectedDateObj > currentDate) {
      this.editorFlag = true;
      this.holidayServiceObj.getSelectedHolidayInfo(this.selectedDate, this.city).subscribe(
        (response) => {
          this.holidayObj = response;
          this.holidayEditor.patchValue({
            holidayName: this.holidayObj?.holidayName || null
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.editorFlag = false;
      this.holidayObj = {};
    }
  }

  /**
   *    ---> addHoliday()<---
   * Add Holiday
   * After adding a holiday, implement the following scenario:
   *    -> Notify the holiday view component
   *    -> Get Holiday information
   */
  addHoliday() {
    const holidayName = this.holidayEditor.get('holidayName').value;
    this.holidayServiceObj.addHoliday(this.selectedDate, this.city, holidayName).subscribe(
      (response) => {
        this.holidayEditor.reset();
        this.getSelectedHolidayInfo();
        this.holidayServiceObj.monthComponentNotify();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   *    ---> updateHoliday()<---
   * Update Holiday
   * After updating a holiday, implement the following scenario:
   *    -> Notify the holiday view component
   *    -> Get Holiday information
   */
  updateHoliday() {
    const holidayName = this.holidayEditor.get('holidayName').value;
    this.holidayServiceObj.updateHoliday(this.holidayObj.id, this.selectedDate, this.city, holidayName).subscribe(
      (response) => {
        this.getSelectedHolidayInfo();
        this.holidayServiceObj.monthComponentNotify();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   *    ---> removeHoliday()<---
   * Remove Holiday
   * After removing a holiday, implement the following scenario:
   *    -> Notify the holiday view component
   *    -> User should be able to add a new Holiday
   */
  removeHoliday() {
    this.holidayServiceObj.removeHoliday(this.holidayObj.id).subscribe(
      (response) => {
        this.holidayEditor.reset();
        this.getSelectedHolidayInfo();
        this.holidayServiceObj.monthComponentNotify();
      },
      (error) => {
        console.log(error);
      }
    );
  }


  formatDate(inputDate) {
    // Check if the inputDate already has the correct format (YYYY/MM/DD)
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(inputDate)) {
      return inputDate; // Return the inputDate as it is already in the correct format
    }
  
    // Split the input date string into day, month, and year parts
    const parts = inputDate.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
  
    // Create a new Date object with the given parts (Note: month is 0-indexed in JavaScript Date)
    const dateObj = new Date(year, month - 1, day);
  
    // Get the formatted date string in 'YYYY/MM/DD' format
    const formattedDate = dateObj.toISOString().split('T')[0];
  
    return formattedDate;
  }
  
}
