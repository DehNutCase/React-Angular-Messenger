user = require("./userModel");

var snapshotModel = new Schema({ users: [user] });

module.exports = mongoose.model("snapshot", snapshotModel, "snapshotList");
