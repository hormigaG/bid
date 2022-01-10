import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../_services/stock.service';
import { LogService } from '../../../_services/log.service';

@Component({
  selector: 'app-mov-int',
  templateUrl: './mov-int.component.html',
  styleUrls: ['./mov-int.component.css'],
})
export class MovIntComponent implements OnInit {
  pickings: any = [];
  filter: any = [];
  filters: any = [];
  isCollapsed: boolean = true;
  spinner = true;

  inputMethod: String = 'textBus';

  constructor(public stockService: StockService) {}

  ngOnInit(): void {
    this.getPicking();
  }

  searchByCode(code) {
    console.log(code);
  }

  getPicking() {
    let leaf = [
      ['state', 'in', ['assigned', 'draft', 'partially_available']],
      ['picking_type_id.code', '=', 'internal'],
    ];
    let dateExpected = this.filters.filter(
      (filter) => filter.name == 'scheduled_date'
    );
    if (dateExpected.length) {
      dateExpected = this.makeDateLeaf(
        dateExpected[0]['value']['fromDate'],
        dateExpected[0]['value']['toDate']
      );
    } else if (!this.filters.length) {
      dateExpected = this.makeDateLeaf(
        this.parseDateObject(new Date()),
        undefined
      );

      this.filters.push({
        label: 'Ingresos hasta hoy',
        value: { fromDate: this.parseDateObject(new Date()) },
        name: 'scheduled_date',
      });
    }
    leaf.push(...dateExpected);
    this.stockService.getPicking(leaf).subscribe((res) => {
      this.pickings = res['records'];
      this.spinner = false;
    });
  }

  goPicking(item) {
    console.log(item);
  }
  dateRange(value) {
    const index = this.filters.findIndex((e) => e.name == 'scheduled_date');
    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    if (value.fromDate && value.toDate) {
      const fromDate =
        value.fromDate.day +
        '/' +
        value.fromDate.month +
        '/' +
        value.fromDate.year;
      const toDate =
        value.toDate.day + '/' + value.toDate.month + '/' + value.toDate.year;
      this.filters.push({
        label: fromDate + ' a ' + toDate,
        value: {
          fromDate: this.parseDate(value.fromDate),
          toDate: this.parseDate(value.toDate),
        },
        name: 'scheduled_date',
      });
    } else if (value.fromDate) {
      const fromDate =
        value.fromDate.day +
        '/' +
        value.fromDate.month +
        '/' +
        value.fromDate.year;
      this.filters.push({
        label: fromDate,
        value: { fromDate: this.parseDate(value.fromDate) },
        name: 'scheduled_date',
      });
    }
    this.spinner = true;

    this.getPicking();
  }

  makeDateLeaf(fromDate, toDate) {
    let leaf: any = [];
    if (!toDate) {
      toDate = fromDate;
    }
    leaf.push(['scheduled_date', '>=', fromDate + ' 00:00:00']);
    leaf.push(['scheduled_date', '<', toDate + ' 23:59:59']);
    return leaf;
  }

  private parseDate(date) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    return (
      date.year + '-' + zeroPad(date.month, 2) + '-' + zeroPad(date.day, 2)
    );
  }
  private parseDateObject(date) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    return (
      date.getFullYear() +
      '-' +
      zeroPad(date.getMonth() + 1, 2) +
      '-' +
      zeroPad(date.getDate(), 2)
    );
  }
  refresh() {
    this.spinner = true;
    this.filters = [];
    this.getPicking();
  }
}
