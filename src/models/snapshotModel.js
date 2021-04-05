user = require("./userModel");

var snapshotModel = new Schema({ users: { type: [], required: true } });

module.exports = mongoose.model("snapshot", snapshotModel, "snapshotList");
