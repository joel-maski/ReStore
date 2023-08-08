import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

// Create Entity Adapter
const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();

    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);

    if (productParams.searchTerm) {
        params.append('searchTerm', productParams.searchTerm);
    }

    if (productParams.brands.length > 0) {
        params.append('brands', productParams.brands.toString());
    }

    if (productParams.types.length > 0) {
        params.append('types', productParams.types.toString());
    }

    return params;
}

// Create Thunk
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, mythunkAPI) => { //use _ underscore for non existent parameter
        const params = getAxiosParams(mythunkAPI.getState().catalog.productParams);
        try {
            const response = await agent.Catalog.list(params);
            mythunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        } catch (error: any) {
            console.log(error);
            return mythunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

// Create Thunk
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, mythunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            console.log(error);
            return mythunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

// Create Thunk
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

// Helper function
function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: []
    }
}

// Create Slice
export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 };
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload };
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        }
    },
    //If async thunk created then use extraReducers
    extraReducers: (builder => {
        // Fetch Products
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        // Fetch Single Product
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        // Fetch filtered Products
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.status = 'idle';
            state.filtersLoaded = true;
        });
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })
});

// Create entity adapter selectors
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;