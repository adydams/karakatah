import { ROOT_URL } from "../apiAuth";

export async function getStores() {
  const response = await fetch(`${ROOT_URL}/api/stores`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract backend-designed error message
    throw new Error(
      data?.message || data?.detail || data?.error || "Something went wrong",
    );
  }

  return data;
}
export async function getStoreDetail(storeId: string | undefined) {
  if (storeId) {
    const response = await fetch(`${ROOT_URL}/api/stores/${storeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract backend-designed error message
      throw new Error(
        data?.message || data?.detail || data?.error || "Something went wrong",
      );
    }

    return data;
  }
}
