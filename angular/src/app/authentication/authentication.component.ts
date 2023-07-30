import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HolidayService } from '../services/holiday.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  hide = false;

  /**
   * signInForm should contain the following Form control
   * 1. userName -> validate email, required.
   * 2. password -> required
   */
  signInForm: FormGroup;

  constructor(
    private holidayServiceObj: HolidayService,
    private snackBar: MatSnackBar,
    private route: Router,
  ) { }

  ngOnInit() {
    // Initialize the signInForm with form controls and validators
    this.signInForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  /**
   * On click signIn button should call validate()
   * The validate should use the signIn function in HolidayService
   * If response is {status:1} then navigate to dashboard
   * Otherwise display "Invalid password" using snackbar
   */
  validate() {
    if (this.signInForm.invalid) {
      // If the form is invalid, display an error message using snackbar
      this.snackBar.open('Please enter valid username and password', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const userName = this.signInForm.get('userName').value;
    const password = this.signInForm.get('password').value;

    // Call the signIn function in the HolidayService to validate the credentials
    this.holidayServiceObj.signIn(userName, password).subscribe(
      (response) => {
        if (response.status === 1) {
          // If the response status is 1, navigation to the dashboard
          this.route.navigateByUrl('/dashboard');
        } else {
          // If the response status is not 1, display an error message using snackbar
          this.snackBar.open('Invalid password', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      },
      (error) => {
        // Handle the error from the API request if necessary
        console.error(error);
        // Display an error message using snackbar
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
  }
}
