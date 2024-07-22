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
	public currentRadius: GeolocationPosition;

	public infoLog: string[] = [];

	@ViewChild("infoLogElement")
	private infoLogElement: any;
	@ViewChild("infoPage")
	private infoPage: ElementRef;
	@ViewChild("buttonPosition")
	private buttonPosition: ElementRef;
	circle: google.maps.Circle;
	permissition: string = '..';

	@ViewChild(GoogleMap)
	set map(value: GoogleMap) {
		this._map = value;
	}
	get map(): GoogleMap {
		return this._map;
	}

	public mapOptions: google.maps.MapOptions = {
		mapTypeId: 'satellite',
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
		scaleControl: true,
	}

	constructor() {
		this.showError = this.showError.bind(this)
	}
	ngAfterViewInit(): void {
		this._map.controls[google.maps.ControlPosition.LEFT_TOP].push(this.infoPage.nativeElement);
		// this._map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.infoLogElement.nativeElement);
		this._map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.buttonPosition.nativeElement);
		if (navigator.geolocation) {
			let optn = {
				enableHighAccuracy: true,
				timeout: Infinity,
				maximumAge: 0
			};
			//let watchId = navigator.geolocation.watchPosition(null, null, optn);
			navigator.permissions.query({ name: "geolocation" }).then((result) =>{
				this.permissition=result.state;
			});
			this.getPositionClick();
			navigator.geolocation.watchPosition((position) => {
				// this.permissition = 'Ok';
				let bounds = new google.maps.LatLngBounds();

				if (this.marker)
					this.marker.setMap(null);

				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					map: this.map.googleMap
				});
				let ltLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

				this.drawCircle(position.coords.accuracy, ltLng);

				this.currentRadius = position;
				this.marker.setMap(this.map.googleMap);
				let currentBounds = this.map.getBounds();
				bounds.extend(ltLng)
				if (!currentBounds || !currentBounds.contains(bounds.getNorthEast()) || !currentBounds.contains(bounds.getSouthWest())) {
					this.map.fitBounds(bounds);
				}
				let time = new Date();
				this.infoLog.push(`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()} << Watch Position acc:${position.coords.accuracy.toFixed(1)},lat:${position.coords.latitude}, lng:${position.coords.longitude}`);
			}, this.showError, optn);
		}
	}

	private getCurrentPosition() {
		let optn = {
			enableHighAccuracy: true,
			timeout: Infinity,
			maximumAge: 0
		};
		navigator.geolocation.getCurrentPosition((position) => {
			// this.permissition = 'Ok';
			if (this.marker)
				this.marker.setMap(null);
			let ltLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			this.drawCircle(position.coords.accuracy, ltLng);
			this.marker = new google.maps.Marker({
				position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				map: this.map.googleMap
			});
			this.currentRadius = position;
			this.marker.setMap(this.map.googleMap);
			let bounds = new google.maps.LatLngBounds();
			bounds.extend(ltLng);
			let currentBounds = this.map.getBounds();

			if (!currentBounds || !currentBounds.contains(bounds.getNorthEast()) || !currentBounds.contains(bounds.getSouthWest())) {
				this.map.fitBounds(bounds);
			}
			this.map.fitBounds(bounds.extend(ltLng));

			let time = new Date();
			this.infoLog.push(`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()} << Get Current Position acc:${position.coords.accuracy.toFixed(1)}, lat:${position.coords.latitude}, lng:${position.coords.longitude}`);
		}, this.showError, optn);
	}

	public getPositionClick() {
		let time = new Date();
		this.infoLog.push(`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()} << Get Position clicked`);
		this.getCurrentPosition();
	}

	private drawCircle(radius: number, center) {
		if (this.circle)
			this.circle.setMap(null);

		this.circle = new google.maps.Circle({
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			map: this.map.googleMap,
			center: center,
			radius: radius
		});
		this.circle.setMap(this.map.googleMap);
	}

	showError(error) {
		// switch (error.code) {
		// 	case error.PERMISSION_DENIED:
		// 		this.permissition = 'PERMISSION DENIED';
		// 		break;
		// 	case error.POSITION_UNAVAILABLE:
		// 		this.permissition = 'POSITION UNAVAILABLE';
		// 		break;
		// 	case error.TIMEOUT:
		// 		this.permissition = 'TIMEOUT';
		// 		break;
		// 	case error.UNKNOWN_ERROR:
		// 		this.permissition = 'UNKNOWN ERROR';
		// 		break;
		// }
	}


}
