import redis from "../db/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../db/cloudinary.js";

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllFeturedProducts(req, res) {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: JSON.parse(featuredProducts),
      });
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({
        success: false,
        message: "No featured products found",
      });
    }

    redis.set("featured_products", JSON.stringify(featuredProducts));
    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      data: featuredProducts,
    });
  } catch (error) {}
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, category, image } = req.body;

    let cloudunaryResponse = null;

    if (image) {
      cloudunaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudunaryResponse ? cloudunaryResponse.secure_url : null,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to delete product image",
          error: error.message,
        });
      }
    }
    await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getRecommendedProducts(req, res) {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Recommended products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}


export async function getCategoryProducts(req, res){
    try {
        const { category } = req.params;
    } catch (error) {
        
    }
}