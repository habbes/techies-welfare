import { ApiClient } from "./services";
import { API_URL } from "./urls";
import { authService } from "./auth";

const apiClient = new ApiClient(API_URL, authService);

export { apiClient }
