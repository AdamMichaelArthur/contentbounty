import { Component, OnInit, Input } from '@angular/core';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { Router } from '@angular/router';
import { UntypedFormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { FormsModule, NgForm } from '@angular/forms';
import { FlexibleTableService } from '../flexible-table/services/flexible-table-service';


@Component({
  selector: 'app-disbursements',
  templateUrl: './disbursements.component.html',
  styleUrls: ['./disbursements.component.css']
})
export class DisbursementsComponent {

  constructor(
    private flexService: FlexibleTableService,
    formBuilder: UntypedFormBuilder
  ) {
    }

}
