import React, { createContext, useContext, useState, useEffect } from "react";
import wishListServices from "../services/wishListServices";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ Initialize from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // ✅ Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?._id;
      if (!userId) return;

      const response = await wishListServices.getWishlistCount(userId);
      const count = response?.count ?? 0;
      setWishlistCount(count);
    } catch (err) {
      console.error("Failed to fetch wishlist count", err);
      setWishlistCount(0);
    }
  };

  // ✅ Fetch actual wishlist items
const fetchWishlistItems = async () => {
  setLoadingWishlist(true);
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const userId = userData?._id;
    if (!userId) return;

    const response = await wishListServices.getUserWishlist(userId, token);
    const ids = response?.wishlist?.map((item) => item.product?._id);

    if (ids && ids.length > 0) {
      setWishlistItems(ids);
      localStorage.setItem("wishlistItems", JSON.stringify(ids));
    }
  } catch (err) {
    console.error("Failed to fetch wishlist items", err);
    // Don't override localStorage with [] here, just log the error
  } finally {
    setLoadingWishlist(false);
  }
};

 
  useEffect(() => {
    fetchWishlistCount();
    fetchWishlistItems();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        setWishlistCount,
        fetchWishlistCount,
        wishlistItems,
        setWishlistItems,
        fetchWishlistItems,
        loadingWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
