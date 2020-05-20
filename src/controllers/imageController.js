const axios = require("axios");
const { success, error } = require("../helpers/response.js");
const flicrkey = process.env.Secret
exports.getImage = async (req, res) => {
  
  try {

    let tag = req.query.tag;
    let message = "Successfully get image";
    let page = req.query.page;
    let photos = await axios.get(
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flicrkey}&per_page=20&page=${page}&tags=${tag}&format=json&nojsoncallback=1`
    );

    let data = photos.data.photos.photo;
  
    let photosArray = [];
    data.forEach((photo) => {
      photosArray.push(
        `http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
      );
    });
    success(res, message, photosArray, 200);
  }
  catch (err) {
      let message = "Photo not found";
      error(res, message, err, 422);
  }
};
