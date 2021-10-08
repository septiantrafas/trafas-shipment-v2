import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

const initialState = {
  statuslogById: [],
  statuslogByIdStatus: "idle",
  statuslogByIdError: null,
  statuslogByOrderId: [],
  statuslogByOrderIdStatus: "idle",
  statuslogByOrderIdError: null,
  statuslogByConfirmed: [],
  statuslogByConfirmedStatus: "idle",
  statuslogByConfirmedError: null,
  statuslogByDelivered: [],
  statuslogByDeliveredStatus: "idle",
  statuslogByDeliveredError: null,
  statuslogByCollected: [],
  statuslogByCollectedStatus: "idle",
  statuslogByCollectedError: null,
  statuslogByReturned: [],
  statuslogByReturnedStatus: "idle",
  statuslogByReturnedError: null,
  statuslogByDone: [],
  statuslogByDoneStatus: "idle",
  statuslogByDoneError: null,
  createStatusLog: [],
  createStatusLogStatus: "idle",
  createStatusLogError: null,
  statuslogUpdate: [],
  statuslogUpdateStatus: "idle",
  statuslogUpdateError: null,
  statuslogEmployeeUpdate: [],
  statuslogEmployeeUpdateStatus: "idle",
  statuslogEmployeeUpdateError: null,
};

export const fetchStatuslogById = createAsyncThunk(
  "orderlogs/fetchStatuslogById",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogByOrderId = createAsyncThunk(
  "orderlogs/fetchStatuslogByOrderId",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status,product_list),employees:employee_id(name)`
      )
      .eq("order_id", id)
      .order("number", { ascending: true });
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogByConfirmed = createAsyncThunk(
  "orderlogs/fetchStatuslogByConfirmed",
  async () => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "confirmed").order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogByConfirmedEmployee = createAsyncThunk(
  "orderlogs/fetchStatuslogByConfirmedEmployee",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "confirmed")
      .eq("employee_id", id).order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogByCollected = createAsyncThunk(
  "orderlogs/fetchStatuslogByCollected",
  async () => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(*)`
      )
      .eq("name", "collected").order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogByCollectedByEmployee = createAsyncThunk(
  "orderlogs/fetchStatuslogByCollectedByEmployee",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(*)`
      )
      .eq("name", "collected")
      .eq("employee_id", id).order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByDelivered = createAsyncThunk(
  "orderlogs/fetchStatuslogsByDelivered",
  async () => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "delivered").order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByDeliveredEmployee = createAsyncThunk(
  "orderlogs/fetchStatuslogsByDeliveredEmployee",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "delivered")
      .eq("employee_id", id).order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByReturned = createAsyncThunk(
  "orderlogs/fetchStatuslogsByReturned",
  async () => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status,pickup_date),employees:employee_id(name)`
      )
      .eq("name", "returned").order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByReturnedEmployee = createAsyncThunk(
  "orderlogs/fetchStatuslogsByReturnedEmployee",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status,pickup_date),employees:employee_id(name)`
      )
      .eq("name", "returned")
      .eq("employee_id", id).order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByDone = createAsyncThunk(
  "orderlogs/fetchStatuslogsByDone",
  async () => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "done").order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchStatuslogsByDoneEmployee = createAsyncThunk(
  "orderlogs/fetchStatuslogsByDoneEmployee",
  async (id) => {
    const response = await supabase
      .from("status_logs")
      .select(
        `*,orders:order_id(customer_name,customer_address,delivery_date,status),employees:employee_id(name)`
      )
      .eq("name", "done")
      .eq("employee_id", id).order('delivery_date',{foreignTable:'orders', ascending:false}).order('status',{ascending:true})
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const updateStatusLog = createAsyncThunk(
  "orderlogs/updateStatusLog",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("status_logs")
      .update({
        status: updatedData.status,
        finish_time: updatedData.finish_time,
      })
      .eq("id", updatedData.id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

export const updateEmployeeLog = createAsyncThunk(
  "orderlogs/updateEmployeeLog",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("status_logs")
      .update({
        employee_id: updatedData.employee_id,
        target_time: updatedData.target_time,
        employee2: updatedData.employee2,
        employee3: updatedData.employee3,
      })
      .eq("id", updatedData.id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

const orderlogsSlice = createSlice({
  name: "orderlogs",
  initialState,
  reducers: {
    clearStatuslogByConfirmedStatus: (state) => {
      state.statuslogByConfirmedStatus = "idle";
    },
    clearStatuslogByCollectedStatus: (state) => {
      state.statuslogByCollectedStatus = "idle";
    },
    clearStatuslogByDeliveredStatus: (state) => {
      state.statuslogByDeliveredStatus = "idle";
    },
    clearStatuslogByReturnedStatus: (state) => {
      state.statuslogByReturnedStatus = "idle";
    },
    clearStatuslogByDoneStatus: (state) => {
      state.statuslogByDoneStatus = "idle";
    },
    clearStatuslogUpdateStatus: (state) => {
      state.statuslogUpdateStatus = "idle";
    },
    clearStatuslogByOrderIdStatus: (state) => {
      state.statuslogByOrderIdStatus = "idle";
    },

    clearStatuslogEmployeeUpdateStatus: (state) => {
      state.statuslogEmployeeUpdateStatus = "idle";
    },
  },
  
  extraReducers: {
    [fetchStatuslogById.pending]: (state) => {
      state.statuslogByIdStatus = "loading";
    },
    [fetchStatuslogById.fulfilled]: (state, action) => {
      state.statuslogByIdStatus = "succeeded";
      state.statuslogById = action.payload.data;
    },
    [fetchStatuslogById.rejected]: (state, action) => {
      state.statuslogByIdStatus = "failed";
      state.statuslogByIdError = action.error.message;
    },

    [fetchStatuslogByOrderId.pending]: (state) => {
      state.statuslogByOrderIdStatus = "loading";
    },
    [fetchStatuslogByOrderId.fulfilled]: (state, action) => {
      state.statuslogByOrderIdStatus = "succeeded";
      state.statuslogByOrderId = action.payload.data;
    },
    [fetchStatuslogByOrderId.rejected]: (state, action) => {
      state.statuslogByOrderIdStatus = "failed";
      state.statuslogByOrderIdError = action.error.message;
    },

    [fetchStatuslogByConfirmed.pending]: (state) => {
      state.statuslogByConfirmedStatus = "loading";
    },
    [fetchStatuslogByConfirmed.fulfilled]: (state, action) => {
      state.statuslogByConfirmedStatus = "succeeded";
      state.statuslogByConfirmed = action.payload.data;
    },
    [fetchStatuslogByConfirmed.rejected]: (state, action) => {
      state.statuslogByConfirmedStatus = "failed";
      state.statuslogByConfirmedError = action.error.message;
    },

    [fetchStatuslogByConfirmedEmployee.pending]: (state) => {
      state.statuslogByConfirmedStatus = "loading";
    },
    [fetchStatuslogByConfirmedEmployee.fulfilled]: (state, action) => {
      state.statuslogByConfirmedStatus = "succeeded";
      state.statuslogByConfirmed = action.payload.data;
    },
    [fetchStatuslogByConfirmedEmployee.rejected]: (state, action) => {
      state.statuslogByConfirmedStatus = "failed";
      state.statuslogByConfirmedError = action.error.message;
    },

    [fetchStatuslogByCollected.pending]: (state) => {
      state.statuslogByCollectedStatus = "loading";
    },
    [fetchStatuslogByCollected.fulfilled]: (state, action) => {
      state.statuslogByCollectedStatus = "succeeded";
      state.statuslogByCollected = action.payload.data;
    },
    [fetchStatuslogByCollected.rejected]: (state, action) => {
      state.statuslogByCollectedStatus = "failed";
      state.statuslogByCollectedError = action.error.message;
    },

    [fetchStatuslogByCollectedByEmployee.pending]: (state) => {
      state.statuslogByCollectedStatus = "loading";
    },
    [fetchStatuslogByCollectedByEmployee.fulfilled]: (state, action) => {
      state.statuslogByCollectedStatus = "succeeded";
      state.statuslogByCollected = action.payload.data;
    },
    [fetchStatuslogByCollectedByEmployee.rejected]: (state, action) => {
      state.statuslogByCollectedStatus = "failed";
      state.statuslogByCollectedError = action.error.message;
    },

    [fetchStatuslogsByDelivered.pending]: (state) => {
      state.statuslogByDeliveredStatus = "loading";
    },
    [fetchStatuslogsByDelivered.fulfilled]: (state, action) => {
      state.statuslogByDeliveredStatus = "succeeded";
      state.statuslogByDelivered = action.payload.data;
    },
    [fetchStatuslogsByDelivered.rejected]: (state, action) => {
      state.statuslogByDeliveredStatus = "failed";
      state.statuslogByDeliveredError = action.error.message;
    },

    [fetchStatuslogsByDeliveredEmployee.pending]: (state) => {
      state.statuslogByDeliveredStatus = "loading";
    },
    [fetchStatuslogsByDeliveredEmployee.fulfilled]: (state, action) => {
      state.statuslogByDeliveredStatus = "succeeded";
      state.statuslogByDelivered = action.payload.data;
    },
    [fetchStatuslogsByDeliveredEmployee.rejected]: (state, action) => {
      state.statuslogByDeliveredStatus = "failed";
      state.statuslogByDeliveredError = action.error.message;
    },

    [fetchStatuslogsByReturned.pending]: (state) => {
      state.statuslogByReturnedStatus = "loading";
    },
    [fetchStatuslogsByReturned.fulfilled]: (state, action) => {
      state.statuslogByReturnedStatus = "succeeded";
      state.statuslogByReturned = action.payload.data;
    },
    [fetchStatuslogsByReturned.rejected]: (state, action) => {
      state.statuslogByReturnedStatus = "failed";
      state.statuslogByReturnedError = action.error.message;
    },

    [fetchStatuslogsByReturnedEmployee.pending]: (state) => {
      state.statuslogByReturnedStatus = "loading";
    },
    [fetchStatuslogsByReturnedEmployee.fulfilled]: (state, action) => {
      state.statuslogByReturnedStatus = "succeeded";
      state.statuslogByReturned = action.payload.data;
    },
    [fetchStatuslogsByReturnedEmployee.rejected]: (state, action) => {
      state.statuslogByReturnedStatus = "failed";
      state.statuslogByReturnedError = action.error.message;
    },

    [fetchStatuslogsByDone.pending]: (state) => {
      state.statuslogByDoneStatus = "loading";
    },
    [fetchStatuslogsByDone.fulfilled]: (state, action) => {
      state.statuslogByDoneStatus = "succeeded";
      state.statuslogByDone = action.payload.data;
    },
    [fetchStatuslogsByDone.rejected]: (state, action) => {
      state.statuslogByDoneStatus = "failed";
      state.statuslogByDoneError = action.error.message;
    },

    [fetchStatuslogsByDoneEmployee.pending]: (state) => {
      state.statuslogByDoneStatus = "loading";
    },
    [fetchStatuslogsByDoneEmployee.fulfilled]: (state, action) => {
      state.statuslogByDoneStatus = "succeeded";
      state.statuslogByDone = action.payload.data;
    },
    [fetchStatuslogsByDoneEmployee.rejected]: (state, action) => {
      state.statuslogByDoneStatus = "failed";
      state.statuslogByDoneError = action.error.message;
    },

    [updateStatusLog.pending]: (state) => {
      state.statuslogUpdateStatus = "loading";
    },
    [updateStatusLog.fulfilled]: (state, action) => {
      state.statuslogUpdateStatus = "succeeded";
      state.statuslogUpdate = action.payload.data;
    },
    [updateStatusLog.rejected]: (state, action) => {
      state.statuslogUpdateStatus = "failed";
      state.statuslogUpdateError = action.error.message;
    },

    [updateEmployeeLog.pending]: (state) => {
      state.statuslogEmployeeUpdateStatus = "loading";
    },
    [updateEmployeeLog.fulfilled]: (state, action) => {
      state.statuslogEmployeeUpdateStatus = "succeeded";
      state.statuslogUpdate = action.payload.data;
    },
    [updateEmployeeLog.rejected]: (state, action) => {
      state.statuslogEmployeeUpdateStatus = "failed";
      state.statuslogUpdateError = action.error.message;
    },
  },
});

export const {
  clearStatuslogByConfirmedStatus,
  clearStatuslogByCollectedStatus,
  clearStatuslogByDeliveredStatus,
  clearStatuslogByReturnedStatus,
  clearStatuslogByDoneStatus,
  clearStatuslogUpdateStatus,
  clearStatuslogEmployeeUpdateStatus,
  clearStatuslogByOrderIdStatus,
} = orderlogsSlice.actions;

export default orderlogsSlice.reducer;
