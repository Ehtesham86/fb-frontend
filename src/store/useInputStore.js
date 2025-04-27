// src/store/useInputStore.js
import { create } from "zustand";

export const useInputStore = create((set) => ({
  inputValue: "",
  setInputValue: (value) => set({ inputValue: value }),
}));
