import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';

import {WebView } from "ui/web-view";

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
  // Get the event sender
  let page = <Page>args.object;

  var wv: WebView = new WebView();

  wv.url = "index.html";

  page.content = wv;
}