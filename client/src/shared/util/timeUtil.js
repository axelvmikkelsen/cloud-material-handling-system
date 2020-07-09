const CURRENT_TIMEZONE = 2;

const timestampToDate = (t) => {

}

const convertToDate = (timestamp) => {
   let date = new Date(timestamp);
   let day = date.getDay();
   let month = date.getMonth();
   let year = date.getFullYear();
   let hours = date.getHours();
   let minutes = "0" + date.getMinutes();
   let seconds = "0" + date.getSeconds();
 
   return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '   ' + day + '/' + month + '-' + year ;
 }

const timestamptToTimeAgo = (t) => {
   // Now in milliseconds
   const now = (Date.now() - (CURRENT_TIMEZONE*60*60*1000))/1000
   let diff = Math.round(now - t)/60; // Minutes
   
   if (diff >= 60) {
      return Math.round(diff/60) + ' hours ago'
   }

   diff = Math.round(diff)
   if (diff === 0) {
      return 'Just now'
   }
   return diff + ' minutes ago'
}

exports.timestampToDate = timestampToDate; 
exports.timestamptToTimeAgo = timestamptToTimeAgo; 
exports.convertToDate = convertToDate;