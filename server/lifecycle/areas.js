const AreaObject = require('../models/area');
const HttpError = require('../models/http-error');

const getAreas = async () => {
   let areas;
   try {
     areas = await AreaObject.find({ grid: process.env.GRID_ID });
   } catch (err) {
       throw new HttpError('Could not retrieve areas, an error occured', 500)
   }
 
   if (!areas) {
     throw new HttpError('No areas found, please try again', 422);
   }
   return areas;
}

exports.getAreas = getAreas;