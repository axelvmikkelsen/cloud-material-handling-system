const HttpError = require('../models/http-error');

const SmartObject = require('../models/so');
const MHMObject = require('../models/mhm');

const findTag = async (tagId) => {
   let tagObject;
   try {
     tagObject = await SmartObject.find({ name: tagId });
   } catch (err) {
     throw new HttpError('Could not find a SO with provided tag ID', 500);
   }
   if (tagObject.length === 0) {
     try {
       tagObject = await MHMObject.find({ name: tagId });
     } catch (err) {
       throw new HttpError('Could not find a MHM with provided tag ID', 500);
     }
   }
   if (!tagObject) {
     throw new HttpError('Something went wrong..', 422);
   }
   if (tagObject.length == 1) {
     tagObject = tagObject[0];
   }
   return tagObject;
 };

 const classifyZone = (zones, coord) => {
   return zones.filter((zone) => {
     let ret = 0;
     if (zone.xstart < coord.x && zone.ystart < coord.y) {
       if (zone.xend > coord.x && zone.yend > coord.y) {
         ret = 1;
       }
     }
     return ret;
   })[0];
 };

 const timestampToDateTime = (timestamp) => {
   const offset = new Date().getTimezoneOffset()*60; // In seconds
   return new Date((timestamp - offset)*1000);
}
 

 exports.findTag = findTag;
 exports.classifyZone = classifyZone;
 exports.timestampToDateTime = timestampToDateTime;