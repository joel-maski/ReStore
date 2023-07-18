import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
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
                <Button size="small" color="primary">
                    Add to cart
                </Button>
                <Button size="small" color="primary">
                    View
                </Button>
            </CardActions>
        </Card>
    )
}