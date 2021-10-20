import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  ElementRef,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'read-code',
  templateUrl: './read-code.component.html',
  styleUrls: ['./read-code.component.css'],
})
export class ReadCodeComponent implements OnInit {
  @Output() searchByCode = new EventEmitter<any>();
  @Input() inputMethod: string = '';
  textBus: string = '';
  searchForm: FormGroup;
  @ViewChild('search') searchElement: ElementRef;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
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
