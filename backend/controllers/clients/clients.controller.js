import Client from "../../models/Clients/client.model.js";

// Create a new client
export const createClient = async (req, res) => {
  try {
    const client = new Client({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      region: req.body.region,
      renewal_status: req.body.renewal_status,
      products: req.body.products,
    });
    if (req.file) {
      client.logo = req.file.path;
    }
    const newClient = await client.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Client created successfully",
        data: newClient,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter = {
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };
    }

    // Récupération des clients avec calcul du total des prix
    const clients = await Client.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $addFields: {
          totalPrice: { $sum: "$productsDetails.price" },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalClients = await Client.countDocuments(filter);
    const totalPages = Math.ceil(totalClients / limit);

    res.status(200).json({
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
      totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("products");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Client retrieved successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// Show edit client page
export const showEditClientPage = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Client retrieved successfully",
        data: client,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

// Update an existing client
export const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: null });
  }
};

// Delete a client
export const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Client deleted successfully",
        data: deletedClient,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le nombre total de clients
export const getClientsCount = async (req, res) => {
  try {
    const count = await Client.countDocuments();
    res.status(200).json({
      success: true,
      message: "Clients count retrieved successfully",
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      count: 0,
    });
  }
};
