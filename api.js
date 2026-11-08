
const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        const products = await response.json();

        return products;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
