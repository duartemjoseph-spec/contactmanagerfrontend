export type Contact = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  phoneNumber: string;
};

const API_BASE =
  "https://contactmanagerjd-c3f5fzgnbsd3bfeu.westus3-01.azurewebsites.net";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Something went wrong.");
  }

  return response.json();
}

export async function getAllContacts(): Promise<Contact[]> {
  const response = await fetch(`${API_BASE}/Contact/GetAllContacts`, {
    cache: "no-store",
  });

  return handleResponse<Contact[]>(response);
}

export async function addContact(
  newContact: ContactFormData
): Promise<Contact[]> {
  const response = await fetch(`${API_BASE}/Contact/AddContact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });

  return handleResponse<Contact[]>(response);
}

export async function updateContact(
  id: number,
  updatedContact: ContactFormData
): Promise<Contact> {
  const response = await fetch(`${API_BASE}/Contact/UpdateContact/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedContact),
  });

  return handleResponse<Contact>(response);
}

export async function deleteContact(id: number): Promise<string> {
  const response = await fetch(`${API_BASE}/Contact/DeleteContact/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to delete contact.");
  }

  return response.text();
}