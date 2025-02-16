import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IGenericLLM } from '../models/generics.model';
import { GenericService } from '../generics.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, DropdownModule, Textarea, ButtonModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFormComponent implements OnInit {
  genericForm: FormGroup;

  constructor(private route: ActivatedRoute, private genericService: GenericService, private fb: FormBuilder, private router: Router) {
    this.genericForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public generic: IGenericLLM | null = null;
  public genericId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.genericId) {
      this.generic = await this.genericService.getGeneric(this.genericId);
      if (this.generic) {
        this.genericForm.patchValue(this.generic);
      }
    }
  }

  async onSubmit() {
    if (this.genericForm.valid) {
      const generic = await this.genericService.saveGeneric(this.genericForm.value);
      debugger;
      this.router.navigate(['../', generic.id], { relativeTo: this.route });
    }
  }
}
