// import { ApplicationApis } from "@/apis/ApplicationApis";
// import { PreRegistrationUserSaver } from "@/workers/PreRegistrationUserSaver";

// export class ServiceLocator {
//   public applicationApis: ApplicationApis | undefined;
//   public preRegistrationUserSaver: PreRegistrationUserSaver | undefined;

//   GetApplicationApis = (): ApplicationApis => {
//     if (!this.applicationApis) {
//       this.applicationApis = new ApplicationApis();
//     }
//     return this.applicationApis;
//   };

//   GetPreRegistrationUserSaver = (): PreRegistrationUserSaver => {
//     if (!this.preRegistrationUserSaver) {
//       this.preRegistrationUserSaver = new PreRegistrationUserSaver(
//         this.GetApplicationApis()
//       );
//     }
//     return this.preRegistrationUserSaver;
//   };
// }

// export let serviceLocator: ServiceLocator = new ServiceLocator();
