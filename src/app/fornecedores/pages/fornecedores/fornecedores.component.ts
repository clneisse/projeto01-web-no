import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FornecedorService } from 'src/app/data-services/fornecedor.service';
import { Fornecedor } from 'src/app/models/fornecedores/fornecedor';
import { debounce } from 'lodash';
import { AppRoutes } from 'src/app/app-routes';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedorComponent implements OnInit {

  public loading: boolean = false;
  public fornecedores: Fornecedor[] = [];

  constructor(
    private router: Router,
    private fornecedorService: FornecedorService,
    private modalService: NzModalService
  ) {

    this.localizar = debounce(this.localizar, 400);
  }


  ngOnInit(): void {
    //Pesquisa inicial quando entra na tela
    this.pesquisar("");
  }

  public novo(): void {
    const url = `${AppRoutes.Fornecedores.CadFornecedor()}/novo`;
    this.router.navigateByUrl(url);
  }

  public localizar(event: any): void {    
    this.pesquisar(event.target.value);

    // if (value && value.trim() !== '') {
    //   this.pesquisar(value);
    // } else {
    //   this.limparPesquisa();
    // }
  }

  private pesquisar(pesquisa: string): void {
    this.loading = true;
    this.fornecedorService.get(pesquisa).subscribe(
      (result) => {
        this.fornecedores = result;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  public limparPesquisa(): void {
    console.log("limpar");
    this.pesquisar("");
  }

  public editar(fornecedor: Fornecedor): void {
    var url = `${AppRoutes.Fornecedores.CadFornecedor()}/${fornecedor.id}`;
    this.router.navigateByUrl(url);
  }

  public excluir(fornecedor: Fornecedor): void {
    if (confirm(`Deseja excluir o registro ${fornecedor.nome}?`)) {
      this.fornecedorService.delete(fornecedor.id).subscribe(
        (result) => {
          this.pesquisar("");
        },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao excluir o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                        ${msg}`
          });

        }
      );
    }
  }
}
