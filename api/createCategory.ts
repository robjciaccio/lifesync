import { API_URL } from "@/config/api";

export const createCategory = async (name: string) => {
  const response = await fetch(`${API_URL}/transaction-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
};
