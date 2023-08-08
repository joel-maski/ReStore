import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
    const { productParams } = useAppSelector(s => s.catalog);
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    //Acts like a timeout function, give opportunity to wait for a period of time before execution
    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({ searchTerm: event.target.value }))
    }, 1000);

    return (
        <TextField
            label='Search products'
            variant="outlined"
            fullWidth
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}