import { apiClient } from "@/config/service.config";
import { LoginRequest } from "@/types/login/login.request";
import { LoginResponse } from "@/types/login/login.response";
import Cookies from "js-cookie";
export class AuthService {
  public static async login(
    loginRequest: LoginRequest
  ): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/login",
        loginRequest
      );
      Cookies.set("token", response.data.token);
      Cookies.set("refresh-token", response.data.refreshToken);
      Cookies.set("identifier", response.data.identifier+"");
      Cookies.set("expiration", response.data.expiration + "");
      return response.data;
    } catch (error) {
      throw new Error("Error de Autenticacion");
    }
  }

  public static async logout(): Promise<void> {
    try {
      Cookies.remove("token");
      Cookies.remove("refresh-token");
      Cookies.remove("identifier");
      Cookies.remove("expiration");
    } catch (error) {
      console.log("Error", error);
    }
  }

  public static async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "refresh-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("refresh-token")}`,
          },
        }
      );
      Cookies.set("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error("Error refresh token");
    }
  }
  public static isTokenExpired = () => {
    const expiration = Cookies.get('expiration');
    if(!expiration) return true;
    const expirationDate = new Date(expiration);
    return expirationDate < new Date();
  }
}
