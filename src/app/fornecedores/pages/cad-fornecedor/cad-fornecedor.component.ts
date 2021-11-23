import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { FornecedorService } from 'src/app/data-services/fornecedor.service';
import { IbgeService } from 'src/app/data-services/ibge.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { Fornecedor } from 'src/app/models/fornecedores/fornecedor';
import { Cidade } from 'src/app/models/ibge/cidade';
import { Estado } from 'src/app/models/ibge/estado';

@Component({
  selector: 'app-cad-fornecedor',
  templateUrl: './cad-fornecedor.component.html',
  styleUrls: ['./cad-fornecedor.component.scss']
})
export class CadFornecedorComponent implements OnInit {

  private idSelecionado: string;
  public novoRegistro: boolean = false;
  public fornecedor: Fornecedor;
  public pessoaJuridica: boolean = true;

  public estados: Estado[] = [];
  public carregandoEstados: boolean = false;
  public estadoSelecionado:Number = 0;
  
  public cidades: Cidade[] = [];
  public carregandoCidades: boolean = false;
  public cidadeSelecionada:Number = 0;

  public form: FormGroup = new FormGroup({
    codigoExterno: new FormControl(null),
    ativo: new FormControl(true, []),
    nome: new FormControl(null, [Validators.required]),
    razaoSocial: new FormControl(null, [Validators.required]),
    cnpj: new FormControl(null, []),
    rua: new FormControl(null, []),
    numero: new FormControl(null, []),
    complemento: new FormControl(null, []),
    bairro: new FormControl(null, []),
    estadoId: new FormControl(null),
    cidadeId: new FormControl(null, []),
    cep: new FormControl(null, []),
    fone: new FormControl(null, []),
    email: new FormControl(null, [Validators.email]),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private fornecedorService: FornecedorService,
    private ibgeService: IbgeService
  ) {
    this.activatedRoute.params.subscribe(
      (params) => {

        //Carrega o id passado por parametro na URL
        this.idSelecionado = params.id;

        //Caso o parametro seja o valor "novo" então devemos gerar um novo registro
        if (this.idSelecionado == null || this.idSelecionado.toLowerCase() === 'novo') {
          this.novoRegistro = true;
          this.fornecedor = new Fornecedor();
          //Caso contrário devemos consultar na base para atualizar os valores
        } else {
          this.pesquisarPorId();
        }
      });
  }

  ngOnInit(): void {
    this.carregarEstados();
  }

  private pesquisarPorId() {
    this.fornecedorService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.fornecedor = result;        
        this.carregarDados();
      },
      (err) => { }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl(AppRoutes.Fornecedores.base());
  }

  public salvar(): void {

    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Fornecedor>(this.form, this.fornecedor);


    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {

      this.fornecedor.cidadeId = this.fornecedor.cidadeId.toString();
      this.fornecedor.estadoId = this.fornecedor.estadoId.toString();

      //Verificar qual operaçao o usuário está querendo executar
      const operacao = this.novoRegistro 
        ? this.fornecedorService.add(this.fornecedor) 
        : this.fornecedorService.update(this.fornecedor);

      operacao.subscribe((result) => {
        this.cancelar();
      },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao registrar o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });

        })
    }
  }

  private carregarDados() {
    if (this.fornecedor) {
      this.form.get("codigoExterno").setValue(this.fornecedor.codigoExterno);
      this.form.get("ativo").setValue(this.fornecedor.ativo);
      this.form.get("nome").setValue(this.fornecedor.nome);
      this.form.get("razaoSocial").setValue(this.fornecedor.razaoSocial);
      this.form.get("cnpj").setValue(this.fornecedor.cnpj);
      this.form.get("rua").setValue(this.fornecedor.rua);
      this.form.get("numero").setValue(this.fornecedor.numero);
      this.form.get("complemento").setValue(this.fornecedor.complemento);
      this.form.get("bairro").setValue(this.fornecedor.bairro);
      this.form.get("estadoId").setValue(this.fornecedor.estadoId);
      this.form.get("cidadeId").setValue(this.fornecedor.cidadeId);
      //this.form.get("cidadeNome").setValue(this.cliente.cidadeNome);
      this.form.get("cep").setValue(this.fornecedor.cep);
      this.form.get("fone").setValue(this.fornecedor.fone);
      this.form.get("email").setValue(this.fornecedor.email);

      //Campos 
      this.estadoSelecionado = Number(this.fornecedor.estadoId);
      this.cidadeSelecionada = Number(this.fornecedor.cidadeId);
    }
  }

  private carregarEstados() {
    this.ibgeService.getEstados().subscribe(
      (estados) => {
        this.carregandoEstados = false;
        this.estados = estados;
      },
      (error) => {
        this.carregandoEstados = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os estados',
          nzContent: 'Não foi possível carregar a lista de estados.'
        });
        console.log(error);
      });
  }

  public carregarCidades(estadoId: number): void {
    this.carregandoCidades = true;
    this.ibgeService.getCidades(estadoId).subscribe(
      (cidades) => {
        this.carregandoCidades = false;
        this.cidades = cidades;
      },
      (error) => {
        this.carregandoCidades = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar as cidades',
          nzContent: 'Não foi possível carregar a lista de cidades.'
        });
        console.log(error);
      })
  }

}
