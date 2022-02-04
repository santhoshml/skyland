import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from './header/header.service';
import { Shell } from './shell.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  @ViewChild('content') content;
  submitted = false;
  welcomeForm!: FormGroup;
  accountAlreadyExist = false;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private header: HeaderService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    const credentials = this.credentialsService.credentials;
    if (!credentials) {
      setTimeout(() => {
        this.openModal();
      }, 2000);
    }

    this.welcomeForm = this.formBuilder.group({
      email: ['', Validators.required],
      displayName: ['', Validators.required],
    });
  }

  openModal() {
    this.modalService.open(this.content, { centered: true, size: 'xl', windowClass: 'xl-modal' });
  }

  onBlurMethod() {
    this.submitted = false;
    this.accountAlreadyExist = false;
  }

  login() {
    this.submitted = true;
    if (!this.welcomeForm.valid) {
      return;
    }
    this.header.signupWithoutPassword(this.welcomeForm.value).subscribe(
      (data) => {
        if (data.token) {
          localStorage.setItem('credentials', JSON.stringify(data));
          window.location.reload();
        }
      },
      () => {
        this.accountAlreadyExist = true;
      }
    );
  }
}
