import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-delete-trip',
  templateUrl: './delete-trip.component.html',
  styleUrls: ['./delete-trip.component.css']
})
export class DeleteTripComponent implements OnInit {

  deleteForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit() {
    // Retrieve stashed tripId
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('DeleteTripComponent#onInit found tripCode ' + tripCode);

    // Initialize form
    this.deleteForm = this.formBuilder.group({
    })

    console.log('DeleteTripComponent#onInit calling TripDataService#getTrip(\'' + tripCode + '\')');

    this.tripService.getTrip(tripCode)
      .then(data => {
        console.log(data);
      })
  }

  onSubmit() {
    this.submitted = true;

    if (this.deleteForm.valid) {
      let tripCode = localStorage.getItem("tripCode");
      if (!tripCode) {
        alert("Something wrong, couldn't find where I stashed tripCode!");
        this.router.navigate(['']);
        return;
      }
      console.log('DeleteTripComponent#onInit found tripCode ' + tripCode);
      this.tripService.deleteTrip(tripCode)
      .then(data => {
        console.log(data);
        // this.router.navigate(['']); Not sure why this isn't working correctly, putting it below for now
      })
      this.router.navigate(['']);
    }
  }
}
