import InstaUser, { IUser } from "./user.model";
// import Shops from "./user.model";

// export const useIAM = async () => {
//     try {
//         console.log("working");
//         const data = await Shops.find();
//         console.log(data);

//         // if (!result?.ok) {
//         //     throw data
//         // }
//         return data;

//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// }

export const insertUser = async (userData: IUser) => {
  try {
    const instaUser = await InstaUser.create(userData);

    return instaUser;
  } catch (error: any) {
    return error;
  }
};

export const userSuggestions = async (loggedInUser: any) => {
  try {
    //get all the users excluding the logged in user
    const appUsers = await InstaUser.find({
      userId: { $ne: loggedInUser },
    });

    // now check if the logged in user present in the followers list of the users
    //if not present then give the user as suggestion
    const suggestions = appUsers.filter((user) => {
      return !user.followers.includes(loggedInUser);
    });

    return suggestions;
  } catch (error: any) {
    return error;
  }
}


export const followingUser = async (loggedInUser: string, userToFollow: string) => {
  try {

    // je follow kortey gesey arek user k tar following a shei user add hobey
    //first check if the user is already following the user
    const user = await InstaUser.findOneAndUpdate(
      { userId: loggedInUser },
      { $push: { following: userToFollow } },
      { new: true }
    );

    // jakey follow kortey gesey tar followers list a loggedin user add hobey
    await InstaUser.findOneAndUpdate(
      { userId: userToFollow }, //finding the user
      { $push: { followers: loggedInUser } },
      { new: true }
    );

    return user;
  } catch (error: any) {
    return error;
  }
}
