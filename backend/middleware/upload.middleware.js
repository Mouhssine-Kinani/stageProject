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
    console.log(
      "Processing file upload:",
      file.originalname,
      "mimetype:",
      file.mimetype
    );

    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.error(
        "Only JPG & PNG & JPEG files are supported! Got:",
        file.mimetype
      );
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // limit file size at 2Mb
  },
});
// console.log("///////;okaw////////")
// process.exit(1)

export default upload;
