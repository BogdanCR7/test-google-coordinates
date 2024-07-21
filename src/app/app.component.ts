import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMap],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  private _map: GoogleMap;

  @ViewChild(GoogleMap)
  set map(value: GoogleMap) {
    this._map = value;
  }
  get map(): GoogleMap {
    return this._map;
  }
  temp: GeolocationPosition;

  ngAfterViewInit(): void {
    if (navigator.geolocation) {

      let optn = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
      };
      // let watchId = navigator.geolocation.watchPosition(null, null, optn);
      // navigator.geolocation.getCurrentPosition((position) => {
      //   let bounds = new google.maps.LatLngBounds();
      //   let marker = new google.maps.Marker({
      //     position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      //     map: this.map.googleMap
      //   });
      //   // position.coords;
      //   marker.setMap(this.map.googleMap);
      //   this.map.fitBounds(bounds.extend(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)));
      // });

      navigator.geolocation.watchPosition((position) => {
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: this.map.googleMap
        });
        this.temp=position;
        marker.setMap(this.map.googleMap);
      });
    }
  }
}
