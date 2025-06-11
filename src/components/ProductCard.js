import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
   
   
        <Card className="card" key={product._id}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
          />

          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
              ${product.cost}
            </Typography>
            <Rating value={product.rating} precision={1} readOnly />
          </CardContent>

          <CardActions>
            <Button variant="contained" fullWidth onClick={() => handleAddToCart(product._id)}>
              <AddShoppingCartOutlined fontSize="small" sx={{ marginRight: 1 }} />
              Add to Cart
            </Button>
          </CardActions>
        </Card>
     
   
  );
};

export default ProductCard;
