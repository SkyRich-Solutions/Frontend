import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    rowId: { type: Number, required: true }, // Row ID
    material: { type: Number, required: true }, // Material
    description: { type: String, required: true }, // Description
    plant: { type: String, required: true }, // Plant
    plantSpecificMaterialStatus: { type: String, required: true }, // Plant-Specific Material Status
    batchManagementPlant: { type: String, default: '' }, // Batch Management (Plant)
    serialNoProfile: { type: String, required: true }, // Serial No. Profile
    replacementPart: { type: String, default: '' }, // Replacement Part
    usedInSBom: { type: String, default: '' } // Used in a S-bom
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
