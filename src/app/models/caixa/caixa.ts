import { v4 as uuidv4 } from 'uuid';
import { FormaPagamento } from '../forma-pagamento/forma-pagamento';
import { CaixaItem } from './caixa-item';

export class Caixa {
    public id: string
    public dataCaixa: Date
    public usuarioId: string    
    public formaPagamentoId: string    
    public formaPagamento: FormaPagamento
    public observacao: string
    public itens: CaixaItem[]
    public quantidadeDeItens: number
    public totalItens: number
    public totalDesconto: number
    public totalProdutos: number
    
    constructor(init?: Partial<Caixa>) {
        debugger;
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();            
            this.itens = [];            
        }
    }
}

 
 
 
 
 
 
 
 
 
 
 
 
 
 