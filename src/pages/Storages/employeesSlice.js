import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { supabase } from "../../supabase";

const initialState = {
  employeeList: [],
  employeeListStatus: "idle",
  employeeListError: null,
  employeeById: [],
  employeeByIdStatus: "idle",
  employeeByIdError: null,
  createEmployee: [],
  createEmployeeStatus: "idle",
  createEmployeeError: null,
  employeeDelete: [],
  employeeDeleteStatus: "idle",
  employeeDeleteError: null,
  employeeUpdate: [],
  employeeUpdateStatus: "idle",
  employeeUpdateError: null,
};

export const fetchEmployee = createAsyncThunk(
  "employees/fetchEmployee",
  async () => {
    const response = await supabase.from("employees").select();
    return response;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchEmployeeById",
  async (id) => {
    const response = await supabase.from("employees").select("*").eq("id", id);
    return response;
  }
);

export const fetchEmployeeByRole = createAsyncThunk(
  "employees/fetchEmployeeByRole",
  async (role) => {
    const response = await supabase
      .from("employees")
      .select("*")
      .eq("role", role);
    return response;
  }
);

export const createNewEmployee = createAsyncThunk(
  "employees/createNewEmployee",
  async (data) => {
    const { user, session, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    console.log(user);
    data.id = user.id;
    const response = await supabase.from("employees").insert([data]);
    if (response.error) {
      alert(response.error.message);
    }
    return response;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id) => {
    await supabase.from("employees").delete().match({ id: id });
    return id;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (updatedData) => {
    const { data, error } = await supabase
      .from("employees")
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

export const updatePassword = createAsyncThunk(
  "employees/updatePassword",
  async (updatedData) => {
    const { data } = await supabase
      .from("employees")
      .update({
        password: updatedData.password,
      })
      .eq("id", updatedData.id);
    const { user, error } = await supabase.auth.update({
      password: updatedData.password,
    });
    return user;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployeeList: (state) => {
      state.employeeList = [];
    },
    clearEmployeeListStatus: (state) => {
      state.employeeListStatus = "idle";
    },
    clearEmployeeByIdData: (state) => {
      state.employeeById = [];
    },
    clearEmployeeByIdStatus: (state) => {
      state.employeeByIdStatus = "idle";
    },
    clearEmployeeDeleteStatus: (state) => {
      state.employeeDeleteStatus = "idle";
    },
    clearCreateEmployeeStatus: (state) => {
      state.createEmployeeStatus = "idle";
    },
    clearEmployeeUpdateStatus: (state) => {
      state.employeeUpdateStatus = "idle";
    },
    clearIdStatus: (state) => {
      state.idStatus = "idle";
    },
  },
  extraReducers: {
    [fetchEmployee.pending]: (state) => {
      state.employeeListStatus = "loading";
    },
    [fetchEmployee.fulfilled]: (state, action) => {
      state.employeeListStatus = "succeeded";
      state.employeeList = action.payload.data;
    },
    [fetchEmployee.rejected]: (state, action) => {
      state.employeeListStatus = "failed";
      state.employeeListError = action.error.message;
    },
    [fetchEmployeeById.pending]: (state) => {
      state.employeeByIdStatus = "loading";
    },
    [fetchEmployeeById.fulfilled]: (state, action) => {
      state.employeeByIdStatus = "succeeded";
      state.employeeById = action.payload.data[0];
    },
    [fetchEmployeeById.rejected]: (state, action) => {
      state.employeeByIdStatus = "failed";
      state.employeeByIdError = action.error.message;
    },
    [createNewEmployee.pending]: (state) => {
      state.createEmployeeStatus = "loading";
    },
    [createNewEmployee.fulfilled]: (state, action) => {
      state.createEmployeeStatus = "succeeded";
      state.employeeList = state.employeeList.concat(action.payload.data[0]);
    },
    [createNewEmployee.rejected]: (state, action) => {
      state.createEmployeeStatus = "failed";
      state.createEmployeeError = action.error.message;
    },
    [deleteEmployee.pending]: (state) => {
      state.employeeDeleteStatus = "loading";
    },
    [deleteEmployee.fulfilled]: (state, action) => {
      state.employeeDeleteStatus = "succeeded";
      state.employeeDelete = action.payload.data;
      const array = current(state.employeeList);
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload);
      state.employeeList = temp;
    },
    [deleteEmployee.rejected]: (state, action) => {
      state.employeeDeleteStatus = "failed";
      state.employeeDeleteError = action.error.message;
    },
    [updateEmployee.pending]: (state) => {
      state.employeeUpdateStatus = "loading";
    },
    [updateEmployee.fulfilled]: (state, action) => {
      state.employeeUpdateStatus = "succeeded";
      state.employeeUpdate = action.payload.data;
    },
    [updateEmployee.rejected]: (state, action) => {
      state.employeeUpdateStatus = "failed";
      state.employeeUpdateError = action.error.message;
    },
    [updatePassword.pending]: (state) => {
      state.employeeUpdateStatus = "loading";
    },
    [updatePassword.fulfilled]: (state, action) => {
      state.employeeUpdateStatus = "succeeded";
    },
    [updatePassword.rejected]: (state, action) => {
      state.employeeUpdateStatus = "failed";
    },
  },
});

export const {
  clearEmployeeList,
  clearEmployeeByIdData,
  clearEmployeeByIdStatus,
  clearEmployeeDeleteStatus,
  clearCreateEmployeeStatus,
  clearEmployeeUpdateStatus,
  clearEmployeeListStatus,
} = employeesSlice.actions;

export default employeesSlice.reducer;
