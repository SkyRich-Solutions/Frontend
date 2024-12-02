import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    Row_ID: {
        type: Number,
        required: true
    },
    Material: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Plant: {
        type: String,
        required: true
    },
    Plant_Specific_Material_Status: {
        type: String,
        required: true
    },
    Batch_ManagementPlant: {
        type: String,
        default: ''
    },
    Serial_No_Profile: {
        type: String,
        required: true
    },
    Replacement_Part: {
        type: String,
        default: ''
    },
    Used_in_a_S_bom: {
        type: String,
        default: ''
    }
});

const UnProcessed = mongoose.model('UnProcessed', materialSchema);

export default UnProcessed;
