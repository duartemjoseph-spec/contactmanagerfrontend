const API_BASE =
  "https://contactmanagerjd-c3f5fzgnbsd3bfeu.westus3-01.azurewebsites.net";

export type UserFormData = {
  username: string;
  password: string;
};

export async function createAccount(user: UserFormData): Promise<boolean> {
  const response = await fetch(`${API_BASE}/User/CreateAccount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create account.");
  }

  return response.json();
}

export async function loginUser(user: UserFormData): Promise<string> {
  const response = await fetch(`${API_BASE}/User/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed.");
  }

  return response.json();
}