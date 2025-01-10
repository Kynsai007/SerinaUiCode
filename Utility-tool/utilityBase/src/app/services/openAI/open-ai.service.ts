import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = environment.apiUrl
  private apiVersion = environment.apiVersion
  constructor(private http: HttpClient) { }

  readAllTags(ven_ser_id, context: string, is_line: boolean) {
    let param;
    if(ven_ser_id){
      param = `?ven_ser_id=${ven_ser_id}&context=${context}&is_line=${is_line}`;
    } else {
      param = `?context=${context}&is_line=${is_line}`;
    }
    return this.http.get<any>(`${this.apiUrl}/${this.apiVersion}/VendorPortal/getopenaitags${param}`);
  }

  updatePrompt(ven_ser_id, context: string, prompt: string) {
    let param = `?tail_prompt=${prompt}&context=${context}`;
    let encodPrompt = encodeURIComponent(prompt);
    if(ven_ser_id){
      param = `?tail_prompt=${encodPrompt}&context=${context}&ven_ser_id=${ven_ser_id}`;
    }
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/VendorPortal/updateprompt${param}`, null);
  }
}
