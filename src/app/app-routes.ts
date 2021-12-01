export const AppRoutes = {
  Login: {
    base: () => "login",    
  },
  Users: {
    base: () => "usuarios",
    CadUsuario: () => { return AppRoutes.Users.base() + "/cad-usuario" },
  },
  FormaPagamento: {
    base: () => "forma-pagamento",
    Cadastro: () => { return AppRoutes.FormaPagamento.base() + "/cad-forma-pagamento" },
  },
  Caixa: {
    base: () => "caixas",
    Cadastro: () => { return AppRoutes.Caixa.base() + "/cad-caixa" },
  },
  Grupos: {
    base: () => "grupos",
    CadGrupo: () => { return AppRoutes.Grupos.base() + "/cad-grupo" }    
  },
  Fornecedores: {
    base: () => "fornecedores",
    CadFornecedor: () => { return AppRoutes.Fornecedores.base() + "/cad-fornecedor" }    
  },
  Produto: {
    base: () => "produtos",
    Cadastro: () => { return AppRoutes.Produto.base() + "/cad-produto" }    
  },
};