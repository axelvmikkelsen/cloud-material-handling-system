const ZoneObject = require('../models/zone');
const HttpError = require('../models/http-error');

const getZones = async () => {
   let zns;
   try {
     zns = await ZoneObject.find({ grid: process.env.GRID_ID });
   } catch (err) {
       throw new HttpError('Could not retrieve zones, an error occured', 500)
   }
 
   if (!zns) {
     throw new HttpError('No zones found, please try again', 422);
   }
   return zns
}

exports.getZones = getZones;