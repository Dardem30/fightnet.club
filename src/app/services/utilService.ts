import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {AppComponent} from '../app.component';

@Injectable()
export class UtilService {
  constructor(private http: HttpClient) {

  }

  countries(): Promise<Country[]> {
    return this.http.get(AppComponent.apiEndpoint + 'util/getCountries')
      .toPromise()
      .then((response: Country[]) => {
        response.forEach(country => country.transientJSONField = JSON.stringify(country.cities));
        return response;
      })
      .then((response: Country[]) => response);
  }
}
