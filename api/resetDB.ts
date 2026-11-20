import { API_URL } from "@/config/api";
export async function resetDatabase() {
  const response = await fetch(`${API_URL}/dev/reset`, {
    method: "DELETE",
  });
  // delete the database and reset it to its initial state
  if (!response.ok) {
    throw new Error("Failed to reset database");
  }

  return response.json();
}
