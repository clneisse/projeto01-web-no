import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { FormaPagamentoService } from 'src/app/data-services/forma-pagamento.service';
import { CaixaService } from 'src/app/data-services/caixa.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { FormaPagamento } from 'src/app/models/forma-pagamento/forma-pagamento';
import { Caixa } from 'src/app/models/caixa/caixa';

import { getISOWeek } from 'date-fns';
import { pt_BR, NzI18nService } from 'ng-zorro-antd/i18n';
import { CaixaItem } from 'src/app/models/caixa/caixa-item';
import { ModalItemCaixaComponent } from '../modal-item-caixa/modal-item-caixa.component';

@Component({
  selector: 'app-cad-caixa',
  templateUrl: './cad-caixa.component.html',
  styleUrls: ['./cad-caixa.component.scss']
})
export class CadCaixaComponent implements OnInit {

  private idSelecionado: string;
  public novoRegistro: boolean = false;
  public caixa: Caixa;

  public formasPagamentos: FormaPagamento[] = [];
  public carregandoFormasPgto: boolean = false;
  public formaPagamentoSel: string;

  //Somente para atualizar o grid de produtos
  public caixaItens: CaixaItem[] = [];


  public form: FormGroup = new FormGroup({
    dataCaixa: new FormControl(new Date(),),
    usuarioId: new FormControl(null),
    formaPagamentoId: new FormControl(1, [Validators.required]),
    observacao: new FormControl(null),
    quantidadeDeItens: new FormControl(null),
    totalItens: new FormControl(null),
    totalDesconto: new FormControl(null),
    totalProdutos: new FormControl(null),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private caixaService: CaixaService,
    private formaPgtService: FormaPagamentoService,
    private i18n: NzI18nService
  ) {
    //this.i18n.setLocale(pt_BR);
    this.activatedRoute.params.subscribe(
      (params) => {

        //Carrega o id passado por parametro na URL
        this.idSelecionado = params.id;

        //Caso o parametro seja o valor "novo" então devemos gerar um novo registro
        if (this.idSelecionado == null || this.idSelecionado.toLowerCase() === 'novo') {
          this.novoRegistro = true;
          this.caixa = new Caixa();
          //Caso contrário devemos consultar na base para atualizar os valores
        } else {
          this.pesquisarPorId();
        }
      });
  }

  ngOnInit(): void {
    this.carregarFormasPgto();
  }

  private pesquisarPorId() {
    this.caixaService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.caixa = result;
        this.carregarDados();
      },
      (err) => { }
    );
  }


  private carregarFormasPgto() {
    this.formaPgtService.get("").subscribe(
      (result) => {
        this.formasPagamentos = result;
      },
      (error) => {
        this.modalService.error({
          nzTitle: 'Falha ao carregar as formas de pagamento',
          nzContent: 'Não foi possível carregar a lista de formas de pagamento.'
        });
        console.log(error);
      });
  }

  public voltar(): void {
    this.router.navigateByUrl(AppRoutes.Caixa.base());
  }

  public salvar(): void {

    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Caixa>(this.form, this.caixa);

    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {

      //Verificar qual operaçao o usuário está querendo executar
      const operacao = this.novoRegistro 
        ? this.caixaService.add(this.caixa) 
        : this.caixaService.update(this.caixa);

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
            nzTitle: 'Falha ao registrar o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });

        })
    }
  }

  private carregarDados() {
    if (this.caixa) {
      this.form.get("dataCaixa").setValue(this.caixa.dataCaixa);
      this.form.get("usuarioId").setValue(this.caixa.usuarioId);
      this.form.get("formaPagamentoId").setValue(this.caixa.formaPagamentoId);
      this.form.get("observacao").setValue(this.caixa.observacao);

      this.form.get("quantidadeDeItens").setValue(this.caixa.quantidadeDeItens);
      this.form.get("quantidadeDeItens").disable();

      this.form.get("totalItens").setValue(this.caixa.totalItens);
      this.form.get("totalItens").disable();

      this.form.get("totalDesconto").setValue(this.caixa.totalDesconto);
      this.form.get("totalDesconto").disable();

      this.form.get("totalProdutos").setValue(this.caixa.totalProdutos);
      this.form.get("totalProdutos").disable();

      this.formaPagamentoSel = this.caixa.formaPagamentoId;

      this.caixaItens = this.caixa.itens;

    }
  }

  public editar(item: CaixaItem): void {
    this.abrirModalItem(item);
  }

  public excluir(item: CaixaItem): void {
    let prod = item.produto ? item.produto.nome : ""
    if (confirm(`Deseja excluir o registro ${prod}?`)) {

      const index = this.caixa.itens.indexOf(item);
      this.caixa.itens.splice(index, 1);
      this.forcarAtualizarTabelaItens();

      this.calcularTotais();

    }
  }

  public adicionar() {
    this.abrirModalItem(new CaixaItem());

  }

  private calcularTotais(){
    
    this.form.get("quantidadeDeItens").setValue(this.caixa.itens.length);

    let totalItens = 0;
    let totalDesconto = 0;
    let totalProdutos = 0;
    for (const item of this.caixa.itens) {
      
      totalItens += (item.precoUnitario * item.quantidade);

      totalDesconto += (item.quantidade * item.precoUnitario * (item.desconto / 100));

      totalProdutos += totalItens - totalDesconto;
    }

    this.form.get("totalItens").setValue(totalItens.toFixed(2));
    this.form.get("totalDesconto").setValue(totalDesconto.toFixed(2));
    this.form.get("totalProdutos").setValue(totalProdutos.toFixed(2));
  }

  public abrirModalItem(item: CaixaItem) {

    const modal = this.modalService.create<ModalItemCaixaComponent>({
      nzTitle: "Adicionar item",
      nzContent: ModalItemCaixaComponent,
      nzComponentParams: {
        caixaItem: item
      },
      nzWidth: 650,
      nzFooter: [
        {
          label: "Cancelar",
          onClick: () => modal.destroy(),
        },
        {
          label: "Salvar",
          type: "primary",
          onClick: (componentInstance) => {

            if (componentInstance.formValido() == false) {
              return;
            }

            const item = this.caixa.itens.find((item) => item.id == componentInstance.caixaItem.id);
            if (!item) {
              this.caixa.itens.push(componentInstance.caixaItem);
            }

            this.forcarAtualizarTabelaItens();

            this.calcularTotais();

            modal.destroy();
          },
        },
      ],
    });

  }

  private forcarAtualizarTabelaItens(){
    //Gambi! Ps o "data" do componente não reconhece a alteração então é necessário forçar uma atualização
    this.caixaItens = [];
    this.caixaItens = this.caixa.itens.filter((item) => true);
  }

}