const fs = require("fs");
exports.deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      return next(new Error(err));
    }
  });
};
