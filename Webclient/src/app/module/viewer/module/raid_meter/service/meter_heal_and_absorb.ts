import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Observable, Subscription, zip} from "rxjs";
import {RaidMeterSubject} from "../../../../../template/meter_graph/domain_value/raid_meter_subject";
import {InstanceDataService} from "../../../service/instance_data";
import {UtilService} from "./util";
import {MeterHealService} from "./meter_heal";
import {MeterAbsorbService} from "./meter_absorb";
import {HealMode} from "../../../domain_value/heal_mode";

@Injectable({
    providedIn: "root",
})
export class MeterHealAndAbsorbService implements OnDestroy {

    private subscription: Subscription;

    private data$: BehaviorSubject<Array<[number, Array<[number, number]>]>> = new BehaviorSubject([]);
    private abilities$: Map<number, RaidMeterSubject>;
    private units$: Map<number, RaidMeterSubject>;

    private initialized: boolean = false;
    private current_mode: boolean = false;

    constructor(
        private instanceDataService: InstanceDataService,
        private utilService: UtilService,
        private meter_heal_service: MeterHealService,
        private meter_absorb_service: MeterAbsorbService
    ) {
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    get_data(mode: boolean, abilities: Map<number, RaidMeterSubject>, units: Map<number, RaidMeterSubject>): Observable<Array<[number, Array<[number, number]>]>> {
        if (!this.initialized) {
            this.abilities$ = abilities;
            this.units$ = units;
            this.current_mode = mode;
            this.initialize();
        } else if (this.current_mode !== mode) {
            this.current_mode = mode;
            this.merge_data();
        }
        return this.data$.asObservable();
    }

    private initialize(): void {
        this.initialized = true;
        this.merge_data();
    }

    private async merge_data(): Promise<void> {
        this.subscription?.unsubscribe();
        this.subscription = zip(...[this.meter_absorb_service.get_data(this.current_mode, this.abilities$, this.units$),
            this.meter_heal_service.get_data(HealMode.Effective, this.current_mode, this.abilities$, this.units$)])
            .subscribe(meters => {
                const result = new Map();

                for (const data_set of meters) {
                    for (const [subject_id, abilities] of data_set) {
                        if (result.has(subject_id)) result.set(subject_id, [...result.get(subject_id), ...abilities]);
                        else result.set(subject_id, abilities);
                    }
                }

                this.data$.next([...result.entries()]);
            });
    }
}
