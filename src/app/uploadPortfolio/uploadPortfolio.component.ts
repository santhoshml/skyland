import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-uploadPortfolio',
  templateUrl: './uploadPortfolio.component.html',
  styleUrls: ['./uploadPortfolio.component.scss']
})
export class UploadPortfolioComponent implements OnInit {
  version: string | null = environment.version;
  selectedPlatform: string = "Online Platforms";
  hideSchwabInstr = true;
  hideEtradeInstr = true;
  hideTSInstr = true;
  hideIBInstr = true;
  isPlatformSelected = false;
  selectedPlatformKey:string;
  response: string;
  isUploadSuccess = false;

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });


  onlinePlatforms: Object[] = [
    {key: 'schwab', value: 'Charles Schwab'},
    {key: 'etrade', value: 'E-Trade'},
    {key: 'ts', value: 'Trade Station'},
    {key: 'ib', value: 'Interactive Brokers'}
  ];

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
) {}

  ngOnInit() {}

  get f(){
    return this.myForm.controls;
  }

  onFileChange(event:any) {
    this.isUploadSuccess=false;
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  viewDistribution(){
    console.log(`In viewDistributions`);
    this.router.navigate(['/distribution'], { replaceUrl: true });
  }

  submit(){
    const formData = new FormData();
    formData.append('list', this.myForm.get('fileSource').value);
   
    this.http.post(`${environment.serverUrl}/brokerage/${this.selectedPlatformKey}/portfolio`, formData)
      .subscribe(res => {
        console.log(res);
        this.myForm.reset();
        this.isUploadSuccess = true;
        // alert('Uploaded Successfully.');
      })
  }

  3(){

  }

  onSelectPlatform(selectedPlatform: string){
  console.log(`selectedPlatform: ${selectedPlatform}`);
    this.isPlatformSelected = true;
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

    // set the uplaoder
    // this.uploader = new FileUploader({
    //   url: `${environment.serverUrl}/brokerage/${this.selectedPlatform}/portfolio`,
    //   disableMultipart: false,
    //   autoUpload: true,
    //   method: 'post',
    //   itemAlias: 'list',
    //   allowedFileType: ['csv', 'xls', 'xlsx']
    // });
    // console.log(`url : ${environment.serverUrl}/brokerage/${this.selectedPlatformKey}/portfolio`);
    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    //      console.log('FileUpload:uploaded:', item, status, response);
    //      alert('File uploaded successfully');
    //  };
  }

  hideAllInstr(){
    this.hideSchwabInstr = true;
    this.hideEtradeInstr = true;
    this.hideTSInstr = true;
    this.hideIBInstr = true;
  }

  getOnlinePlatformValue(key:string){
    this.selectedPlatformKey = key;
    for(let plt of this.onlinePlatforms){
      if(plt["key"] === key)
        return plt["value"];
    }
  }
  

}
