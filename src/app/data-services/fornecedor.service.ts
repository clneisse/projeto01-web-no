import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../core/services/endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedores/fornecedor';

@Injectable({ providedIn: 'root' })
export class FornecedorService {
    constructor(
        private http: HttpClient,
        private endpointsService: EndpointsService
    ) { }

    public get(pesquisar: string = null): Observable<Fornecedor[]> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/fornecedor/?pesquisa=${pesquisar}`
        return this.http.get<Fornecedor[]>(url);
    }

    public getById(id: string = null): Observable<Fornecedor> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/fornecedor/${id}`
        return this.http.get<Fornecedor>(url);
    }

    public add(fornecedor: Fornecedor): Observable<Fornecedor> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/fornecedor/`
        return this.http.post<Fornecedor>(url, fornecedor);
    }

    public update(fornecedor: Fornecedor): Observable<Fornecedor> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/fornecedor/${fornecedor.id}`;
        return this.http.put<Fornecedor>(url, fornecedor);
    }

    public delete(id: string): Observable<any> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/fornecedor/${id}`;
        return this.http.delete<any>(url);
    }
}