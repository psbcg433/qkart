import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;

  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));

  return nextCart;
};

export const getTotalCartValue = (items = []) => {
  return items.reduce((acc, ele) => acc + ele.cost * ele.qty, 0);
};

const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly = false,
}) => {
  if (isReadOnly) {
    return <Box>Qty: {value}</Box>;
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const getTotalItems = (items) => {
  return items.reduce((acc, ele) => acc + ele.qty, 0);
};

const Cart = ({ product, items = [], handleQuantity, isReadOnly }) => {
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) => (
          <Box
            display="flex"
            alignItems="flex-start"
            padding="1rem"
            key={item.productId}
          >
            <Box className="image-container">
              <img
                src={item.image}
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <ItemQuantity
                  isReadOnly={isReadOnly}
                  value={item.qty}
                  handleDelete={() =>
                    handleQuantity(
                      localStorage.getItem("token"),
                      items,
                      product,
                      item.productId,
                      item.qty - 1
                    )
                  }
                  handleAdd={() =>
                    handleQuantity(
                      localStorage.getItem("token"),
                      items,
                      product,
                      item.productId,
                      item.qty + 1
                    )
                  }
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        {isReadOnly && (
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        )}
      </Box>

      {isReadOnly ? (
        <Box className="cart">
          <Box padding="1rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem">
              Order Total
            </Box>
          </Box>

          <Box px="1rem" py="0.5rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              Products
            </Box>
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              {getTotalItems(items)}
            </Box>
          </Box>

          <Box px="1rem" py="0.5rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              Subtotal
            </Box>
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              ${getTotalCartValue(items)}
            </Box>
          </Box>

          <Box px="1rem" py="0.5rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              Shipping Charges
            </Box>
            <Box color="#3C3C3C" fontWeight="500" fontSize="1rem">
              $0
            </Box>
          </Box>

          <Box padding="1rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" fontWeight="700" fontSize="1.2rem">
              Total
            </Box>
            <Box color="#3C3C3C" fontWeight="700" fontSize="1.2rem">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className="cart">
          <Box padding="1rem" display="flex" justifyContent="space-between">
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
