import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProdutoService } from 'src/app/data-services/produto.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { CaixaItem } from 'src/app/models/caixa/caixa-item';
import { Produto } from 'src/app/models/produtos/produto';

@Component({
  selector: 'app-modal-item-caixa',
  templateUrl: './modal-item-caixa.component.html',
  styleUrls: ['./modal-item-caixa.component.scss']
})
export class ModalItemCaixaComponent implements OnInit {


  public caixaItem: CaixaItem

  public saldoEstoque:Number;

  public form: FormGroup = new FormGroup({
    produtoId: new FormControl(null, [Validators.required]),
    observacao: new FormControl(null),
    quantidade: new FormControl(1, [Validators.required]),
    precoUnitario: new FormControl(1, [Validators.required]),
    desconto: new FormControl(0, [Validators.min(0)]),
    totalUnitario: new FormControl(0),
    totalItem: new FormControl(0),
  });

  public produtos: Produto[] = [];
  public carregandoProdutos: boolean = false;
  public produtoSel: string;

  constructor(
    private produtoService: ProdutoService,
    private modalService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarDados();    
  }

  private carregarDados() {

    this.form.get("produtoId").setValue(this.caixaItem.produtoId);
    this.form.get("observacao").setValue(this.caixaItem.observacao);
    this.form.get("quantidade").setValue(this.caixaItem.quantidade);
    this.form.get("precoUnitario").setValue(this.caixaItem.precoUnitario);
    this.form.get("desconto").setValue(this.caixaItem.desconto);

    this.form.get("totalUnitario").setValue(this.caixaItem.totalUnitario);
    this.form.get("totalUnitario").disable();

    this.form.get("totalItem").setValue(this.caixaItem.totalItem);
    this.form.get("totalItem").disable();

    var produto = this.caixaItem.produto;
    if (produto) {
      this.produtoSel = produto.id;
    }

    this.calcularTotais();
  }

  private carregarProdutos() {
    this.produtoService.get("").subscribe(
      (result) => {
        this.carregandoProdutos = false;
        this.produtos = result;
      },
      (error) => {
        this.carregandoProdutos = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os produtos',
          nzContent: 'Não foi possível carregar a lista de produtos.'
        });
        console.log(error);
      });
  }

  public produtoOnChange(event) {

    var produto = this.produtos.find((p) => p.id == event)
    if (produto) {
      this.form.get("precoUnitario").setValue(produto.precoVenda);
      this.caixaItem.produto = produto;
      this.calcularTotais();
    }
  }

  public calcularTotais() {
    
    let precoVenda = Number(this.form.get("precoUnitario").value)
    let quantidade = Number(this.form.get("quantidade").value)
    let desconto = Number(this.form.get("desconto").value)

    let totalUni = precoVenda * quantidade;
    let totalDesconto = (precoVenda * (desconto / 100)) * quantidade;
    let totalItem = totalUni - totalDesconto;

    this.form.get("totalUnitario").setValue(totalUni);
    this.form.get("totalItem").setValue(totalItem);

    this.caixaItem.totalUnitario = totalUni;
    this.caixaItem.totalItem = totalItem;
  }

  public formValido(): boolean{

    this.calcularTotais();    

    AssignFormHelper.assignFormValues<CaixaItem>(this.form, this.caixaItem);

    return this.form.valid;
  }

}