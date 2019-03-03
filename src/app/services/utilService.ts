import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UtilService {
  constructor(private http: HttpClient) {

  }

  countries(): Promise<Country[]> {
    return this.http.get('https://fightnet.herokuapp.com/util/getCountries')
      .toPromise()
      .then((response: Country[]) => {
        response.forEach(country => country.transientJSONField = JSON.stringify(country.cities));
        return response;
      })
      .then((response: Country[]) => response);
  }
}
