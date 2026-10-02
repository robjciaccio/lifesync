export async function resetDatabase() {
  const response = await fetch("http://localhost:3000/dev/reset", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to reset database");
  }

  return response.json();
}
