import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../../../app/models/product";
import { Link } from "react-router-dom";
import { useState } from "react";
import agent from "../../../../app/api/agent";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { useStoreContext } from "../../../../app/context/StoreContext";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const [loading, setLoading] = useState(false);
    const { setBasket } = useStoreContext();

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    return (
        <Card>
            <CardHeader
                avatar={<Avatar sx={{ backgroundColor: 'secondary.main' }}>{product.name.charAt(0).toUpperCase()}</Avatar>}
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}>
            </CardHeader>
            <CardActionArea>
                <CardMedia
                    component="img"
                    sx={{ height: 200, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                    image={product.pictureUrl}
                    alt={product.name}
                />
                <CardContent>
                    <Typography gutterBottom color='secondary' variant="h5">
                        ${(product.price / 100).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.brand} / {product.type}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <LoadingButton size="small" color="primary" loading={loading} onClick={() => handleAddItem(product.id)}>
                    Add to cart
                </LoadingButton>
                <Button component={Link} to={`/catalog/${product.id}`} size="small" color="primary">
                    View
                </Button>
            </CardActions>
        </Card>
    )
}