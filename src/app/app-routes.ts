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
  Orcamento: {
    base: () => "orcamentos",
    Cadastro: () => { return AppRoutes.Orcamento.base() + "/cad-orcamento" },
  },
  Grupos: {
    base: () => "grupos",
    CadGrupo: () => { return AppRoutes.Grupos.base() + "/cad-grupo" }    
  },
  Fornecedores: {
    base: () => "fornecedores",
    CadFornecedor: () => { return AppRoutes.Fornecedores.base() + "/cad-fornecedor" }    
  },
  Produtos: {
    base: () => "produtos",
    CadProduto: () => { return AppRoutes.Produtos.base() + "/cad-produto" }    
  },
};