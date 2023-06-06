import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GetInfoUserService {

  constructor(private http: HttpClient) {
  }

  getInfo(id_user: string): Observable<any> {
    return this.http.get(`http://localhost:3500/user/getInfo/${id_user}`);
  }
}
