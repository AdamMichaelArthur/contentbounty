import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxElementsRoutingModule } from './box-elements-routing.module';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadStatusComponent } from './upload-status/upload-status.component';
import { ContentExplorerComponent } from './content-explorer/content-explorer.component';
import { DownloaderComponent } from './downloader/downloader.component';


@NgModule({
  declarations: [UploaderComponent, UploadStatusComponent, ContentExplorerComponent, DownloaderComponent],
  imports: [
    CommonModule,
    BoxElementsRoutingModule
  ]
})
export class BoxElementsModule { }
