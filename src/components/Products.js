import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart.js";
import { generateCartItemsFrom } from "./Cart.js";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [items, setItems] = useState([]);

  const performAPICall = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${config.endpoint}/products`;
      const response = await axios.get(url);
      setProductList(response.data);
      setOriginalProducts(response.data);
      return response.data;
    } catch (error) {
      console.error("Error Fetching Products:", error);
      setError("Failed to load products. Please try again later.");
      enqueueSnackbar("Failed to load products. Please try again later.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isItemInCart = (items, productId) => {
    if (items) {
      return items.findIndex((item) => item.productId === productId) !== -1;
    }
  };

  const updateCartItems = async (cartData, productData) => {
    const cartItem = await generateCartItemsFrom(cartData, productData);
    await setItems(cartItem);
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("Item already in cart.", { variant: "warning" });
    }

    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await updateCartItems(res.data, products);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  useEffect(() => {
    const onLoadHandler = async () => {
      const products = await performAPICall();
      const tokenId = localStorage.getItem("token");
      if (tokenId) {
        setToken(tokenId);
        const cartData = await fetchCart(tokenId);
        const cartDetails = await generateCartItemsFrom(cartData, products);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
  }, []);

  const performSearch = async (text) => {
    if (text) {
      try {
        const res = await axios.get(
          `${config.endpoint}/products/search?value=${text}`
        );
        setError("");
        setProductList(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Product Is Not Available.");
          enqueueSnackbar("Product Is Not Available.", {
            variant: "error",
          });
          setProductList([]);
        }
      }
    } else {
      setError("");
      setProductList(originalProducts);
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setDebounceTimeout(timeout);
    return () => clearTimeout(timeout);
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

   return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, debounceTimeout)}
      />

      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item size={{ xs: 12, md: token ? 9 : 12 }}>
          <Box className="hero">
            <p className="hero-heading">
              India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="40vh"
              >
                <CircularProgress />
                <span style={{ marginLeft: 8 }}>Loading Products...</span>
              </Box>
            ) : error ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="40vh"
              >
                <SentimentDissatisfied color="error" />
                <span style={{ marginLeft: 8 }}>No Products Found</span>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {productList.map((item) => (
                  <Grid 
                    item 
                    key={item._id} 
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <ProductCard
                      product={item}
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          items,
                          productList,
                          item._id,
                          1,
                          { preventDuplicate: true }
                        );
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {token && (
          <Grid item size={{ xs: 12, md: 3 }}>
            <Cart items={items} product={productList} handleQuantity={addToCart} />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;