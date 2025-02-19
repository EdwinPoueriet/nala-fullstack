import axios, { AxiosResponse } from "axios";
import { Position, Division, Tier, Employee } from "../types/organigram";
import { ApiResponse } from "../types/api";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

type CreatePositionInput = Omit<Position, "id">;
type UpdatePositionInput = Partial<Omit<Position, "id">>;
type UpdateEmployeeInput = Partial<Omit<Employee, "id">>;

export const apiService = {
  positions: {
    getAll: async (): Promise<Position[]> => {
      const { data }: AxiosResponse<ApiResponse<Position[]>> = await api.get(
        "/positions"
      );
      return data.data || [];
    },
    create: async (position: CreatePositionInput): Promise<Position> => {
      const { data }: AxiosResponse<ApiResponse<Position>> = await api.post(
        "/positions",
        position
      );
      return data.data!;
    },
    update: async ({
      id,
      ...position
    }: UpdatePositionInput & { id: string }): Promise<Position> => {
      const { data }: AxiosResponse<ApiResponse<Position>> = await api.put(
        `/positions/${id}`,
        position
      );
      return data.data!;
    },
    delete: async (id: string): Promise<boolean> => {
      const { data }: AxiosResponse<ApiResponse<void>> = await api.delete(
        `/positions/${id}`
      );
      return data.success;
    },
  },
  divisions: {
    getAll: async (): Promise<Division[]> => {
      const { data }: AxiosResponse<ApiResponse<Division[]>> = await api.get(
        "/divisions"
      );
      return data.data || [];
    },
  },
  employees: {
    getAll: async (): Promise<Employee[]> => {
      const { data }: AxiosResponse<ApiResponse<Employee[]>> = await api.get(
        "/employees"
      );
      return data.data || [];
    },

    assignToPosition: async (
      employeeId: string,
      positionId: string
    ): Promise<Employee> => {
      const { data }: AxiosResponse<ApiResponse<Employee>> = await api.put(
        `/employees/${employeeId}`,
        { position: positionId }
      );
      return data.data!;
    },

    removeFromPosition: async (employeeId: string): Promise<Employee> => {
      const { data }: AxiosResponse<ApiResponse<Employee>> = await api.put(
        `/employees/${employeeId}`,
        { position: null }
      );
      return data.data!;
    },

    update: async ({
      id,
      ...employee
    }: UpdateEmployeeInput & { id: string }): Promise<Employee> => {
      const { data }: AxiosResponse<ApiResponse<Employee>> = await api.put(
        `/employees/${id}`,
        employee
      );
      return data.data!;
    },
  },
  tiers: {
    getAll: async (): Promise<Tier[]> => {
      const { data } = await api.get("/tiers");
      if (!data.success) throw new Error(data.error);
      return data.data;
    },

    create: async (tier: Omit<Tier, "id">): Promise<Tier> => {
      const { data } = await api.post("/tiers", tier);
      if (!data.success) throw new Error(data.error);
      return data.data;
    },

    update: async ({
      id,
      ...tier
    }: Partial<Tier> & { id: number }): Promise<Tier> => {
      const { data } = await api.put(`/tiers/${id}`, tier);
      if (!data.success) throw new Error(data.error);
      return data.data;
    },

    delete: async (id: number): Promise<boolean> => {
      const { data } = await api.delete(`/tiers/${id}`);
      if (!data.success) throw new Error(data.error);

      try {
        await api.delete(`/positions/by-tier/${id}`);
      } catch (error) {
        console.error("Error deleting tier positions:", error);
        throw new Error("Failed to delete tier positions");
      }

      return true;
    },
  },
};
