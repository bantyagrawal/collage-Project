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

module.exports = {
    findOne,
    saveData,
    findOneAndUpdate,
}