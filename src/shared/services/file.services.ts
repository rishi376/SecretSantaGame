import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IEmployee } from "../models/employee.model";


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})

export class FileService {
    importedFileDataSub = new BehaviorSubject([]);
    secretFileDataSub = new BehaviorSubject([]);

    importDataFromCSV(file: File, type: string) {
        try {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const book = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = book.SheetNames[0];
                const sheet = book.Sheets[sheetName];
    
                if(type == 'input') {
                    this.importedFileDataSub.next(XLSX.utils.sheet_to_json(sheet, { raw: true }));
                    console.log('Excel data:', this.importedFileDataSub);
                }
                else if (type == 'secret') {
                    this.secretFileDataSub.next(XLSX.utils.sheet_to_json(sheet, { raw: true }));
                    console.log('Excel data:', this.secretFileDataSub);
                }
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.log(error);
        }
    }

    exportToExcel(json: IEmployee[], excelFileName: string): void {
        try {
            const worksheet = XLSX.utils.json_to_sheet(json);
            const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet}, SheetNames: ['data']};
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array'});
            this.SaveAsExcelFile(excelBuffer, excelFileName);
        } catch (error) {
            console.log(error);
        }
    }

    SaveAsExcelFile(buffer: any, fileName: string): void {
        fileName = fileName || 'result';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}