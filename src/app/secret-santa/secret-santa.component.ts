import { Component, OnInit } from '@angular/core';
import { FileService } from '../../shared/services/file.services';
import * as XLSX from 'xlsx';
import { IEmployee } from '../../shared/models/employee.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-secret-santa',
  imports: [FormsModule],
  templateUrl: './secret-santa.component.html',
  styleUrl: './secret-santa.component.scss'
})
export class SecretSantaComponent implements OnInit {
  importedFileData: IEmployee[] = [];
  secretFileData: IEmployee[] = [];
  fileName: string = "";
  file: File = new File([], "");
  previousSecretFile: File = new File([], "");
  downloadBtn = true;
  importBtn = true;
  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.importedFileDataSub.subscribe((data) => {
      this.importedFileData = data;
      console.log(this.importedFileData);
    });

    this.fileService.secretFileDataSub.subscribe((data) => {
      this.secretFileData = data;
      //this.assignSecretChild();
      console.log(this.secretFileData);
    });
  }

  importData(event: any) {
    this.downloadBtn = true;
    this.importBtn = false;
    this.file = event.target.files[0];
  }

  previousSecret(event: any) {
    this.previousSecretFile = event.target.files[0];
  }

  excelToJson(event: Event) {
    if (this.file.size > 0 && this.previousSecretFile.size > 0) {
      this.fileService.importDataFromCSV(this.file, 'input');
      this.fileService.importDataFromCSV(this.previousSecretFile, 'secret');
    }
    else if(this.file) {
      this.fileService.importDataFromCSV(this.file, 'input');
    }
    this.downloadBtn = false;
  }

  assignSecretChild(): void {
    if(this.importedFileData.length < 0) {
      console.error('Error, The excel is empty!!');
    }

    let pickedElements: IEmployee[] = [];
    let randomIndex;
    let randomElement: IEmployee;

    this.importedFileData.map((employee) => {
      do {
        randomIndex = Math.floor(Math.random() * this.importedFileData.length);
        randomElement = this.importedFileData[randomIndex];
      } while(pickedElements.includes(randomElement) && this.secCondCheck(randomElement, employee));

      employee.Secret_Child_EmailID = randomElement.Employee_EmailID;
      employee.Secret_Child_Name = randomElement.Employee_Name;
      pickedElements.push(randomElement);
    });

    console.log(this.importedFileData);
  }

  secCondCheck(randomElement: IEmployee, employee: IEmployee): boolean {
    if(this.secretFileData.length > 0) {
      let secretElement = this.secretFileData.filter((sec) => {
        sec.Employee_EmailID == employee.Employee_EmailID;
      });
      if(secretElement[0].Secret_Child_EmailID != employee.Secret_Child_EmailID) {
        return true;
      }
    }

    if(randomElement != employee) {
      return true;
    }
    return false;
  }

  downloadFile(event: Event): void {
    this.assignSecretChild();
    this.fileService.exportToExcel(this.importedFileData, this.fileName);
  }
}
