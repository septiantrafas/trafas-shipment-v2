import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

const initialState = {
  orderList: [],
  orderListStatus: "idle",
  orderListError: null,
  orderById: [],
  orderByIdStatus: "idle",
  orderByIdError: null,
  createOrder: [],
  createOrderStatus: "idle",
  createOrderError: null,
  orderDelete: [],
  orderDeleteStatus: "idle",
  orderDeleteError: null,
  orderUpdate: [],
  orderUpdateStatus: "idle",
  orderUpdateError: null,
};

export const fetchOrder = createAsyncThunk("orders/fetchOrder", async () => {
  const response = await supabase
    .from("orders")
    .select(`*,employees:employee_id(name)`);
  if (response.error) {
    alert(response.error.message);
  }
  return response;
});

export const fetchOrderByEmployee = createAsyncThunk(
  "orders/fetchOrderByEmployee",
  async (id) => {
    const response = await supabase
      .from("orders")
      .select(`*,employees:employee_id(name)`)
      .eq("employee_id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id) => {
    const response = await supabase.from("orders").select("*").eq("id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (newData) => {
    const response = await supabase.from("orders").insert([newData]);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id) => {
    const response = await supabase.from("orders").delete().match({ id: id });
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        customer_name: updatedData.customer_name,
        customer_address: updatedData.customer_address,
        pickup_date: updatedData.pickup_date,
        product_list: updatedData.product_list,
        status: updatedData.status,
        explaination: updatedData.explaination,
        note: updatedData.note,
      })
      .eq("id", updatedData.id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

export const updateDataByCollectedStatus = createAsyncThunk(
  "orders/updateDataByCollectedStatus",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        number: updatedData.number,
        product_list: updatedData.product_list,
      })
      .eq("id", updatedData.order_id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderList: (state) => {
      state.orderList = [];
    },
    clearOrderListStatus: (state) => {
      state.orderListStatus = "idle";
    },
    clearOrderByIdData: (state) => {
      state.orderById = [];
    },
    clearOrderByIdStatus: (state) => {
      state.orderByIdStatus = "idle";
    },
    clearOrderDeleteStatus: (state) => {
      state.orderDeleteStatus = "idle";
    },
    clearCreateOrderStatus: (state) => {
      state.createOrderStatus = "idle";
    },
    clearOrderUpdateStatus: (state) => {
      state.orderUpdateStatus = "idle";
    },
    clearIdStatus: (state) => {
      state.idStatus = "idle";
    },
  },
  extraReducers: {
    [fetchOrder.pending]: (state) => {
      state.orderListStatus = "loading";
    },
    [fetchOrder.fulfilled]: (state, action) => {
      state.orderListStatus = "succeeded";
      state.orderList = action.payload.data;
    },
    [fetchOrder.rejected]: (state, action) => {
      state.orderListStatus = "failed";
      state.orderListError = action.error.message;
    },

    [fetchOrderByEmployee.pending]: (state) => {
      state.orderListStatus = "loading";
    },
    [fetchOrderByEmployee.fulfilled]: (state, action) => {
      state.orderListStatus = "succeeded";
      state.orderList = action.payload.data;
    },
    [fetchOrderByEmployee.rejected]: (state, action) => {
      state.orderListStatus = "failed";
      state.orderListError = action.error.message;
    },

    [fetchOrderById.pending]: (state) => {
      state.orderByIdStatus = "loading";
    },
    [fetchOrderById.fulfilled]: (state, action) => {
      state.orderByIdStatus = "succeeded";
      state.orderById = action.payload.data[0];
    },
    [fetchOrderById.rejected]: (state, action) => {
      state.orderByIdStatus = "failed";
      state.orderByIdError = action.error.message;
    },
    [createNewOrder.pending]: (state) => {
      state.createOrderStatus = "loading";
    },
    [createNewOrder.fulfilled]: (state, action) => {
      state.createOrderStatus = "succeeded";
      state.orderList = state.orderList.concat(action.payload.data[0]);
    },
    [createNewOrder.rejected]: (state, action) => {
      state.createOrderStatus = "failed";
      state.createOrderError = action.error.message;
    },
    [deleteOrder.pending]: (state) => {
      state.orderDeleteStatus = "loading";
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.orderDeleteStatus = "succeeded";
      state.orderDelete = action.payload.data;
      const array = current(state.orderList);
      // eslint-disable-next-line eqeqeq
      const temp = array.filter(
        (element) => element.id != action.payload.data[0].id
      );
      state.orderList = temp;
    },
    [deleteOrder.rejected]: (state, action) => {
      state.orderDeleteStatus = "failed";
      state.orderDeleteError = action.error.message;
    },

    [updateOrder.pending]: (state) => {
      state.orderUpdateStatus = "loading";
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.orderUpdateStatus = "succeeded";
      state.orderUpdate = action.payload.data;
    },
    [updateOrder.rejected]: (state, action) => {
      state.orderUpdateStatus = "failed";
      state.orderUpdateError = action.error.message;
    },

    [updateDataByCollectedStatus.pending]: (state) => {
      state.orderUpdateStatus = "loading";
    },
    [updateDataByCollectedStatus.fulfilled]: (state, action) => {
      state.orderUpdateStatus = "succeeded";
      state.orderUpdate = action.payload.data;
    },
    [updateDataByCollectedStatus.rejected]: (state, action) => {
      state.orderUpdateStatus = "failed";
      state.orderUpdateError = action.error.message;
    },
  },
});

export const {
  clearOrderList,
  clearOrderByIdData,
  clearOrderByIdStatus,
  clearOrderDeleteStatus,
  clearCreateOrderStatus,
  clearOrderUpdateStatus,
  clearOrderListStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer;
