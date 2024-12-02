import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    rowId: {
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
    plantSpecificMaterialStatus: {
        type: String,
        required: true
    },
    batchManagementPlant: {
        type: String,
        default: ''
    },
    serialNoProfile: {
        type: String,
        required: true
    },
    replacementPart: {
        type: String,
        default: ''
    },
    usedInSBom: {
        type: String,
        default: ''
    }
});

const PostMaterial = mongoose.model('PostMaterial', materialSchema);

export default PostMaterial;
