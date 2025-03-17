import bcrypt from "bcryptjs";
import User from "../../models/Users/user.model.js";


// funciton that fetches all users
// export const getUsers = async (req, res, next) => {
//   try {
//     let page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     let skip = (page - 1) * limit;

//     const users = await User.find().skip(skip).limit(limit).select("-password");
//     const countUsers = await User.countDocuments();
//     const totalPages = Math.ceil(countUsers / limit)
//     res.status(200).json({users , totalPages});
//   } catch (error) {
//     next(error);
//   }
// };

export const getUsers = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    // Build a query object: if a search query is provided, add search criteria; otherwise, return all.
    let query = {};
    if (req.query.search && req.query.search.trim() !== "") {
      const regex = new RegExp(req.query.search, "i"); // case-insensitive search
      query = {
        $or: [
          { fullName: { $regex: regex } },
          { email: { $regex: regex } }
        ]
      };
    }

    // Find users based on the query (either filtered or normal)
    const users = await User.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (-1)
      .skip(skip)
      .limit(limit)
      .select("-password");
    // Count matching users for pagination
    const countUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(countUsers / limit);

    res.status(200).json({ data: users, totalPages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// function that fetches a single user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// function that creates a new user
export const createUser = async (req, res, next) => {
  try {
    const { reference, fullName, email, password, role, status } = req.body;
    // check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    
    // Set default password if none provided
    const passwordToHash = password || "changeme";
    // const passwordToHash = password || "changeme";
    
    // hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passwordToHash, salt);

    const newUser = new User({
      reference,
      fullName,
      email,
      password: hashedPassword,
      role,
      status,
    });

    await newUser.save();

    // Prepare response data - don't include the password
    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "User created successfully",
      data: userData,
      ...(password ? {} : { note: "Default password 'changeme' has been set for this user" })
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// function that updates a user
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    // if a new password is provided, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// function that deletes a user

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({
        message: "User not found",
      });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
