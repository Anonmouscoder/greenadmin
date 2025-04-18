import Swal from "sweetalert2";
import { getConfig} from "./Constant";

export const fetchConfig = async () => {
    try {
      const response = await fetch(getConfig,{method: "POST", credentials: "include", });
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      return response;
    } catch (error) {
      console.error('Error in fetchData:', error);
      throw error;
    }
  };

  export const logoutMyAccount = async () => {
    sessionStorage.clear();
    window.location.href = "/";
  }

  export const addMinerReq = async (data) => {
    console.log(data)
    return data;
  }
