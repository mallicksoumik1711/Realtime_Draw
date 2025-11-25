const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        accessControl: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },

        inviteUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        sessionPurpose: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
