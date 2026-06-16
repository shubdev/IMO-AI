import userModel from "../models/user.model.js";

// FIND USER BY EMAIL
export async function findUserByEmail(email) {
  return await userModel.findOne({
    email,
  });
}

// FIND USER BY GOOGLE ID
export async function findUserByGoogleId(googleId) {
  return await userModel.findOne({
    googleId,
  });
}

// CREATE USER
export async function createUser(data) {
  return await userModel.create(data);
}

// LINK GOOGLE ACCOUNT TO EXISTING USER
export async function linkGoogleAccount(userId, googleId) {
  return await userModel.findByIdAndUpdate(
    userId,
    { googleId },
    { new: true },
  );
}

// FIND USER BY ID
export async function findUserById(id) {
  return await userModel.findById(id);
}
