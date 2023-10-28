import {
  Component,
  OnInit,
  HostBinding,
  HostListener,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { SettingService } from "./setting.service";
// import { Globals } from "src/app/globals";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
declare const google: any;
import { Router } from "@angular/router";
//import { ifStmt } from "@angular/compiler/src/output/output_ast";
import { timeout } from "rxjs/operators";
import { BaseService } from "../base/base.service";

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
}
@Component({
  selector: "app-maps",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"]
})
export class SettingComponent implements OnInit {
  
  isLoading3 = true;
  loaded3 = false;

  rename = true;
  old_name = "Acquisition";
  new_name = "Mergers and Acquisitions";

  test_email = "";
  test_email_error = "";
  test_email_entered = false;
  send_test_email_info = "";
  test_email_send_success = false;

  // triggerData: any;

  settingData = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone": "",
    "job_title": "",
    "address": "",
    "state": "Dhaka",
    "zip_code": "",
    "city": "Dhaka",
    "linkedIn_profile": "",
    "profile_img_link": "",
    //"base64_signature": "",
    "company_settings": {
      "company_name": "",
      "company_website_link": "",
      "company_linkedIn_profile": "",
      "company_product_name": "",
      "company_product_url": "",
      "whitepaper_url_1": "",
      "hubspot_bcc_email": "",
      "hubspot_forwarding_email": "",
      "hubspot_email": "",
      "gmail_email": "",
      "hubspot_portal_ID": "",
      "gmail_app_password": "",
      "goal_of_emails_per_day": 0
    }
  }

  constructor(
    private router: Router,
    private service: SettingService,
    private baseService: BaseService,
    // public globalVars: Globals
  ) { }

  updateProfileImage(currentImg): void {
    // send message to subscribers via observable subject
    this.baseService.updateProfileImage(currentImg);
  }

  updateFirstName(first_name): void {
    // send message to subscribers via observable subject
    this.baseService.updateFirstName(first_name);
  }

  ngOnInit() {
    this.getAccountSettings();
  }

  // ngOnDestroy() {
  //   this.cancelNotification();
  // }

  // async cancelNotification() {
  //   this.globalVars.show_notification = false;
  //   console.log("try: " + this.globalVars.show_notification);
  // }

  settingAvailable: boolean = true;

  first_name_error: any = "";

  last_name_error: any = "";

  email_error: any = "";

  phone_error: any = "";

  job_title_error: any = "";

  city_error: any = "";

  address_error: any = "";

  state_error: any = "";

  zip_code_error: any = "";

  linkedIn_profile_error: any = "";
  base64_signature_error: any = "";

  getAccountSettings() {
    this.service
      .getAccountSettings()
      .pipe(timeout(10000))
      .subscribe(
        (data: any) => {
          if (data.Error === 505) {
            this.router.navigate(["login"]);
          } else {
            if (data.settings.settings) {
              this.loadSettingData(data.settings);
            } else {
              this.initialImg = this.service.getDummyImage;
              this.currentImg = this.service.getDummyImage;
            }

            if (data.settings.settings) {
              this.settingAvailable = true;
            } else {
              this.settingAvailable = false;
            }

            this.isLoading3 = false;
            this.loaded3 = true;
          }
        },
        error => {
          // this.showBottomNotification(error).then(() => {
          //   this.isLoading3 = false;
          // });
        }
      );
  }

  loadSettingData(settings) {
    // Iterate through object
    var settingKeys = Object.keys(settings.settings);
    for (var i = 0; i < settingKeys.length; i++) {
      if (settingKeys[i] != "company_settings")
        this.settingData[settingKeys[i]] = settings.settings[settingKeys[i]]
      else {
        var company_settings = settings.settings.company_settings;
        var companySettingKeys = Object.keys(company_settings);
        for (var y = 0; y < companySettingKeys.length; y++) {
          this.settingData["company_settings"][companySettingKeys[y]] = settings.settings["company_settings"][companySettingKeys[y]];
        }
      }
    }
    this.initialImg = settings.settings.profile_img_link;
    this.currentImg = settings.settings.profile_img_link;
  }

  rotate_user_arrow = false;
  rotateUserArrow() {
    this.rotate_user_arrow = !this.rotate_user_arrow;
  }

  loaded: boolean = false;
  signImgloaded: boolean = false;
  imageSrc: string = "";
  initialImg: string = "";
  currentImg: string = "";
  profileImageError: string = "";
  signImageError: string = "";
  fileData = {};

  // image related functions
  handleProfileInputChange(e) {


    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    console.log(197, file.size)

    var pattern = /image-*/;
    var reader = new FileReader();

    
    if (!file.type.match(pattern)) {
      // alert('invalid format');
      this.profileImageError = "Invalid Image Format";
      return;
    } 
    // else if (file.size >= 100000) {
    //   this.profileImageError =
    //     "Invalid Image Size! Please upload image of file size less then 10KB or 100000 bytes";
    //   return;
    // } 
    else {
      this.profileImageError = "";
      console.log("file size: " + file.size);
      this.fileData = file;
    }
    

    this.profileImageError = "";
    this.fileData = file;
    this.loaded = true;
    reader.onload = this._handleProfileReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleProfileReaderLoaded(e) {
    console.log(229, e)
    this.loaded = true;

    var reader = e.target;
    this.currentImg = reader.result;
    this.uploadImage('profile_img_link');

  }

  cancel() {
    this.currentImg = this.initialImg;
    this.loaded = false;
  }

  // setting excel file upload
  // excel_loaded: boolean = false;
  // excelloaded: boolean = false;
  // excelSrc: string = "";
  // initialExcel: string = "";
  // currentExcel: string = "";
  // excel_file_Error: string = "";
  // excel_file_Info: string = "";
  // excelFileData = {};

  // _validFileExtensions = [".xlsx", ".xls"];
  // Validate(e) {
  //   var file = e.target.files[0];
  //   console.log(file.type);
  //   var pattern = /.spreadsheetml.sheet/;
  //   var reader = new FileReader();

  //   if (!file.type.match(pattern)) {
  //     // alert('invalid format');
  //     this.excel_file_Error = "invalid file Format";
  //     return;
  //   } else {
  //     this.excel_file_Error = "";
  //     this.excel_file_Info = "Chosen File Name: " + file.name;
  //     console.log("file size: " + file.size);
  //     this.excelFileData = file;

  //     this.excel_loaded = false;
  //     reader.onload = this.excelIsloaded.bind(this);
  //     reader.readAsDataURL(file);
  //   }
  // }

  // excelIsloaded(evt) {
  //   var reader = evt.target;
  //   this.currentExcel = reader.result;
  //   console.log("try: " + this.currentExcel);
  //   const result = reader.result;
  //   console.log(result.type);
  //   if (result.length * 2 > 2 ** 21) {
  //     this.excel_loaded = false;
  //     console.log("read unsuccessful");
  //   } else {
  //     this.excel_loaded = true;
  //     console.log("read successful");
  //   }
  // }

  // cancelExcel() {
  //   this.currentExcel = "";
  //   this.excel_loaded = false;
  // }
  // setting excel file upload end

  requestRunning: any = false;

  successRunningRequest(request, n) {
    n++;
    console.log("SALMA KONA" + n);
    return (this.requestRunning = false);
  }

  uploadImage(imgKey: string) {
    console.log(306, imgKey, "upload image", this.fileData);
    this.service
      .uploadImage(this.fileData)
      .pipe(timeout(10000))
      .toPromise()
      .then(
        (data: any) => {
          if (data.Error === 505) {
            this.router.navigate(["login"]);
          } else {
            console.log(316, data.id)
            this.updateImageSettings(data.id, imgKey);
          }
        },
        error => {
          this.loaded = true;
          // this.showBottomNotification(error).then(() => {
          //   this.loaded = false;
          //   this.profileImageError = "Image dropped! Please reselect image";
          //   this.isLoading3 = false;
          //   this.getAccountSettings();
          // });
        }
      );

    /*
    this.cancelNotification().then(() => {
      if (this.requestRunning === false) {
        this.requestRunning = true;
        this.service
          .uploadImage(this.fileData)
          .pipe(timeout(10000))
          .toPromise()
          .then(
            (data: any) => {
              if (data.Error === 505) {
                this.router.navigate(["login"]);
              } else {
                this.updateImageSettings(data.id, imgKey);
              }
            },
            error => {
              this.loaded = true;
              this.showBottomNotification(error).then(() => {
                this.loaded = false;
                this.profileImageError = "Image dropped! Please reselect image";
                this.isLoading3 = false;
                this.getAccountSettings();
              });
            }
          );
      }
    });
    */
  }

  updateImageSettings(imgId: string, imgKey: string) {

    console.log(365, imgId, imgKey)
    if (imgKey === "profile_img_link") {
      var profile_img_link =
        this.service.baseUrlVar + "/image/id/" + imgId;

      console.log(369, profile_img_link);
      this.postSetting("profile_img_link", profile_img_link)


    }
  }

  // image related functions

  // excel file related functions
  // file_status = "Submit File";
  // uploading = false;

  // uploadExcelFile() {
  //   this.cancelNotification().then(() => {
  //     this.file_status = "Uploading File...";
  //     this.uploading = true;
  //     if (this.requestRunning === false) {
  //       this.service
  //         .uploadExcelFile(this.excelFileData)
  //         .pipe(timeout(10000))
  //         .toPromise()
  //         .then(
  //           (data: any) => {
  //             if (data.Error === 505) {
  //               this.router.navigate(["login"]);
  //             } else {
  //               this.isLoading3 = false;
  //               this.excel_loaded = false;
  //               this.excel_file_Info = "File uploaded successfully!";
  //             }
  //           },
  //           error => {
  //             this.loaded = true;
  //             this.showBottomNotification(error).then(() => {
  //               this.isLoading3 = false;
  //               this.excel_loaded = false;
  //               this.excel_file_Info = "";
  //               this.excel_file_Error = "File dropped! Please reselect file!";
  //               this.getAccountSettings();
  //             });
  //           }
  //         );
  //     }
  //   });
  // }

  // excel file related functions ends

  // input focus and blur related functions
  displayed_input: string = "";
  element: ElementRef;
  showInput(inputName: string) {
    if (!this.displayed_input) {
      this.displayed_input = inputName;
      document.getElementById("inputName").focus();
    }
  }

  errorPlaceholder: string;

  saveSetting(indexNum: number, keyName: string, value: string) {

    console.log(3633, "Save Setting Called");
    var body = {
      key: keyName,
      value: value
    }

    console.log(keyName, value);
    this.postSetting(keyName, value)
  }

  postSetting(key, value) {
    this.service
      .saveSetting(key, value)
      //.pipe(timeout(10000))
      .subscribe(
        (data: any) => {
          if (data.Error === 505) {
            this.router.navigate(["login"]);
          } else {
            this.loaded = false
            if (key == 'profile_img_link') {
              this.currentImg = value
              this.initialImg = value
              this.updateProfileImage(value)
            }
            if(key == 'first_name')
            {
              this.updateFirstName(value)
            }
          }
        },
        error => {
          // this.showBottomNotification(error).then(() => {
          //   this.isLoading3 = false;
          // });
        }
      );
  }

  saveAdvancedSetting(object, branch, keyName: string, value: string) {

    console.log(3633, "Save Setting Called");
    console.log(keyName, value);
    this.postAdvancedSetting(object, branch, keyName, value)
  }

  postAdvancedSetting(object, branch, key, value) {
    this.service
      .saveAdvancedSetting(object, branch, key, value)
      .pipe(timeout(10000))
      .subscribe(
        (data: any) => {
          if (data.Error === 505) {
            this.router.navigate(["login"]);
          } else {
          }
        },
        error => {
          // this.showBottomNotification(error).then(() => {
          //   this.isLoading3 = false;
          // });
        }
      );
  }
  async startLoading() {
    this.isLoading3 = true;
  }

  async stopLoading() {
    this.isLoading3 = false;
    this.loaded3 = true;
  }

  // async showBottomNotification(error) {
  //   if (error) {
  //     this.globalVars.errorMessage = error;
  //   } else {
  //     this.globalVars.errorMessage = "Sorry! Unknown Error";
  //   }
  //   this.globalVars.show_notification = true;
  //   console.log("opened notification");
  // }

  saveAccountSettingFunc(body) {
    if (this.requestRunning === false) {
      this.service
        .saveAccountSettings(body)
        .pipe(timeout(10000))
        .toPromise()
        .then(
          (data: any) => {
            if (data.Error === 505) {
              this.router.navigate(["login"]);
            } else {
              // setTimeout(() => {
              //   this.isLoading3 = false;
              // }, 300);
              this.requestRunning = true;
              var n = 0;
              this.successRunningRequest(this.requestRunning, n);
            }
          },
          error => {
            // this.showBottomNotification(error).then(() => {
            //   this.getAccountSettings();
            // });
          }
        );
    }
  }

  saveAccountSettingAdvFunc(body) {
    if (this.requestRunning === false) {
      this.service
        .saveAccountSettingsAdvanced(body)
        .pipe(timeout(10000))
        .toPromise()
        .then(
          (data: any) => {
            if (data.Error === 505) {
              this.router.navigate(["login"]);
            } else {
              // setTimeout(() => {
              //   this.isLoading3 = false;
              // }, 300);
              this.requestRunning = true;
              var n = 0;
              this.successRunningRequest(this.requestRunning, n);
            }
          },
          error => {
            // this.showBottomNotification(error).then(() => {
            //   this.getAccountSettings();
            // });
          }
        );
    }
  }

  saveSettingEmailSignOff(body) {

  }

  //
  // email_signature_lNerror = "";
  // email_signature_FNerror = "";
  // email_signature_Eerror = "";
  // email_signature_Perror = "";
  // email_signature_linkedInerror = "";
  // email_signature_JOberror = "";

  company_name_error = "";
  company_website_link_error = "";
  company_linkedIn_profile_error = "";
  // company_product_name_error = "";
  // company_product_url_error = "";
  // whitepaper_url_1_error = "";
  // hubspot_bcc_email_error = "";
  // hubspot_forwarding_email_error = "";
  // hubspot_email_error = "";
  gmail_email_error = "";
  gmail_app_password_error = "";
  // goal_of_emails_per_day_error = "";
  // hubspot_portal_ID_error = "";

  saveAccountSettings(body) {
  }

  // input focus and blur related functions

  // send test email
  sendTestEmail() {
    var body = {
      to: this.test_email
    };
    this.service
      .sendTestEmail(body)
      .pipe(timeout(10000))
      .subscribe(
        (data: any) => {
          if (data.Error === 505) {
            this.router.navigate(["login"]);
          } else {
            this.test_email_entered = false;
            this.test_email_send_success = true;
            this.send_test_email_info =
              "Test email sent successfully to: " + this.test_email;
          }
        }
        // ,
        // error => {
        //   this.showBottomNotification(error).then(() => { });
        // }
      );
  }
  // send test email

  // phone field validation functions

  keyPress(event: any, keyName: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    } else {
      if (keyName === "zip_code" && this.settingData.zip_code) {
        if (this.settingData.zip_code.length > 8) {
          event.preventDefault();
          var element = document.getElementById(keyName);
          element.classList.remove("danger_input_box");
        }
      } else {
        console.log(keyName);
        var element = document.getElementById(keyName);
        element.classList.remove("danger_input_box");
      }
    }
  }

  validateZipOnKeyPress(event: any, keyName: any) {
    if (keyName === "zip_code" && this.settingData.zip_code) {
      if (this.settingData.zip_code.length > 7) {
        event.preventDefault();
      }
    } else {
      var pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (pattern.test(inputChar)) {
        event.preventDefault();
      } else {
        var format = /^\d+\s[A-z]+\s[A-z]+/;
        if (format.test(inputChar)) {
          event.preventDefault();
        }
      }
    }
  }

  removeDanger(event: any, keyName: any) {
    var element = document.getElementById(keyName);
    element.classList.remove("danger_input_box");
  }

  validateZipCode(value) {
    if (this.settingData.zip_code.length > 8) {
      return true;
    } else {
      var pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (pattern.test(value)) {
        return true;
      } else {
        var format = /^\d+\s[A-z]+\s[A-z]+/;
        if (format.test(value)) {
          return true;
        }
      }
      return false;
    }
  }

  error: boolean;
  preventNumAndSpecialCharInput(event: any, keyName: string) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    } else {
      var k = event.keyCode,
        $return =
          (k > 64 && k < 91) ||
          (k > 96 && k < 123) ||
          k == 8 ||
          k == 32 ||
          (k >= 48 && k <= 57);
      if (!$return) {
        event.preventDefault();
      } else {
        var element = document.getElementById(keyName);
        element.classList.remove("danger_input_box");
      }
    }
  }

  validateAddressOnKeyPress(event: any, keyName: string) {
    var element = document.getElementById(keyName);
    element.classList.remove("danger_input_box");
  }

  validityTest(value: string): boolean {
    var invalid = /\d/.test(value);
    if (!invalid) {
      var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      invalid = format.test(value);
    }
    console.log("validity test: " + invalid);
    return invalid;
  }

  validateEmail(mail) {
    console.log("email string: " + mail);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return false;
    }
    return true;
  }

  validateEmailOnKeyPress(keyName: any) {
    if (keyName == "email") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          this.settingData.email
        )
      ) {
        this.email_error = "";
        var element = document.getElementById(keyName);
        element.classList.remove("danger_input_box");
      }
    }
    if (keyName == "test_email") {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.test_email)
      ) {
        this.test_email_error = "";
        this.test_email_entered = true;
        var element = document.getElementById(keyName);
        element.classList.remove("danger_input_box");
      } else {
        this.test_email_error = "Invalid email!";
        this.test_email_entered = false;
        var element = document.getElementById(keyName);
        element.classList.add("danger_input_box");
      }
    }
  }

  message: string;
  validatePhone(evt: any, keyName: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(evt.charCode);
    if (evt.which < 48 || evt.which > 57) {
      evt.preventDefault();
    } else if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    } else {
      if (this.settingData.phone) {
        let preInputValue: string = this.settingData.phone.toString();
        var lastChar: string = preInputValue.substr(preInputValue.length - 1);
        // remove all mask characters (keep only numeric)
        var newVal = this.settingData.phone.replace(/\D/g, "");
        //when removed value from input
        if (this.settingData.phone.length <= 14) {
          this.message = "Removing Phone..."; //Just console
          /**while removing if we encounter ) character,
           then remove the last digit too.*/
          if (lastChar == ")") {
            newVal = newVal.substr(0, newVal.length - 1);
          }
          if (newVal.length == 0) {
            newVal = "";
          } else if (newVal.length <= 3) {
            /**when removing, we change pattern match.
             "otherwise deleting of non-numeric characters is not recognized"*/
            newVal = newVal.replace(/^(\d{0,3})/, "($1");
          } else if (newVal.length <= 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
          } else {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, "($1) $2-$3");
            var element = document.getElementById(keyName);
            element.classList.remove("danger_input_box");
          }
          //when typed value in input
        } else {
          this.message = "Typing phone..."; //Just console
          // don't show braces for empty value
          if (newVal.length == 0) {
            newVal = "";
          } else if (newVal.length <= 3) {
            // don't show braces for empty groups at the end
            newVal = newVal.replace(/^(\d{0,3})/, "($1)");
          } else if (newVal.length <= 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
          } else {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, "($1) $2-$3");
            var element = document.getElementById(keyName);
            element.classList.remove("danger_input_box");
          }
        }
        this.settingData.phone = newVal;
        // console.log(keyName);

        // console.log(this.settingData.phone)
      }
    }
  }

  message1: string;

  validatePhoneOnSave(value: any) {
    if (value.length > 14) {
      return true;
    }
    if (value.length < 14) {
      return true;
    }
    let preInputValue: string = this.settingData.phone;
    var lastChar: string = preInputValue.substr(preInputValue.length - 1);
    // remove all mask characters (keep only numeric)
    var newVal = this.settingData.phone.replace(/\D/g, "");
    //when removed value from input
    if (this.settingData.phone.length <= 14) {
      this.message = "Removing Phone..."; //Just console
      /**while removing if we encounter ) character,
       then remove the last digit too.*/
      if (lastChar == ")") {
        newVal = newVal.substr(0, newVal.length - 1);
      }
      if (newVal.length == 0) {
        newVal = "";
      } else if (newVal.length <= 3) {
        /**when removing, we change pattern match.
         "otherwise deleting of non-numeric characters is not recognized"*/
        newVal = newVal.replace(/^(\d{0,3})/, "($1");
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
      } else {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, "($1) $2-$3");
      }
      //when typed value in input
    } else {
      this.message = "Typing phone..."; //Just console
      // don't show braces for empty value
      if (newVal.length == 0) {
        newVal = "";
      } else if (newVal.length <= 3) {
        // don't show braces for empty groups at the end
        newVal = newVal.replace(/^(\d{0,3})/, "($1)");
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "($1) $2");
      } else {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, "($1) $2-$3");
      }
    }
    this.settingData.phone = newVal;

    if (this.settingData.phone) {
      return false;
    }
    return true;
  }

  validateAddressOnSave(value) {
    var invalid = /^\d+\s[A-z]+\s[A-z]+/.test(value);
    if (!invalid) {
      var format = /[!@$%^&*()_+\=\[\]{};'"\\|<>?]/;
      invalid = format.test(value);
    }
    console.log("validity test: " + invalid);
    return invalid;
  }

  signOfValidityTest(value) {
    var format = /[%^*()_+\-=\[\]{}`~"\\<>\/]/;
    if (format.test(value)) {
      return true;
    }
    return false;
  }

  validateLinkedINProfile(value) {
    var format = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (format.test(value)) {
      return false;
    }
    return true;
  }

  validateHubspotID(value) {
    var pattern = /^[~`^_=[\]{}<>]+$/;
    if (pattern.test(value)) {
      // invalid input, prevent input
      return true;
    }
    return false;
  }

}
