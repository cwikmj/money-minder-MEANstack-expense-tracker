import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-operation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-operation.component.html',
  styleUrl: './add-operation.component.scss'
})
export class AddOperationComponent implements OnInit {
  @Input() operationData: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  operationForm!: FormGroup;
  categories: string[] = ['Food', 'Groceries', 'Transportation', 'Housing/Rent', 'Utilities', 'Car', 'Clothing', 'Entertainment', 'Tax/Insurance', 'Salary', 'Part-time Job', 'Freelance Work'];
  filteredCategories: string[] = ['Salary', 'Part-time Job', 'Freelance Work'];
  isActive: boolean = false;

  constructor() {
    this.operationForm = new FormGroup({
      type: new FormControl('expense', Validators.required),
      category: new FormControl('', Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      _id: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.filteredCategories = this.categories.slice(0, 9);
  }

  open(operation: any | null) {
    this.isActive = true;
    if (operation) {
      this.operationForm.patchValue({
        type: operation.type,
        category: operation.category,
        amount: operation.amount,
        description: operation.description,
        _id: operation._id
      });

      if (operation.type === 'expense') {
        this.filteredCategories = this.categories.slice(0, 9);
      } else if (operation.type === 'income') {
        this.filteredCategories = ['Salary', 'Part-time Job', 'Freelance Work'];
      }
    } else {
      this.clearForm()
    }
  }

  close() {
    this.isActive = false;
    this.clearForm();
  }

  onTypeChange(event: Event) {
    const selected = (event.target as HTMLInputElement).value;
    if (selected === 'expense') {
      this.filteredCategories = this.categories.slice(0, 9);
    } else if (selected === 'income') {
      this.filteredCategories = ['Salary', 'Part-time Job', 'Freelance Work'];
    }

    this.operationForm.get('category')?.reset('');
  }

  onSubmit() {
    if (this.operationForm.valid) {
      this.formSubmit.emit(this.operationForm.value);
      this.clearForm();
      this.isActive = false;
    }
  }

  clearForm() {
    this.operationForm.reset({
      type: 'expense',
      category: '',
      amount: null,
      description: ''
    });
    this.filteredCategories = this.categories.slice(0, 9);
  }
}