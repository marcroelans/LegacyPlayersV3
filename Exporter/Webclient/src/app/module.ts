import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {Routing} from './routing';
import {App} from './component/app';
import {NavigationBarModule} from "./module/navigation_bar/module";
import {TranslationService} from "./service/translation";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [App],
    imports: [
        BrowserModule,
        NavigationBarModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        Routing
    ],
    providers: [TranslationService],
    bootstrap: [App]
})
export class Module {
}
