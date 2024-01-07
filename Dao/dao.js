const { statusCode } = require("../Constant/constant");
const { generateError } = require("../Utils/utils");

const findOne = async (model,query) => {
    try {
        const data = await model.findOne(query);
        return data;
    } catch (err) {
        throw new Error(err);
    }
}

const saveData = async (model,data) => {
    try {
        return await new model(data).save();
    } catch (err) {
        throw new Error(err);
    }
}

const findOneAndUpdate = async (model,findquery,updatequery) => {
    return await model.findOneAndUpdate(findquery,updatequery,{new: true});
}

const findAll = async (model) => {
    try {
        return await model.find();
    } catch (err) {
        throw err;
    }
}

const updateById = async (model, id, updatequery) => {
    try {
        return await model.findByIdAndUpdate(id,updatequery,{new: true});
    } catch (err) {
        throw await generateError(err.message,statusCode['Internal Server Error']);
    }
}

module.exports = {
    findOne,
    saveData,
    findOneAndUpdate,
    findAll,
    updateById,
}