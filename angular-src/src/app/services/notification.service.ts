import { Injectable } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Injectable()
export class NotificationService {

  constructor() { }

  showNotifSuccess(msg){
    $(".notification").css("background-color","#00C851");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifInfo(msg){
    $(".notification").css("background-color","#33b5e5");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifWarning(msg){
    $(".notification").css("background-color","#ffbb33");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifDanger(msg){
    $(".notification").css("background-color","#ff4444");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

}
