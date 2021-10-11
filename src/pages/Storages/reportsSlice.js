import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

const initialState = {
  reportList: [],
  reportListStatus: "idle",
  reportListError: null,
  reportById: [],
  reportByIdStatus: "idle",
  reportByIdError: null,
  createReport: [],
  createReportStatus: "idle",
  createReportError: null,
  reportDelete: [],
  reportDeleteStatus: "idle",
  reportDeleteError: null,
  reportUpdate: [],
  reportUpdateStatus: "idle",
  reportUpdateError: null,
};

export const fetchReport = createAsyncThunk("reports/fetchReport", async () => {
  const response = await supabase
    .from("reports")
    .select(
      `*,orders(customer_name,customer_address,created_at),supported:supported_by(name),confirmed:confirmed_by(name),collected:collected_by(name),delivered:delivered_by(name),returned:returned_by(name),done:done_by(name)`
    );
  if (response.error) {
    alert(response.error.message);
  }
  return response;
});

export const reportList = createAsyncThunk("reports/reportList", async () => {
  const response = await supabase.from("reports").select(`*`);
  if (response.error) {
    alert(response.error.message);
  }
  return response;
});

export const fetchReportById = createAsyncThunk(
  "reports/fetchReportById",
  async (id) => {
    const response = await supabase.from("reports").select("*").eq("id", id);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const createNewReport = createAsyncThunk(
  "reports/createNewReport",
  async (newData) => {
    const response = await supabase.from("reports").insert([newData]);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",
  async (id) => {
    const response = await supabase.from("reports").delete().match({ id: id });
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const updateReport = createAsyncThunk(
  "reports/updateReport",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("reports")
      .update({
        name: updatedData.name,
        phone: updatedData.phone,
        role: updatedData.role,
      })
      .eq("id", updatedData.id);
    if (error) {
      alert(error.message);
    }
    return data;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportList: (state) => {
      state.reportList = [];
    },
    clearReportListStatus: (state) => {
      state.reportListStatus = "idle";
    },
    clearReportByIdData: (state) => {
      state.reportById = [];
    },
    clearReportByIdStatus: (state) => {
      state.reportByIdStatus = "idle";
    },
    clearReportDeleteStatus: (state) => {
      state.reportDeleteStatus = "idle";
    },
    clearCreateReportStatus: (state) => {
      state.createReportStatus = "idle";
    },
    clearReportUpdateStatus: (state) => {
      state.reportUpdateStatus = "idle";
    },
    clearIdStatus: (state) => {
      state.idStatus = "idle";
    },
  },
  extraReducers: {
    [fetchReport.pending]: (state) => {
      state.reportListStatus = "loading";
    },
    [fetchReport.fulfilled]: (state, action) => {
      state.reportListStatus = "succeeded";
      state.reportList = action.payload.data;
    },
    [fetchReport.rejected]: (state, action) => {
      state.reportListStatus = "failed";
      state.reportListError = action.error.message;
    },
    [fetchReportById.pending]: (state) => {
      state.reportByIdStatus = "loading";
    },
    [fetchReportById.fulfilled]: (state, action) => {
      state.reportByIdStatus = "succeeded";
      state.reportById = action.payload.data[0];
    },
    [fetchReportById.rejected]: (state, action) => {
      state.reportByIdStatus = "failed";
      state.reportByIdError = action.error.message;
    },
    [createNewReport.pending]: (state) => {
      state.createReportStatus = "loading";
    },
    [createNewReport.fulfilled]: (state, action) => {
      state.createReportStatus = "succeeded";
      state.reportList = state.reportList.concat(action.payload.data[0]);
    },
    [createNewReport.rejected]: (state, action) => {
      state.createReportStatus = "failed";
      state.createReportError = action.error.message;
    },
    [deleteReport.pending]: (state) => {
      state.reportDeleteStatus = "loading";
    },
    [deleteReport.fulfilled]: (state, action) => {
      state.reportDeleteStatus = "succeeded";
      state.reportDelete = action.payload.data;
      const array = current(state.reportList);
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload);
      state.reportList = temp;
    },
    [deleteReport.rejected]: (state, action) => {
      state.reportDeleteStatus = "failed";
      state.reportDeleteError = action.error.message;
    },
    [updateReport.pending]: (state) => {
      state.reportUpdateStatus = "loading";
    },
    [updateReport.fulfilled]: (state, action) => {
      state.reportUpdateStatus = "succeeded";
      state.reportUpdate = action.payload.data;
    },
    [updateReport.rejected]: (state, action) => {
      state.reportUpdateStatus = "failed";
      state.reportUpdateError = action.error.message;
    },
  },
});

export const {
  clearReportList,
  clearReportByIdData,
  clearReportByIdStatus,
  clearReportDeleteStatus,
  clearCreateReportStatus,
  clearReportUpdateStatus,
  clearReportListStatus,
} = reportsSlice.actions;

export default reportsSlice.reducer;
