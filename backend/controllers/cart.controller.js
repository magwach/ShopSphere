export async function getAllCartItems(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    await user.populate("cartItems.product");
    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function addToCart(req, res) {
  const { productId } = req.body;

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const cartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId });
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function deleteFromCart(req, res) {
  const { productId } = req.body;

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateQuantity(req, res) {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const cartItem = user.cartItems.find((item) => item._id.toString() === id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== id
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
        data: user.cartItems,
      });
    }
    cartItem.quantity = quantity;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function clearCart(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    user.cartItems = [];
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: user.cartItems,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
