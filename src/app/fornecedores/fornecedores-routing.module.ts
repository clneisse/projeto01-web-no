import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadFornecedorComponent } from './pages/cad-fornecedor/cad-fornecedor.component';
import { FornecedorComponent } from './pages/fornecedores/fornecedores.component';


const routes: Routes = [
  { path: '', component: FornecedorComponent },
  { path: 'cad-fornecedor', component: CadFornecedorComponent },
  { path: 'cad-fornecedor/:id', component: CadFornecedorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedoresRoutingModule { }
