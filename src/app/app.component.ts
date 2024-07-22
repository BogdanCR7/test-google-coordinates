import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMap, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  private _map: GoogleMap;
  private marker: google.maps.Marker;
  public temp: GeolocationPosition;

  public infoLog: string[] = [''];

  @ViewChild("infoLogElement")
  private infoLogElement: any;
  @ViewChild("infoPage")
  private infoPage: ElementRef;
  @ViewChild("buttonPosition")
  private buttonPosition: ElementRef;

  @ViewChild(GoogleMap)
  set googleMap(value: GoogleMap) {
    this._map = value;
  }
  get googleMap(): GoogleMap {
    return this._map;
  }

  ngAfterViewInit(): void {
    this._map.controls[google.maps.ControlPosition.LEFT_TOP].push(this.infoPage.nativeElement);
    this._map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.infoLogElement.nativeElement);
    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(this.buttonPosition.nativeElement);
    if (navigator.geolocation) {
      let optn = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
      };
      //let watchId = navigator.geolocation.watchPosition(null, null, optn);
      this.getCurrentPosition();

      // navigator.geolocation.watchPosition((position) => {
      //   if (this.marker)
      //     this.marker.setMap(null);

      //   this.marker = new google.maps.Marker({
      //     position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      //     map: this.googleMap.googleMap
      //   });
      //   this.temp = position;
      //   this.marker.setMap(this.googleMap.googleMap);
      //   let bounds = new google.maps.LatLngBounds();
      //   this.googleMap.fitBounds(bounds.extend(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)));
      //   let time = new Date();

      //   this.infoLog.push(`${time.getHours()}${time.getMinutes()}${time.getMilliseconds()} << Watch Position Accuracy:${position.coords.accuracy},Latitude:${position.coords.latitude},Longitude:${position.coords.longitude}`);
      // }, null, optn);
    }
  }

  private getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      if (this.marker)
        this.marker.setMap(null);

      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: this.googleMap.googleMap
      });
      this.temp = position;
      this.marker.setMap(this.googleMap.googleMap);
      let bounds = new google.maps.LatLngBounds();
      this.googleMap.fitBounds(bounds.extend(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)));

      let time = new Date();
      this.infoLog.push(`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()} << Get Current Position Latitude:${position.coords.latitude}, Longitude:${position.coords.longitude}`);
    });
  }

  public getPosition() {
    let time = new Date();
    this.infoLog.push(`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()} << getPosition clicked`);
  }
}
