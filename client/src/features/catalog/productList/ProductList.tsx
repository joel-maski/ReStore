import { Grid } from "@mui/material";
import { Product } from "../../../app/models/product";
import ProductCard from "./productCard/ProductCard";
import { useAppSelector } from "../../../app/store/configureStore";
import ProductCardSkeleton from "../productCardSkeleton";

interface Props {
    products: Product[];
}

export default function ProductList({ products }: Props) {

    const { productsLoaded } = useAppSelector(s => s.catalog);

    return (
        <Grid container spacing={4}>
            {products.map((product) => (
                <Grid item xs={4} key={product.id}>
                    {!productsLoaded ? (
                        <ProductCardSkeleton />
                    ) :
                        <ProductCard product={product} />
                    }
                </Grid>
            ))}
        </Grid>
    )
}