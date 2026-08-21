// reducers/index.js
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import schoolsReducer from "./schoolReducer";
import adminsReducer from "./adminsSlice"; 
import adminSecretarySlice from "./adminSecretarySlice";
import monitorsSlice from "./monitorsSlice";
import locationSlice from "./locationSlice";
import candidateSlice from "./candidateSlice";
import competencesSlice from "./competencesSlice";
import subCompetencesReducer from './subCompetencesSlice';
import offerSlice from './offerSlice';
import reservationSlice from './reservationSlice';
import commentsSlice from './commentsSlice';
import studentStatsSlice from './studentStatsSlice';
import monitorScheduleSlice from './monitorScheduleSlice';
import monitorProfileSlice from './monitorProfileSlice';
import monitorProposalsSlice from './monitorProposalsSlice';
import monitorLieuxReducer from './monitorLieuxSlice';
import mediaControlReducer from './mediaControlSlice';
import monitorDocumentsReducer from './monitorDocumentsSlice';
import professionalDocumentsReducer from './professionalDocumentsSlice';
import ordersReducer from './ordersSlice';
import basketsReducer from './basketsSlice';
// import reservationSlice form './reservationSlice';


const rootReducer = combineReducers({
    auth: authReducer,
    schools: schoolsReducer,
    admins:adminsReducer,
    secretaries:adminSecretarySlice,
    monitors:monitorsSlice,
    locations: locationSlice,
    candidates:candidateSlice,
    competences:competencesSlice,
    subCompetences: subCompetencesReducer,
    offers:offerSlice,
    reservation:reservationSlice,
    comments:commentsSlice,
    studentStats: studentStatsSlice,
    monitorSchedule: monitorScheduleSlice,
    monitorProfile: monitorProfileSlice,
    monitorProposals: monitorProposalsSlice,
    monitorLieux: monitorLieuxReducer,
    mediaControl: mediaControlReducer,
    monitorDocuments: monitorDocumentsReducer,
    professionalDocuments: professionalDocumentsReducer,
    orders: ordersReducer,
    baskets: basketsReducer,

});

export default rootReducer;
