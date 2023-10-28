
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { getMatInputUnsupportedTypeError } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/_services/shared.service';


@Component({
  selector: 'app-bounty-history-card',
  templateUrl: './bounty-history-card.component.html',
  styleUrls: ['./bounty-history-card.component.css']
})
export class BountyHistoryCardComponent implements OnInit,AfterViewInit {
public label:string;
public summary=[];
public bounty:any;
@Input() public data:any;
@Input() public idx:number;
@Output() public closeEvent=new EventEmitter<any>()
@Input()public method;
dataSource: MatTableDataSource<any>;
public baseUrl = environment.apiBase;

summaryText = []

private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.applyFilter('');
    }
  }

  constructor(private route:ActivatedRoute,private http:HttpClient,private router:Router,public sharedService: SharedService) { }
  columns: string[];
  displayedColumns = ['brand_name'];
  ngOnInit(): void {
  this.http.post(this.baseUrl+"/"+"cards/"+this.method,{}).subscribe((data:any)=>{
    let summary=data?.actions.result.summary
    let summaryText=data?.actions.result.summaryText
    console.log(57, summary)
    console.log(59, summaryText)

    this.summaryText = summaryText

    this.dataSource = new MatTableDataSource(summary);
    this.columns= Object.keys(summary[0]).filter(function(x:string){
              if(x=='brand_name'){
                return x;
              }
              if(x=='name'){
                return x;
              }
              if(x=='content_type'){
                return x;
              }
              if(x=='pipeline'){
                return x;
              }
            })
          
  },err=>{
    console.log(err.message );
  }) 

  
  }
  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;

  }
  
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  onCloseClick(){
  this.closeEvent.emit({"message":true})
  }
  onCellClick(row:any){
    console.log("row",row)
    this.http.post(this.baseUrl+"/"+"cards/getBounty",{"_id":row._id},{}).subscribe((bounty:any)=>{
      this.sharedService._variableData=bounty.actions.result;
      this.router.navigate(['bounty-detail'])
      //console.log("bounty-data",bounty)
    })
  }
}
 

 