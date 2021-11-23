import { v4 as uuidv4 } from 'uuid';

export class Fornecedor {
    public id: string
    public codigoExterno: string
    public ativo: boolean
    public nome: string
    public razaoSocial: string
    public cnpj: string
    public rua: string
    public numero: string
    public complemento: string
    public bairro: string
    public estadoId: string
    public cidadeId: string
    public cep: string
    public fone: string
    public email: string

    constructor(init?: Partial<Fornecedor>) {
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();
        }
    }
}

