import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ChipFilter } from 'src/app/core/interfaces/chip-filter.interface';
import { IonButton, IonIcon, IonAccordion, IonLabel, IonItem, AnimationController } from '@ionic/angular/standalone';

import { listOutline, chevronUpOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-chips-filter',
  templateUrl: './chips-filter.component.html',
  styleUrls: ['./chips-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon,IonAccordion, IonLabel, IonItem]
})
export class ChipsFilterComponent implements OnInit {
  @ViewChildren('templateList', { read: ElementRef })
  templateListRef: QueryList<ElementRef>;
  
  @Input({ required: true })
  public items: ChipFilter[];

  public filteredItems: ChipFilter[];
  public MAX_TOKENS = 3;
  public selectedItems: ChipFilter[] = [];
  public expandedChips = false;

  @Output()
  public filterChange = new EventEmitter<string[]>();

  constructor(
    private animationCtrl: AnimationController,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    addIcons({ listOutline, chevronUpOutline });
  }

  public ngOnInit(): void {
    this.filteredItems = this.items.slice(0, this.MAX_TOKENS);
  }

  public playListAnimation(): void {
    const itemRefArray = this.templateListRef.toArray();
    
    for (let i = this.MAX_TOKENS; i < itemRefArray.length; i++) {
      const element = itemRefArray[i].nativeElement;

      this.animationCtrl
        .create()
        .addElement(element)
        .duration(300)
        .delay(i * 10)
        .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1')
        .play();
    }
  }

  public selectFilter(changedItem: ChipFilter): void {
    changedItem.selected = !changedItem.selected;

    this.filterChange.emit(this.items.filter((item) => item.selected).map((item) => item.id));
  }

  public toggleAllFiltersView(): void {
    this.expandedChips = !this.expandedChips;

    if (this.expandedChips) {
      this.filteredItems = this.items;

      this.changeDetectorRef.detectChanges();
      
      this.ngZone.runOutsideAngular(() => {
        this.playListAnimation();
      });
    } else {
      this.filteredItems = this.items.slice(0, this.MAX_TOKENS);
    }
  }
}