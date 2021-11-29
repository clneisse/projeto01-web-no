import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaixasRoutingModule } from './caixas-routing.module';
import { CaixaComponent } from './pages/componentes/caixa/caixa.component';
import { CadCaixaComponent } from './pages/componentes/cad-caixa/cad-caixa.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ModalItemCaixaComponent } from './pages/componentes/modal-item-caixa/modal-item-caixa.component';

@NgModule({
  declarations: [
    CaixaComponent,
    CadCaixaComponent,
    ModalItemCaixaComponent
  ],
  imports: [
    CommonModule,
    CaixasRoutingModule,
    NzPageHeaderModule,
    NzLayoutModule,    
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,       
    NzTableModule,
    NzPaginationModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzImageModule,
    NzDatePickerModule
  ]
})
export class CaixasModule { }