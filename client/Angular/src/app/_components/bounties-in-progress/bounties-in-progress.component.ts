import { Component, OnInit } from '@angular/core';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { FlexibleTableService } from '../flexible-table/services/flexible-table-service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bounties-in-progress',
  templateUrl: './bounties-in-progress.component.html',
  styleUrls: ['./bounties-in-progress.component.css']
})
export class BountiesInProgressComponent implements OnInit {

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
