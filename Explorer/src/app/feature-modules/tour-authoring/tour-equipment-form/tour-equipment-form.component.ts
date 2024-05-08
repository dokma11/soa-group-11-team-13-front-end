import { Component, OnInit, inject } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router'
import { addTourEquipmentMessage } from '../model/addTourEquipment-message.model';

@Component({
  selector: 'xp-tour-equipment-form',
  templateUrl: './tour-equipment-form.component.html',
  styleUrls: ['./tour-equipment-form.component.css']
})
export class TourEquipmentFormComponent implements OnInit{
  id:number
 route = inject(ActivatedRoute);
  equipment: Equipment[] =[]
  allEquipment: Equipment[] =[]
  //tour: Tour

  constructor(private service : TourAuthoringService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.getTourEquiupment();

    this.getAllEquipment();
   
  }

  getTourEquiupment(): void{
    this.service.getTourEquipment(this.id).subscribe({
      next: (result: any) => {
        this.equipment = result.equipment;
      },
      error: (err:any) =>{
        console.log(err);
      }
    })
  }

  getAllEquipment(): void{
    this.service.getEquipment().subscribe({
      next: (result: any) => {
        this.allEquipment = result.Equipment;
      },
      error: (err:any) =>{
        console.log(err);
      }
    })
  }
  onAddClicked(eqId: number): void {
      const addTourEquipmentMessage : addTourEquipmentMessage = {
        tourId : this.id.toString(),
        equipmentId : eqId.toString(),
      }

      this.service.addTourEquipment(addTourEquipmentMessage).subscribe({
        next: ( ) =>{
          this.getTourEquiupment();
        }
      })
  }

  checkIfAlreadyExists(eqId:number): boolean{
    return this.equipment.filter(eqp=> eqp.id === eqId).length > 0;
  }
  
  onRemoveClicked(eqId:number): void {
    this.service.deleteTourEquipment(this.id,eqId).subscribe({
      next: ( ) =>{
        this.getTourEquiupment();
      }
    })
  }
}
