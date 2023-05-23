import { HttpClient , HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetInfoUserService {
  baseUrl : string = "http://localhost:3500/user/getInfo"
  constructor(private http:HttpClient) {
  }
  getInfo(id_user :string):Observable<any>{

    let params = new HttpParams().set('id_user',id_user)

    return this.http.get(this.baseUrl, {params : params})
  }
 }
