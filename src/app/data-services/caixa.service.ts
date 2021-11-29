import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../core/services/endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { Caixa } from '../models/caixa/caixa';

@Injectable({ providedIn: 'root' })
export class CaixaService {
    constructor(
        private http: HttpClient,
        private endpointsService: EndpointsService
    ) { }

    public get(pesquisar: string = null): Observable<Caixa[]> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/caixa/?pesquisa=${pesquisar}`
        return this.http.get<Caixa[]>(url);
    }

    public getById(id: string = null): Observable<Caixa> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/caixa/${id}`
        return this.http.get<Caixa>(url);
    }

    public add(caixa: Caixa): Observable<Caixa> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/caixa/`
        return this.http.post<Caixa>(url, caixa);
    }

    public update(caixa: Caixa): Observable<Caixa> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/caixa/${caixa.id}`;
        return this.http.put<Caixa>(url, caixa);
    }

    public delete(id: string): Observable<any> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/caixa/${id}`;
        return this.http.delete<any>(url);
    }
}