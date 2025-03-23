import path from "path";
import multer from "multer";

const uploadLogoPaths = {
  "/clients/create": "./uploads/clientsLogo",
  "/providers/create": "./uploads/providersLogo",
  "/users/create": "./uploads/usersLogo",
  "/edit/:id": "./uploads/usersLogo", // Path for user edit
  "/clients/edit/:id": "./uploads/clientsLogo",
  "/providers/edit/:id": "./uploads/providersLogo",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Déterminer le chemin de destination basé sur la route
    let routePath = req.route.path;

    // Log pour débogage
    console.log("Upload request for route:", routePath);
    console.log("Available paths:", Object.keys(uploadLogoPaths));

    // Pour les routes avec des paramètres comme /edit/:id
    if (routePath.includes("/:id")) {
      // Extraire la partie avant /:id
      routePath = routePath.split("/:id")[0] + "/:id";
    }

    const uploadDir = uploadLogoPaths[routePath] || "./uploads";
    console.log("Selected upload directory:", uploadDir);

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  // take storage params up
  storage: storage,
  fileFilter: function (req, file, callback) {
    console.log("Upload middleware - File received:", file.originalname);
    console.log("Upload middleware - File type:", file.mimetype);

    // Check if the file type is an image
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      console.log("Upload middleware - File rejected: not an image");
      callback(new Error("Not an image! Please upload only images."), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // limit file size at 2Mb
  },
});
// console.log("///////;okaw////////")
// process.exit(1)

export default upload;
