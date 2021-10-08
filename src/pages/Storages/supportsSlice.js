import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

const initialState = {
  supportList: [],
  supportListStatus: "idle",
  supportListError: null,
  supportById: [],
  supportByIdStatus: "idle",
  supportByIdError: null,
  createSupport: [],
  createSupportStatus: "idle",
  createSupportError: null,
  supportDelete: [],
  supportDeleteStatus: "idle",
  supportDeleteError: null,
  supportUpdate: [],
  supportUpdateStatus: "idle",
  supportUpdateError: null,
};

export const fetchSupport = createAsyncThunk(
  "supports/fetchSupport",
  async () => {
    const response = await supabase
      .from("supports")
      .select(`*,employees:employee_id(name),orders:order_id(*)`);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchSupportByEmployee = createAsyncThunk(
  "supports/fetchSupportByEmployee",
  async (id) => {
    const response = await supabase
      .from("supports")
      .select(`*,employees:employee_id(name)`)
      .eq("employee_id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const fetchSupportById = createAsyncThunk(
  "supports/fetchSupportById",
  async (id) => {
    const response = await supabase.from("supports").select("*").eq("id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const createNewSupport = createAsyncThunk(
  "supports/createNewSupport",
  async (newData) => {
    const response = await supabase.from("supports").insert([newData]);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const deleteSupport = createAsyncThunk(
  "supports/deleteSupport",
  async (id) => {
    const response = await supabase.from("supports").delete().match({ id: id });
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const updateSupport = createAsyncThunk(
  "supports/updateSupport",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("supports")
      .update({
        employee_id: updatedData.employee_id,
      })
      .eq("id", updatedData.id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

const supportsSlice = createSlice({
  name: "supports",
  initialState,
  reducers: {
    clearSupportList: (state) => {
      state.supportList = [];
    },
    clearSupportListStatus: (state) => {
      state.supportListStatus = "idle";
    },
    clearSupportByIdData: (state) => {
      state.supportById = [];
    },
    clearSupportByIdStatus: (state) => {
      state.supportByIdStatus = "idle";
    },
    clearSupportDeleteStatus: (state) => {
      state.supportDeleteStatus = "idle";
    },
    clearCreateSupportStatus: (state) => {
      state.createSupportStatus = "idle";
    },
    clearSupportUpdateStatus: (state) => {
      state.supportUpdateStatus = "idle";
    },
    clearIdStatus: (state) => {
      state.idStatus = "idle";
    },
  },
  extraReducers: {
    [fetchSupport.pending]: (state) => {
      state.supportListStatus = "loading";
    },
    [fetchSupport.fulfilled]: (state, action) => {
      state.supportListStatus = "succeeded";
      state.supportList = action.payload.data;
    },
    [fetchSupport.rejected]: (state, action) => {
      state.supportListStatus = "failed";
      state.supportListError = action.error.message;
    },

    [fetchSupportByEmployee.pending]: (state) => {
      state.supportListStatus = "loading";
    },
    [fetchSupportByEmployee.fulfilled]: (state, action) => {
      state.supportListStatus = "succeeded";
      state.supportList = action.payload.data;
    },
    [fetchSupportByEmployee.rejected]: (state, action) => {
      state.supportListStatus = "failed";
      state.supportListError = action.error.message;
    },

    [fetchSupportById.pending]: (state) => {
      state.supportByIdStatus = "loading";
    },
    [fetchSupportById.fulfilled]: (state, action) => {
      state.supportByIdStatus = "succeeded";
      state.supportById = action.payload.data[0];
    },
    [fetchSupportById.rejected]: (state, action) => {
      state.supportByIdStatus = "failed";
      state.supportByIdError = action.error.message;
    },
    [createNewSupport.pending]: (state) => {
      state.createSupportStatus = "loading";
    },
    [createNewSupport.fulfilled]: (state, action) => {
      state.createSupportStatus = "succeeded";
      state.supportList = state.supportList.concat(action.payload.data[0]);
    },
    [createNewSupport.rejected]: (state, action) => {
      state.createSupportStatus = "failed";
      state.createSupportError = action.error.message;
    },
    [deleteSupport.pending]: (state) => {
      state.supportDeleteStatus = "loading";
    },
    [deleteSupport.fulfilled]: (state, action) => {
      state.supportDeleteStatus = "succeeded";
      state.supportDelete = action.payload.data;
      const array = current(state.supportList);
      // eslint-disable-next-line eqeqeq
      const temp = array.filter(
        (element) => element.id != action.payload.data[0].id
      );
      state.supportList = temp;
    },
    [deleteSupport.rejected]: (state, action) => {
      state.supportDeleteStatus = "failed";
      state.supportDeleteError = action.error.message;
    },

    [updateSupport.pending]: (state) => {
      state.supportUpdateStatus = "loading";
    },
    [updateSupport.fulfilled]: (state, action) => {
      state.supportUpdateStatus = "succeeded";
      state.supportUpdate = action.payload.data;
    },
    [updateSupport.rejected]: (state, action) => {
      state.supportUpdateStatus = "failed";
      state.supportUpdateError = action.error.message;
    },
  },
});

export const {
  clearSupportList,
  clearSupportByIdData,
  clearSupportByIdStatus,
  clearSupportDeleteStatus,
  clearCreateSupportStatus,
  clearSupportUpdateStatus,
  clearSupportListStatus,
} = supportsSlice.actions;

export default supportsSlice.reducer;
