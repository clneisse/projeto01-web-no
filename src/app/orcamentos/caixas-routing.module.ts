import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadCaixaComponent } from './pages/cad-caixa/cad-caixa.component';
import { CaixaComponent } from './pages/caixa/caixa.component';

const routes: Routes = [
  { path: '', component: CaixaComponent },
  { path: 'cad-caixa', component: CadCaixaComponent },
  { path: 'cad-caixa/:id', component: CadCaixaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaixasRoutingModule { }