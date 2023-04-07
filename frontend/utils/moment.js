import moment from 'moment';


// TODO: Update the usage of the following functions
export const isTimeLessThan = (firstTime, secondTime) => {
  let timeA = moment(firstTime);
  let timeB = moment(secondTime);

  if (timeA.hour() < timeB.hour()) {
    // add one day to time B
    return true;
  } else return false;
};

export const isTimeGreaterThan = (firstTime, secondTime) => {
  let timeA = moment(firstTime);
  let timeB = moment(secondTime);

  if (timeA.hour() > timeB.hour()) {
    // add one day to time B
    return true;
  } else return false;
};

export const isTimeLessThanOrEqual = (firstTime, secondTime) => {
  let timeA = moment(firstTime);
  let timeB = moment(secondTime);
  
  if (timeA.hour() <= timeB.hour()) {
    // add one day to time B
    return true;
  } else return false;
};

export const isTimeGreaterThanOrEqual = (firstTime, secondTime) => {
  let timeA = moment(firstTime);
  let timeB = moment(secondTime);

  if (timeA.hour() >= timeB.hour()) {
    // add one day to time B
    return true;
  } else return false;
};

