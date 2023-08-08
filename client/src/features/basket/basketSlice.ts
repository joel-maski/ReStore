import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

//Create Thunk
//return type of thunk - <object type, arguments>
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    'basket/addBasketItemAsync',
    async ({ productId, quantity = 1 }, thunkApi) => {
        try {
            // return the Basket object, as '<Basket...' declared above
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            console.log(error);
            return thunkApi.rejectWithValue({ error: error.data });
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number, name?: string }>(
    'basket/removeBasketItemAsync',
    async ({ productId, quantity }, thunkApi) => {
        try {
            // no return required, hence '<void...' declared above
            await agent.Basket.removeItem(productId, quantity);
        } catch (error: any) {
            console.log(error);
            return thunkApi.rejectWithValue({ error: error.data });
        }
    }
);

//Create Slice
export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        }
    },
    //Used as callback to provide feeback during execution of Thunk async functions. 
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });

        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });

        builder.addCase(addBasketItemAsync.rejected, (state) => {
            state.status = 'idle';
        });

        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });

        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity;
            if (state.basket!.items[itemIndex].quantity === 0) {
                state.basket!.items.splice(itemIndex, 1);
            }
            state.status = 'idle';
        });

        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    }),
});

export const { setBasket } = basketSlice.actions;
