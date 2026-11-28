import { API_URL } from "@/config/api";
export async function resetDatabase() {
  const response = await fetch(`${API_URL}/dev/reset`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to reset database");
  }

  return response.json();
}
