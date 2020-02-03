

export class Captcha {

  constructor() {
    this.captchaIsLoaded = false;
    this.siteKey = '';
  }
  captchaIsLoaded:boolean;

  siteKey:string;
  badge: 'bottomright' | 'bottomleft' | 'inline' = 'inline';
  type: 'image' | 'audio';
  theme: 'light' | 'dark' = 'light'; 
}

export class CaptchaResonse {

  constructor() {
    this.captchaSuccess = false;
  }
  captchaSuccess:boolean;
  captchaResponse?:string;
}
