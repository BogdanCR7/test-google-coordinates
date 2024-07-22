import { AfterViewInit, Component, ElementRef, viewChild, ViewChild } from '@angular/core';
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
  private marker: google.maps.Marker;
  public temp: GeolocationPosition;
  @ViewChild("infoPage")
  private infoPage: ElementRef;

  @ViewChild(GoogleMap)
  set googleMap(value: GoogleMap) {
    this._map = value;
  }
  get googleMap(): GoogleMap {
    return this._map;
  }

  ngAfterViewInit(): void {

    this._map.controls[google.maps.ControlPosition.LEFT_TOP].push(this.infoPage.nativeElement);

    debugger
    // this._map.controls.push();
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
        this.marker.setMap(null);
        this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: this.googleMap.googleMap
        });
        this.temp = position;
        this.marker.setMap(this.googleMap.googleMap);
        let bounds = new google.maps.LatLngBounds();
        this.googleMap.fitBounds(bounds.extend(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)));
      });
    }
  }
}
