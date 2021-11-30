import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { GrupoService } from 'src/app/data-services/grupos.service';
import { ProdutoService } from 'src/app/data-services/produto.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { Grupo } from 'src/app/models/grupos/grupo';
import { Fornecedor } from 'src/app/models/fornecedores/fornecedor';
import { Produto } from 'src/app/models/produtos/produto';
import { FornecedorService } from 'src/app/data-services/fornecedor.service';

@Component({
  selector: 'app-cad-produto',
  templateUrl: './cad-produto.component.html',
  styleUrls: ['./cad-produto.component.scss']
})
export class CadProdutoComponent implements OnInit {

  private idSelecionado: string;
  public novoRegistro: boolean = false;
  public produto: Produto

  public grupos: Grupo[] = []
  public carregandoGrupos: boolean = false;
  public grupoSelecionado: string;

  public fornecedores: Fornecedor[] = []
  public carregandoFornecedores: boolean = false;
  public fornecedorSelecionado: string;

  public form: FormGroup = new FormGroup({
    grupoProdutoId: new FormControl(null, [Validators.required]),
    fornecedorId: new FormControl(null, [Validators.required]),
    nome: new FormControl(null, [Validators.required]),
    descricao: new FormControl(null, [Validators.required]),
    precoCusto: new FormControl(1, [Validators.min(1)]),
    precoVenda: new FormControl(1, [Validators.min(1)]),
    urlImagem: new FormControl(null),
    codigoExterno: new FormControl(null),
  });


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private produtoService: ProdutoService,
    private grupoService: GrupoService,
    private fornecedorService: FornecedorService,
    private modalService: NzModalService
  ) {
    this.activatedRoute.params.subscribe((param) => {
      this.idSelecionado = param.id;

      if (this.idSelecionado == null || this.idSelecionado.toLocaleLowerCase() === 'novo') {
        this.novoRegistro = true;
        this.produto = new Produto();
      }
      else {
        this.pesquisarPorId();
      }
    })
    
  }

  ngOnInit(): void {
    this.carregarGrupos();
    this.carregarFornecedores();
  }

  private carregarGrupos() {
    this.carregandoGrupos = true;

    this.grupoService.get("").subscribe(
      (grupos) => {
        this.carregandoGrupos = false;
        this.grupos = grupos;
      },
      (error) => {
        this.carregandoGrupos = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os grupos',
          nzContent: 'Não foi possível carregar a lista de grupos.'
        });        
      });
  }

  private carregarFornecedores() {
    this.carregandoFornecedores = true;

    this.fornecedorService.get("").subscribe(
      (fornecedores) => {
        this.carregandoFornecedores = false;
        this.fornecedores = fornecedores;
      },
      (error) => {
        this.carregandoFornecedores = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os fornecedores',
          nzContent: 'Não foi possível carregar a lista de fornecedores.'
        });        
      });
  }
  
  private pesquisarPorId() {
    this.produtoService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.produto = result;
        this.carregarDados();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private carregarDados() {
    if (this.produto) {
      this.form.get("grupoProdutoId").setValue(this.produto.grupoProdutoId);
      this.form.get("fornecedorId").setValue(this.produto.fornecedorId);
      this.form.get("nome").setValue(this.produto.nome);
      this.form.get("descricao").setValue(this.produto.descricao);
      this.form.get("precoCusto").setValue(this.produto.precoCusto);
      this.form.get("precoVenda").setValue(this.produto.precoVenda);
      this.form.get("urlImagem").setValue(this.produto.urlImagem);
      this.form.get("codigoExterno").setValue(this.produto.codigoExterno);

      this.grupoSelecionado = this.produto.grupoProdutoId;
      this.fornecedorSelecionado = this.produto.fornecedorId;
    }
  }

  public voltar(): void {
    this.router.navigateByUrl(AppRoutes.Produtos.base());
  }

  public salvar(): void {
    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Produto>(this.form, this.produto);

    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {

      //Verificar qual operaçao o usuário está querendo executar
      const operacao = this.novoRegistro
        ? this.produtoService.add(this.produto)
        : this.produtoService.update(this.produto);
        
      operacao.subscribe((result) => {
        this.voltar();
      },
        (err) => {
          let msg: string = '';

          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }
          }

          this.modalService.error({
            nzTitle: 'Falha ao registrar o produto',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });
        })
    }
  }

}
