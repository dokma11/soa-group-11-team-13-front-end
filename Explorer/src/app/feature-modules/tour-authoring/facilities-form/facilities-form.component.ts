import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TourAuthoringService } from "../tour-authoring.service";
import { Facilities } from "../model/facilities.model";
import {
    PublicFacilityRequest,
    PublicStatus,
} from "../model/public-facility-request.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Person } from "../../stakeholder/model/person.model";
import { User } from "src/app/infrastructure/auth/model/user.model";

@Component({
    selector: "xp-facilities-form",
    templateUrl: "./facilities-form.component.html",
    styleUrls: ["./facilities-form.component.css"],
})
export class FacilitiesFormComponent implements OnChanges {
    @Output() facilitiesUpdated = new EventEmitter<null>();
    @Input() facility: Facilities;
    @Input() shouldEdit: boolean = false;
    tourImage: string | null = null;
    tourImageFile: File | null = null;
    constructor(
        private service: TourAuthoringService,
        private authService: AuthService,
    ) {}

    options = [
        { value: "0", label: "Restaurant" },
        { value: "1", label: "Parking Lot" },
        { value: "2", label: "Toilet" },
        { value: "3", label: "Hospital" },
        { value: "4", label: "Cafe" },
        { value: "5", label: "Pharmacy" },
        { value: "6", label: "Exchange Office" },
        { value: "7", label: "Bus Stop" },
        { value: "8", label: "Shop" },
        { value: "9", label: "Other" },
    ];

    selectedOption: string | null;
    newLongitude: number = 0;
    newLatitude: number = 0;
    isAddButtonDisabled: boolean = false; //bilo je true
    isPublicChecked = false;
    person: Person;
    imagePath:string;
    user: User | undefined;

    ngOnInit(): void {
        this.getPerson();
    }
    ngOnChanges(): void {
        this.facilitiesForm.reset();
        if (this.shouldEdit) {
            const facilityToPatch = {
                name: this.facility.Name || null,
                description: this.facility.Description || null,
                imagePath: this.facility.ImagePath || null,
                category: this.facility.category.toString() || null,
                longitude: this.facility.Longitude.toString() || null,
                latitude: this.facility.Latitude.toString() || null,
            };
            this.facilitiesForm.patchValue(facilityToPatch);
        }
    }

    facilitiesForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        imagePath: new FormControl("", [Validators.required]),
        category: new FormControl("", [Validators.required]),
        longitude: new FormControl("", [Validators.required]),
        latitude: new FormControl("", [Validators.required]),
        isPublicChecked: new FormControl<boolean>(false),
    });

    addFacility(): void {
        const facility: Facilities = {
            Name: this.facilitiesForm.value.name || "",
            Description: this.facilitiesForm.value.description || "",
            ImagePath: this.facilitiesForm.value.imagePath || "",
            category: this.selectedOption
                ? parseInt(this.selectedOption, 10)
                : 0,
            Longitude:
                parseFloat(this.facilitiesForm.value.longitude || "0") || 0,
            Latitude:
                parseFloat(this.facilitiesForm.value.latitude || "0") || 0,
        };

        if (this.newLatitude != 0 && this.newLongitude != 0) {
            facility.Longitude = this.newLongitude;
            facility.Latitude = this.newLatitude;
            facility.AuthorId = this.user?.id;
            
            this.service.uploadImage(this.tourImageFile!).subscribe({
                next: (imagePath: string) => {
                    facility.ImagePath=imagePath;
                    this.service.addFacility(facility).subscribe({
                        next: result => {
                            this.facilitiesUpdated.emit();
                            if (this.facilitiesForm.value.isPublicChecked) {
                                const request: PublicFacilityRequest = {
                                    facilityId: result.ID as number,
                                    status: PublicStatus.Pending,
                                    authorName:
                                        this.person.name + " " + this.person.surname,
                                };
                                this.service
                                    .addPublicFacilityRequest(request)
                                    .subscribe({
                                        next: result=>{
                                            location.reload();
                                        }
                                    });
                            }else{
                                location.reload();
                            }
                        },
                    });
                }})
        } else {
            alert("You have to choose the location on the map");
        }
    }

    updateFacility(): void {
        const facility: Facilities = {
            Name: this.facilitiesForm.value.name || "",
            Description: this.facilitiesForm.value.description || "",
            ImagePath: this.facilitiesForm.value.imagePath || "",
            category: this.selectedOption
                ? parseInt(this.selectedOption, 10)
                : 0,
            Longitude:
                parseFloat(this.facilitiesForm.value.longitude || "0") || 0,
            Latitude:
                parseFloat(this.facilitiesForm.value.latitude || "0") || 0,
        };

        if (this.selectedOption == null) {
            facility.category = this.facility.category;
        }

        facility.ID = this.facility.ID;
        facility.AuthorId = this.user?.id;

        if (this.newLatitude != 0 && this.newLongitude != 0) {
            facility.Longitude = this.newLongitude;
            facility.Latitude = this.newLatitude;
        }
        this.service.uploadImage(this.tourImageFile!).subscribe({
            next: (imagePath: string) => {
                facility.ImagePath = imagePath;
                this.service.updateFacility(facility).subscribe({
                    next: _ => {
                        this.facilitiesUpdated.emit();
                        location.reload();
                    },
                });
            },
        });
        
    }

    getPerson(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.service.getPerson(user.id).subscribe(result => {
                this.person = result;
            });
        });
    }
    
    onSelectImage(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files[0]) {
            this.tourImageFile = element.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(this.tourImageFile);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.tourImage = reader.result as string;
                this.facilitiesForm.value.imagePath = "";
            };
        }
    }
}
