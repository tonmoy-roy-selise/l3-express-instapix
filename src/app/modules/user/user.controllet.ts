import { Request, Response, NextFunction } from "express";
// import { useIAM } from "./user.service";
import { IAMService } from "../../services/iam.services";
import { followingUser, insertUser, loggedIn, userSuggestions } from "./user.service";

export const useIAMController = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await IAMService(req);

    let maxTime = response.data.expires_in * 1000; // 7 * 60 * 1000
    let maxDate = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", response.data.access_token, {
      maxAge: maxTime,
      httpOnly: true,
      secure: true,
    });
    // res.cookie('refresh_token', response.data.refresh_token, { maxAge: maxDate, httpOnly: true, secure: true });
    res.cookie("refresh_token", response.data.refresh_token, {
      maxAge: maxDate,
      httpOnly: true,
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);

      return res.status(error?.response?.status).json({
        status: "error",
        ...error?.response?.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);

      return res.status(error?.response?.status).json({
        status: "error",
        ...error?.response?.data,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);

      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }

    // console.log(error.config);

    // return res.status(500).json({
    //     status: "error",
    //     error: error
    // })
  }
};

// export const shopsData = async (req: Request | any, res: Response, next: NextFunction) => {
//     try {
//         const resultData = await useIAM();

//         res.status(200).json(resultData);
//     } catch (error: any) {
//         return res.status(500).json({
//             status: "error",
//             error: error
//         })
//     }

//     // return res.status(response.status).json(response.data);
// }

// creating insta user after registration

export const createInstaUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userData  = await insertUser(req.body);

    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//get loggedin user data from microservice
export const loggedInUser=async (
  req: Request | any,
  res: Response
) => {
  try {

    const response = await loggedIn(req);

    res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error });
  }
};


//get follow suggestions for a user who is logged in and give suggestion if he is not yet following the user
export const getSuggestions=async (
  req: Request,
  res: Response
) => {
  try {
    const  {loggedInUser}  = req.query;

    const suggestions = await userSuggestions(loggedInUser);

    return res.status(200).json({success:true,suggestions});

  } catch (error) {
    return res.status(500).json({ error});
  }
};

//make a user follow another user
export const followUser=async (
  req: Request,
  res: Response
)=> {
  try {
    const { loggedInUser, userToFollow } = req.body;

    const user = await followingUser(loggedInUser, userToFollow);

    return res.status(200).json({ user, success: true });

  } catch (error) {
    return res.status(500).json({ error });
  }
};
