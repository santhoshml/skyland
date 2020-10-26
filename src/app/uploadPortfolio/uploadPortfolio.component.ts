import { Component, OnInit, EventEmitter } from '@angular/core';

import { environment } from '@env/environment';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
  selector: 'app-uploadPortfolio',
  templateUrl: './uploadPortfolio.component.html',
  styleUrls: ['./uploadPortfolio.component.scss'],
})
export class UploadPortfolioComponent implements OnInit {
  version: string | null = environment.version;
  selectedPlatform: string = "Online Platforms";
  hideSchwabInstr = true;
  hideEtradeInstr = true;
  hideTSInstr = true;
  hideIBInstr = true;

  public uploader: FileUploader = new FileUploader({
    url: `${environment.serverUrl}/brokerage/${this.selectedPlatform}/portfolio`,
    disableMultipart: false,
    autoUpload: false,
    method: 'post',
    itemAlias: 'list',
    allowedFileType: ['image', 'pdf']
  });

  onlinePlatforms: Object[] = [
    {key: 'schwab', value: 'Charles Schwab'},
    {key: 'etrade', value: 'E-Trade'},
    {key: 'ts', value: 'Trade Station'},
    {key: 'ib', value: 'Interactive Brokers'}
  ];

  constructor() {}

  ngOnInit() {}

  onSelectPlatform(selectedPlatform: string){
    console.log(`selectedPlatform: ${selectedPlatform}`);
    this.hideAllInstr();
    this.selectedPlatform = this.getOnlinePlatformValue(selectedPlatform);
    if(selectedPlatform === 'schwab'){
      this.hideSchwabInstr = false;
    } else if(selectedPlatform === 'etrade'){
      this.hideEtradeInstr = false;
    } else if(selectedPlatform === 'ts'){
      this.hideTSInstr = false;
    } else if(selectedPlatform === 'ib'){
      this.hideIBInstr = false;
    }
  }

  hideAllInstr(){
    this.hideSchwabInstr = true;
    this.hideEtradeInstr = true;
    this.hideTSInstr = true;
    this.hideIBInstr = true;
  }

  getOnlinePlatformValue(key:string){
    for(let plt of this.onlinePlatforms){
      if(plt["key"] === key)
        return plt["value"];
    }
  }

  onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    console.log(file);
  }

  

}
