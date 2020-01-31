import {NgModule} from "@angular/core";
import {TooltipComponent} from "./component/tooltip/tooltip";
import {CommonModule} from "@angular/common";
import {CharacterTooltipModule} from "./module/character_tooltip/module";
import {TooltipService} from "./service/tooltip";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [TooltipComponent],
    imports: [
        CommonModule,
        CharacterTooltipModule,
        TranslateModule
    ],
    exports: [TooltipComponent],
    providers: [TooltipService]
})
export class TooltipModule {
}