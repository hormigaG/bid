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
  @ViewChild('search') searchElement: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public ConfigService: ConfigService,
    public HoneyService: HoneyService,
    //public barcodeProvider: BarcodeProvider,
    private changeDetectorRef: ChangeDetectorRef,
    public events: Events
  ) {}

  ngOnInit(): void {
    this.inputMethod = this.ConfigService.params.scanMethod;
    this.showLog = this.ConfigService.params.showLog;
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    let parent = this;

    // this.HoneyService.startBarcode();
    this.HoneyService.BarcodeData.subscribe((res: any) => {
      this.changeDetectorRef.detectChanges();

      if (parent.inputMethod == 'textBus' && res) {
        this.searchByCode.emit(res);
        parent.changeDetectorRef.detectChanges();
      }
    });
    //this.HoneyService.testInput();

    //this.HoneyService.stopBarcode();
  }
  ngOnChanges(): void {
    if (this.inputMethod == 'textBus') {
      this.searchForm = this.formBuilder.group({
        search: ['', Validators.required],
      });
    } else {
      this.textBus = '';
      console.log(this.searchElement);
      //this.searchElement.nativeElement.focus();
      //console.log(document.getElementById('bus'));
      //TODO: NO SE COMO HACER EL FOCUS
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
