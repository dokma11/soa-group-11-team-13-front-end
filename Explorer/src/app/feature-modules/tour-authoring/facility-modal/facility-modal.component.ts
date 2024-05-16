import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { KeyPoint } from "../model/key-point.model";
import { TourAuthoringService } from "../tour-authoring.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { KeyPointEncounterFormComponent } from "../../encounter/key-point-encounter-form/key-point-encounter-form.component";
import { Tour } from "../model/tour.model";
import {
    PublicKeyPointRequest,
    PublicStatus,
} from "../model/public-key-point-request.model";
import { Person } from "../../stakeholder/model/person.model";
import { MapService } from "src/app/shared/map/map.service";
import { NotifierService } from "angular-notifier";
import { faImage, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { environment } from "src/env/environment";
import { MapModalComponent } from "src/app/shared/map-modal/map-modal.component";
import { LocationCoords } from "src/app/shared/model/location-coords.model";
import { xpError } from "src/app/shared/model/error.model";
import { Facilities } from "../model/facilities.model";
import { PublicFacilityRequest } from "../model/public-facility-request.model";
import { User } from "src/app/infrastructure/auth/model/user.model";

export interface AddFacilityModalData {
    facility?: Facilities;
    isUpdateForm: Boolean;
}

@Component({
    selector: "xp-facility-modal",
    templateUrl: "./facility-modal.component.html",
    styleUrls: ["./facility-modal.component.css"],
})
export class FacilityModalComponent implements OnInit {
    @Output() facilityCreated = new EventEmitter<Facilities>();
    @Output() facilityUpdated = new EventEmitter<Facilities>();
    facility?: Facilities;
    isUpdateForm: Boolean = false;
    facilityImage: string | null = null;
    facilityImageFile: File | null = null;
    person: Person;
    category: string;
    faImage = faImage;
    faLocation = faMapLocationDot;
    user: User | undefined;

    constructor(
        private service: TourAuthoringService,
        private authService: AuthService,
        private mapService: MapService,
        private notifier: NotifierService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<FacilityModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddFacilityModalData,
    ) {
        this.isUpdateForm = data.isUpdateForm;
        this.facility = data.facility;
        if (this.isUpdateForm) {
            this.facilityImage = this.facility!.ImagePath!.startsWith("http")
                ? this.facility!.ImagePath!
                : environment.imageHost + this.facility!.ImagePath;
            const facilityToPatch = {
                name: this.facility!.Name || null,
                description: this.facility!.Description || null,
                imagePath: this.facility!.ImagePath || null,
                category: this.facility!.category.toString() || null,
                longitude: this.facility!.Longitude.toString() || null,
                latitude: this.facility!.Latitude.toString() || null,
            };
            this.facilityForm.patchValue(facilityToPatch);
        }
    }
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

    ngOnInit(): void {
        this.getPerson();
        this.facilityForm.controls['category'].valueChanges.subscribe((value) => {
            this.selectedOption = value;
        });
    }

    facilityForm = new FormGroup({
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        imagePath: new FormControl("", [Validators.required]),
        category: new FormControl("", [Validators.required]),
        longitude: new FormControl("", [Validators.required]),
        latitude: new FormControl("", [Validators.required]),
        isPublicChecked: new FormControl<boolean>(false),
    });

    onSelectImage(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files[0]) {
            this.facilityImageFile = element.files[0];

            const reader = new FileReader();

            reader.readAsDataURL(this.facilityImageFile);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.facilityImage = reader.result as string;
                this.facilityForm.value.imagePath = "";
            };
        }
    }

    addFacility(): void {
        if (this.isValidForm()) {
            this.notifier.notify("error", "Invalid facility data supplied.");
            return;
        }
        this.service.uploadImage(this.facilityImageFile!).subscribe({
            next: (imagePath: string) => {
                const facility: Facilities = {
                    Name: this.facilityForm.value.name || "",
                    Description: this.facilityForm.value.description || "",
                    ImagePath: imagePath,
                    category: this.selectedOption
                        ? parseInt(this.selectedOption, 10)
                        : 0,
                    Longitude:
                        parseFloat(this.facilityForm.value.longitude || "0") ||
                        0,
                    Latitude:
                        parseFloat(this.facilityForm.value.latitude || "0") ||
                        0,
                };
                console.log(this.category)
                console.log(this.selectedOption)
                facility.AuthorId = this.user?.id;
                if(this.isFormValid()){
                    this.service.addFacility(facility).subscribe({
                        next: result => {
                            this.facilityCreated.emit(result);
                            if (this.facilityForm.value.isPublicChecked) {
                                const request: PublicFacilityRequest = {
                                    facilityId: result.ID as number,
                                    status: PublicStatus.Pending,
                                    authorName:
                                        this.person.name +
                                        " " +
                                        this.person.surname,
                                };
                                this.service
                                    .addPublicFacilityRequest(request)
                                    .subscribe({});
                            }
                            this.dialogRef.close();
                            this.notifier.notify(
                                "success",
                                "Added a new facility!",
                            );
                        },
                        error: err => {
                            this.notifier.notify(
                                "err",
                                xpError.getErrorMessage(err),
                            );
                        },
                    });
                }else{
                    this.notifier.notify("error", "Invalid facility data supplied.");
                    return;
                }
                
                // });
            },
            error: err => {
                this.notifier.notify("error", "Invalid facility image.");
            },
        });
    }

    updateFacility(): void {
        if (this.isValidForm()) {
            this.notifier.notify("error", "Invalid facility data supplied.");

            return;
        }
        let facility: Facilities = {
            ID: this.facility!.ID!,
            Name: this.facilityForm.value.name || "",
            Description: this.facilityForm.value.description || "",
            category: this.selectedOption
                ? parseInt(this.selectedOption, 10)
                : 0,
            Longitude:
                parseFloat(this.facilityForm.value.longitude || "0") || 0,
            Latitude: parseFloat(this.facilityForm.value.latitude || "0") || 0,
            ImagePath: this.facilityForm.value.imagePath || this.data.facility?.ImagePath || "",
        };

        if (this.isFormValid() && this.facilityImageFile) {
            this.service.uploadImage(this.facilityImageFile!).subscribe({
                next: (imagePath: string) => {
                    facility.ImagePath = imagePath;
                    facility.AuthorId = this.user?.id;
                    this.service.updateFacility(facility).subscribe({
                        next: response => {
                            this.facilityUpdated.emit(response);
                            this.dialogRef.close();
                            this.notifier.notify("success", "Updated facility!");
                        },
                    });
                },
                error: err => {
                    this.notifier.notify("error", "Invalid facility image.");
                },
            });
        }
        else if(this.isFormValid()){
            facility.ImagePath = this.data.facility!.ImagePath;
            this.service.updateFacility(facility).subscribe({
                next: response => {
                    this.facilityUpdated.emit(response);
                    this.dialogRef.close();
                    this.notifier.notify("success", "Updated facility!");
                },
                error: err => {
                    this.notifier.notify("error", "Invalid facility data.");
                },
            });
        }
    }

    isValidForm(): boolean {
        if (
            this.facilityForm.errors ||
            !this.facilityForm.value.latitude ||
            !this.facilityForm.value.longitude
        ) {
            return true;
        }

        return false;
    }

    getPerson(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.service.getPerson(user.id).subscribe(result => {
                this.person = result;
            });
        });
    }

    setAddressInfo(addressInfo: any, addressParts: any): void {
        if (addressParts.length == 10) {
            addressInfo.number = addressParts[0];
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[4];
            addressInfo.postalCode = addressParts[8];
            addressInfo.country = addressParts[9];
        } else if (addressParts.length == 9) {
            addressInfo.number = addressParts[0];
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[3];
            addressInfo.postalCode = addressParts[7];
            addressInfo.country = addressParts[8];
        } else if (addressParts.length == 8) {
            addressInfo.number = "";
            addressInfo.street = addressParts[1];
            addressInfo.city = addressParts[2];
            addressInfo.postalCode = addressParts[6];
            addressInfo.country = addressParts[7];
        } else if (addressParts.length == 7) {
            addressInfo.number = "";
            addressInfo.street = addressParts[0];
            addressInfo.city = addressParts[1];
            addressInfo.postalCode = addressParts[5];
            addressInfo.country = addressParts[6];
        }
    }

    selectLocation() {
        const dialogRef = this.dialog.open(MapModalComponent, {
            data: {
                closeOnClick: true,
            },
        });
        dialogRef.componentInstance.positionChanged.subscribe(
            (result: LocationCoords) => {
                this.facilityForm.controls["longitude"].setValue(
                    result.longitude.toString(),
                );
                this.facilityForm.controls["latitude"].setValue(
                    result.latitude.toString(),
                );
                this.notifier.notify(
                    "info",
                    "Successfuly set facility location.",
                );
            },
        );
    }
    isFormValid():boolean{
        return this.facilityForm.value.description!="" && this.facilityForm.value.name!="" && this.facilityForm.value.category!=""
    }
}
