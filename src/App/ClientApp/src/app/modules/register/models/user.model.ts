import { CaptchaResonse } from '@partie/shared/models/captcha.model';


export class User extends CaptchaResonse {

    constructor() {

        super();
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.dateOfBirth = '';
        this.phoneNumber = '';
        this.ipAddress = '';
        this.latitude = '';
        this.longitude = '';
    }

    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    phoneNumber: string;
    confirmPassword: string;
    ipAddress: string;
    latitude: string;
    longitude: string;
    referralCode: string;
    emailVerifiedForBetaUser: boolean;
    betaUser: boolean;
}

export class BaseResponse {

    constructor() {
        this.message = '';
        this.hasError = false;
    }

    message: string;
    hasError: boolean;
}


export class ValidateUsernameResponse extends BaseResponse {


}

export class ValidateEmailResponse extends BaseResponse {


}

export class ValidatePhoneNumberResponse extends BaseResponse {


}

export class ValidateDisplayNameResponse extends BaseResponse {


}

