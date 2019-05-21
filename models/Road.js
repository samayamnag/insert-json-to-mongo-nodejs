var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var RoadSchema = new mongoose.Schema({
    road_id: { type: String },
    name: { type: String, required: true },
    start_point: [{ type: mongoose.Schema.Types.Decimal128 }],
    end_point: [{ type: mongoose.Schema.Types.Decimal128 }],
    total_length_in_mts: { type: mongoose.Schema.Types.Decimal128 },
    surveyed_cnt: { type: Number, default: 0 },
    surveyed_percentage: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
    no_of_segments: { type: Number, default: 1 },
    no_of_segments_surveyed: { type: Number, default: 0 },
    two_sided: { type: Boolean, default: false },
    wards: [],
    city_id: { type: Number },
    city_name: { type: String },
    // geometry: {
    //     type: { type: String },
    //     coordinates: [
    //         [mongoose.Schema.Types.Decimal128]
    //     ]
    // },
    obstruction_percentage: { type: mongoose.Schema.Types.Decimal128 },
    segments: [
        {
            segment_id: { type: String },
            start_point: [{ type: mongoose.Schema.Types.Decimal128 }],
            end_point: [{ type: mongoose.Schema.Types.Decimal128 }],
            length_in_mts: { type: mongoose.Schema.Types.Decimal128 },
            wards: [],
            created_at: { type: Date, default: Date.now },
            surveyed_cnt: { type: Number, default: 0 },
            surveyed_percentage: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
            obstruction_percentage: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
            geometry: {
                type: { type: String },
                coordinates: [
                    [mongoose.Schema.Types.Decimal128]
                ]
            },
        }
    ]
});

RoadSchema.index({ road_id: 1 }, { name: 'roads_road_id_unique', unique: true });

const Road = mongoose.model('Road', RoadSchema, 'roadss');

module.exports = Road;