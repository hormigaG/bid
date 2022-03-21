import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../../_services/config.service';
import { HoneyService } from '../../../_services/honey.service';
//import { BarcodeProvider } from '../../../_services/intent.service';
import { Events } from '../../../_services/events.service';
import { ScanService } from '../../../_services/scan.service';
import * as barcode from '../../../../assets/js/BarcodeReader/BarcodeReader.js';
import { AlertService } from '../../../_services/alert.service';
/*
  TODO:

  Ahora este componente emite un string y deeberia emitir un objeto
  siempre emite code que es el codigo que lee
  {code-> codigo}
  otros atributos que puede emitir
  - inputMethod -> desde donde lee (si lee desde el teclado o desde zebra o otro)
  - Tipo de codigo (si es code 39 etc)
  Y lo importante
  -------------
  unit -> unidad de medida (id de unidad de medida)
  qty -> cantidad 
  como se va a comportar esto 
  Creamos el parametro identificador de mascara (parametro) -> !
  
  si el codido de barra que leemos comienza con el (!) identificador de mascara
  hacemos un split('!')
  si leo  585558858 -> {'code' :'585558858'}
  si leo  !585558858!008!558 -> {'code' :'585558858', 'unit': 008, 'qty':558}
*/

@Component({
  selector: 'read-code',
  templateUrl: './read-code.component.html',
  styleUrls: ['./read-code.component.css'],
})
export class ReadCodeComponent implements OnInit {
  @Output() searchByCode = new EventEmitter<any>();
  @Input() inputMethod: string = '';
  textBus: string = '';
  showLog: boolean = false;
  searchForm: FormGroup;
  log: string = '';
  @ViewChild('search') searchElement: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public ConfigService: ConfigService,
    public HoneyService: HoneyService,
    //public barcodeProvider: BarcodeProvider,
    private changeDetectorRef: ChangeDetectorRef,
    public events: Events,
    private scanService: ScanService,
    private alertService: AlertService
  ) {}
  startScan() {
    var defaultReader;
    var self = this;
    function onCommitComplete(resultArray) {
      if (resultArray.length > 0) {
        for (var i = 0; i < resultArray.length; i++) {
          var result = resultArray[i];
          if (result.status !== 0) {
            if (
              result.method === 'getBuffered' ||
              result.method === 'setBuffered'
            ) {
            }
          } //endfor
        }
      }
    }
    function onBarcodeDataReady(data, type, time) {
      self.searchByCode.emit(data);
    }

    function onSetBufferedComplete(result) {
      if (result.status !== 0) {
      }
    }
    function onBeforeUnload(e) {
      var message = 'Please close BarcodeReader before leaving this page.';
      (e || window.event).returnValue = message;
      return message;
    }
    function onBarcodeReaderComplete(result) {
      if (result.status === 0) {
        defaultReader.setBuffered(
          'Symbology',
          'Code39',
          'Enable',
          'true',
          onSetBufferedComplete
        );
        defaultReader.setBuffered(
          'Symbology',
          'Code128',
          'EnableCode128',
          'true',
          onSetBufferedComplete
        );
        defaultReader.commitBuffer(onCommitComplete);
        // Add an event handler for the barcodedataready event
        defaultReader.addEventListener(
          'barcodedataready',
          onBarcodeDataReady,
          false
        );
        // Add an event handler for the window's beforeunload event
        window.addEventListener('beforeunload', onBeforeUnload);
      } else {
        defaultReader = null;
      }
    }
    if (!defaultReader) {
      defaultReader = new barcode.BarcodeReader(null, onBarcodeReaderComplete);
    }
  }

  ngOnInit(): void {
    this.inputMethod = this.ConfigService.params.scanMethod;
    this.showLog = this.ConfigService.params.showLog;
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    let parent = this;
    //this.startScan();

    /* 
    this.HoneyService.BarcodeData.subscribe((res: any) => {
      this.changeDetectorRef.detectChanges();

      if (parent.inputMethod == 'textBus' && res) {
        this.searchByCode.emit(res);
        parent.changeDetectorRef.detectChanges();
      }
    }); */
  }
  ngOnChanges(): void {
    if (this.inputMethod == 'textBus') {
      this.searchForm = this.formBuilder.group({
        search: ['', Validators.required],
      });
    } else {
      this.textBus = '';
      console.log(this.searchElement);
    }
  }
  formSearch() {
    const search = this.searchForm.controls.search.value;

    this.searchByCode.emit(search);
  }
  @HostListener('document:keypress', ['$event'])
  handleKeyboardpressEvent(event: KeyboardEvent) {
    if (this.inputMethod != 'textBus') {
      return;
    }
    if (event.keyCode == 13) {
      this.searchByCode.emit(this.textBus);
      this.textBus = '';
    } else {
      this.textBus += event.key;
      event.stopPropagation();
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.inputMethod != 'textBus') {
      return;
    }
    if (event.keyCode == 27) {
      this.textBus = '';
    } else if (event.keyCode == 8) {
      this.textBus = this.textBus.substring(0, this.textBus.length - 1);
    }
  }
}
