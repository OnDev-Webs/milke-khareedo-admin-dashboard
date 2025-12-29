import {
  Action,
  combineSlices,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import adminAuthReducer from "@/lib/features/auth/adminAuthSlice";
import dashboard from "@/lib/features/dashboard/dashboardSlice";
import properties from "@/lib/features/properties/propertiesSlice"
import developers from "@/lib/features/developers/developerSlice"
import roles from "@/lib/features/role/roleSlice";
import leadcrm from "@/lib/features/lead-crm/leadcrmSlice";

const rootReducer = combineSlices({
  auth: adminAuthReducer,
  dashboard:dashboard,
  properties:properties,
  developers:developers,
  roles: roles,
  leadcrm: leadcrm,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
