
const Auth = require("../Models/authModel")


const findUserService = async () => {
    const allUser = await Auth.find()

    return allUser
}

module.exports = findUserService
