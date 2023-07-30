import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // for auth guard
  private authKey = false;

  // Use userDateSelection to send date
  private userDateSelection = new Subject<any>();

  // Use monthViewUpdate to notify updates
  private monthViewUpdate = new Subject<any>();

  // Use userDate$ to get the updated date
  userDate$ = this.userDateSelection.asObservable();

  // Use monthViewUpdateNotifier$ to get updates
  monthViewUpdateNotifier$ = this.monthViewUpdate.asObservable();

  constructor(private http: HttpClient, private route: Router) { }

  // **************** Component Interaction **************** //

  // to send selected date from holiday-view component to holiday-editor component
  sendUserSelectedDateId(date: string) {
    this.userDateSelection.next(date);
  }

  // to notify holiday-view component. Use monthViewUpdate 
  monthComponentNotify() {
    this.monthViewUpdate.next();
  }

  // **************** Authentication **************** //

  /**
   * Request using POST method and send JSON object eg: {"admin_email":"test@test.com","password":"test123"}
   * Return Observable
   * Use the URL 'api/admin/login/'
   */
  signIn(username: string, password: string): Observable<any> {
    const signInData = { admin_email: username, password: password };
    return this.http.post<any>('api/admin/login/', signInData, this.httpOptions).pipe(
      tap(response => {
        if (response.status === 1) {
          this.authKey = true;
          this.route.navigateByUrl('/dashboard');
        }
      })
    );
  }

  /**
   * Change authKey.
   * Navigate to signIn page
   */
  signOut() {
    this.authKey = false;
    this.route.navigateByUrl('/');
  }

  /**
   * Return true if user credentials are valid and signIn is done
   * or return false if user credentials are invalid
   */
  authValidator(): boolean {
    return this.authKey;
  }

  // **************** Dashboard **************** //

  /**
   * Request using GET method and return Observable
   * Use the URL 'api/cities/'
   */
  getCities(): Observable<any> {
    return this.http.get<any>('api/cities/', this.httpOptions);
  }

  // **************** Holiday View **************** //

  /**
   * Request using POST method and send JSON object eg: {city_name:'cityA',month:1}
   * Return Observable
   * Use the URL 'api/monthly/'
   */
  getHolidays(city: string, monthIndex: number, year: number): Observable<any> {
    const request = {
      city_name: city,
      year: year,
      month: monthIndex + 1 // month index is 0-based, so add 1
    };
    return this.http.post<any>('api/monthly/', request, this.httpOptions);
  }

  // **************** Holiday Editor **************** //

  /**
   * Request using POST method and send JSON object eg: {date:'02/05/2020',city_name:'cityA'}
   * Return Observable
   * Use the URL 'api/daily/'
   */
  getSelectedHolidayInfo(date: string, city: string): Observable<any> {
    const request = {
      date: date,
      city_name: city
    };
    return this.http.post<any>('api/daily/', request, this.httpOptions);
  }

  /**
   * Request using POST method and send JSON object eg: {date:'2020-05-25',city_name:'cityA',holidayName:'new Holiday'}
   * Return Observable
   * Use the URL 'api/create/'
   */
  addHoliday(date: string, city: string, holidayName: string): Observable<any> {
    const request = {
      date: this.transformDateFormat(date),
      city_name: city,
      holidayName: holidayName
    };
    return this.http.post<any>('api/create/', request, this.httpOptions);
  }

  /**
   * Request using PUT method and send JSON object eg: {date:'20/05/2020',city_name:'cityA',holidayName:'new Holiday'}
   * Return Observable
   * Use the URL 'api/updateholidayinfo/:id/'.:id -> holiday id
   */
  updateHoliday(id: any, date: string, city: string, holidayName: string): Observable<any> {
    const request = {
      date: this.transformDateFormat(date),
      city_name: city,
      holidayName: holidayName
    };
    return this.http.put<any>(`api/updateholidayinfo/${id}/`, request, this.httpOptions);
  }

  /**
   * Request using DELETE method
   * Return Observable
   * Use the URL 'api/deleteholidayinfo/:id/'. :id -> holiday id
   */
  removeHoliday(id: any): Observable<any> {
    return this.http.delete<any>(`api/deleteholidayinfo/${id}/`, this.httpOptions);
  }

  // **************** Upload **************** //

  /**
   * Request using POST method and send FormData with 'file' as name
   * Return Observable
   * Use the URL 'api/upload/'
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>('api/upload/', formData);
  }

  transformDateFormat(inputDate: string): string {
    // Split the inputDate into year, month, and day parts
    const [year, month, day] = inputDate.split('/');
  
    // Create a new Date object using the extracted parts
    const dateObject = new Date(+year, +month, +day);
  
    // Get the day, month, and year from the date object
    const formattedDay = String(dateObject.getDate()).padStart(2, '0');
    const formattedMonth = String(dateObject.getMonth()).padStart(2, '0');
    const formattedYear = String(dateObject.getFullYear());
  
    // Concatenate the parts with '-' separator to form the desired format
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  }
  

}
