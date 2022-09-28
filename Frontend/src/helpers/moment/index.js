import moment from "moment";

export const getCountMinutes = (startTime, endTime) => {
  let startTimeMoment = moment(startTime, "HH:mm");
  let endTimeMoment = moment(endTime, "HH:mm");

  let duration = moment.duration(endTimeMoment.diff(startTimeMoment));
  let hours = parseInt(duration.asHours());
  let minutes = parseInt(duration.asMinutes()) - hours * 60;

  return hours * 60 + minutes;

}

export const convertMinutesToTimes = (minutes) => {
 
  const hours = parseInt(Math.floor(minutes / 60));
  const minutesC = minutes % 60;
  
  return moment(`${hours}:${minutesC}`, "H:m").format('HH:mm');

}