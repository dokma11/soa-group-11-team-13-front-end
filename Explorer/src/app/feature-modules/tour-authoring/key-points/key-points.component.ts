import {
    Component,
    OnInit,
    ViewChild,
} from "@angular/core";
import { TourAuthoringService } from "../tour-authoring.service";
import { KeyPoint } from "../model/key-point.model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { environment } from "src/env/environment";
import { MapService } from "src/app/shared/map/map.service";
import { MatDialog } from "@angular/material/dialog";
import { PublicKeyPointsComponent } from "../public-key-points/public-key-points.component";
import { Router } from "@angular/router";
import { MapComponent } from "src/app/shared/map/map.component";
import { Tour, TourStatus } from "../model/tour.model";
import { TransportType } from "../model/tourDuration.model";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { NotifierService } from "angular-notifier";
import { xpError } from "src/app/shared/model/error.model";
import { PublishTourModalComponent } from "../publish-tour-modal/publish-tour-modal.component";
import { KeyPointModalComponent } from "../key-point-modal/key-point-modal.component";
@Component({
    selector: "xp-key-points",
    templateUrl: "./key-points.component.html",
    styleUrls: ["./key-points.component.css"],
})
export class KeyPointsComponent implements OnInit {
    tour?: Tour;
    keyPoints: KeyPoint[] = [];
    selectedKeyPoint: KeyPoint | null = null;
    mapLongLat: [number, number];
    mapLocationAddress: string;
    shouldRenderKeyPointForm: boolean = true;
    shouldEdit: boolean = false;
    tourIdTemp: number = 0;
    areButtonsEnabled: boolean = true;
    mapDistance: number = 0;

    @ViewChild(MapComponent, { static: false }) mapComponent: MapComponent;

    public distance: number;
    public walkingDuration: number = 0;
    public bicycleRideDuration: number = 0;
    public carRideDuration: number = 0;

    checkedWalkingDuration: boolean = false;
    checkedBicycleRideDuration: boolean = false;
    checkedCarRideDuration: boolean = false;
    keyPointContainer: any;

    faCoins = faCoins;

    constructor(
        private route: ActivatedRoute,
        private service: TourAuthoringService,
        public dialogRef: MatDialog,
        private notifier: NotifierService,
    ) {}

    ngOnInit(): void {
        this.keyPointContainer = document.querySelector(
            ".key-point-cards-container",
        );

        const param = this.route.snapshot.paramMap.get("id");
        if (param) {
            this.service.getTour(Number(param)).subscribe({
                next: (result: any) => {
                    this.tour = result.tour;
                    this.getKeyPoints();
                    this.enableButtons();
                },
            });
        }
    }

    openPublishModal() {
        this.dialogRef.open(PublishTourModalComponent, {
            data: {
                tour: this.tour,
                walkingDuration: this.walkingDuration,
                bicycleDuration: this.bicycleRideDuration,
                carDuration: this.carRideDuration,
                distance: this.mapDistance,
            },
        });
    }

    enableButtons(): void {
        if (this.tour?.status == TourStatus.Published) {
            this.areButtonsEnabled = false;
            this.getDurationInfo(this.tour);
        } else {
            this.areButtonsEnabled = true;
        }
    }

    getKeyPoints(): void {

        console.log(this.tour);
        console.log(this.tour?.id);

        if (this.tour?.status == 0){
            console.log('Tura ima status 0' + this.tour?.status);
        }
        
        if (this.tour?.status == 2){
            console.log('Tura ima status 2' + this.tour?.status);
        }

        this.service.getKeyPoints(this.tour?.id!).subscribe({
            next: (result: any) => {
                this.keyPoints = result.keyPoints.sort((x : any, y : any) => {
                    return x.order < y.order ? -1 : 1;
                });
                this.tour!.keyPoints = this.tour!.keyPoints?.sort((x, y) => {
                    return x.order < y.order ? -1 : 1;
                });
            },
            error: () => {},
        });
    }

    distanceChanged(distance: number) {
        this.mapDistance = distance;
        if (this.keyPoints.length < 2) {
            this.walkingDuration = 0;
            this.bicycleRideDuration = 0;
            this.carRideDuration = 0;
        } else if (distance != 0) {
            this.calculateDurations(distance);
        } else {
            if (this.tour?.distance) {
                this.calculateDurations(this.tour.distance);
            }
        }
    }

    getImagePath(imageName: string): string {
        return environment.imageHost + imageName;
    }

    deleteKeyPoint(id: number): void {
        this.route.paramMap.subscribe({
            next: (params: ParamMap) => {
                this.service.deleteKeyPoint(+params.get("id")!, id).subscribe({
                    next: () => {
                        this.tour!.keyPoints = this.tour?.keyPoints?.filter(
                            x => x.id != id,
                        );
                        this.keyPoints = this.keyPoints.filter(x => x.id != id);
                        this.notifier.notify("success", "Removed keypoint.");
                    },
                    error: (err: any) => {
                        this.notifier.notify(
                            "error",
                            xpError.getErrorMessage(err),
                        );
                    },
                });
            },
        });
    }

    onEditClicked(keyPoint: KeyPoint): void {
        this.selectedKeyPoint = keyPoint;
        this.shouldRenderKeyPointForm = true;
        this.shouldEdit = true;
    }

    onAddClicked(): void {
        this.selectedKeyPoint = null;
        this.shouldEdit = false;
        this.shouldRenderKeyPointForm = true;
    }

    currentIndex: number = 0;

    scrollToNextCard(): void {
        this.currentIndex++;
        if (this.currentIndex >= this.keyPointContainer.children.length) {
            this.currentIndex = 0;
        }
        this.keyPointContainer.scrollLeft +=
            this.keyPointContainer.children[this.currentIndex].clientWidth;
    }

    scrollToPrevCard(): void {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.keyPointContainer!.children.length - 1;
        }
        this.keyPointContainer!.scrollLeft -=
            this.keyPointContainer.children[this.currentIndex].clientWidth;
    }

    openPublicKeyPointsDialog() {
        const dialogRef = this.dialogRef.open(PublicKeyPointsComponent, {
            data: {
                tourId: this.tour?.id!,
                keyPoints: this.keyPoints,
            },
        });
        const sub = dialogRef.componentInstance.onAdd.subscribe(() => {
            this.mapComponent.createWaypoints(this.keyPoints);
            let waypoints = [...this.mapComponent.waypointMap.values()];
            this.mapComponent.setRoute(waypoints);
            this.getKeyPoints();
        });
    }

    openNewKeyPointDialog() {
        const dialogRef = this.dialogRef.open(KeyPointModalComponent, {
            data: {
                tour: this.tour,
                isUpdateForm: false,
            },
        });

        dialogRef.componentInstance.keyPointCreated.subscribe(keyPoint => {
            this.keyPoints.push(keyPoint);
            this.keyPoints = this.keyPoints.slice();
            this.tour?.keyPoints?.push(keyPoint);
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getKeyPoints();
        });
    }

    openEditKeyPointDialog(kp: KeyPoint) {
        const dialogRef = this.dialogRef.open(KeyPointModalComponent, {
            data: {
                tour: this.tour,
                isUpdateForm: true,
                keyPoint: kp,
            },
        });

        dialogRef.componentInstance.keyPointUpdated.subscribe(keyPoint => {
            let index = this.keyPoints.findIndex(x => x.id == keyPoint.id);
            this.keyPoints[index] = keyPoint;

            index = this.tour!.keyPoints!.findIndex(x => x.id == keyPoint.id);
            this.tour!.keyPoints![index] = keyPoint;
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getKeyPoints();
          });
    }

    calculateDurations(distance: number): void {
        this.walkingDuration =
            Math.round((distance / 3.6) * 60) + this.keyPoints.length * 15;
        this.bicycleRideDuration =
            Math.round((distance / 20) * 60) + this.keyPoints.length * 15;
        this.carRideDuration =
            Math.round((distance / 50) * 60) + this.keyPoints.length * 15;
    }

    getDurationInfo(tour: Tour): void {
        if (tour.durations) {
            for (let t of tour.durations) {
                if (t.transportType == TransportType.Walking) {
                    this.checkedWalkingDuration = true;
                } else if (t.transportType == TransportType.Bicycle) {
                    this.checkedBicycleRideDuration = true;
                } else if (t.transportType == TransportType.Car) {
                    this.checkedCarRideDuration = true;
                }
            }
        }
    }
}
