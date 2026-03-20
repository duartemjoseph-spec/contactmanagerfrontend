"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { SquareUser } from "lucide-react";
import {
  addContact,
  deleteContact,
  getAllContacts,
  updateContact,
  type Contact,
  type ContactFormData,
} from "@/services/contactService";

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  phoneNumber: "",
};

export default function Home() {
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadContacts() {
    try {
      setErrorMessage("");
      const data = await getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load contacts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    } else {
      loadContacts();
    }
  }, [router]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim()
    ) {
      setErrorMessage("Please fill out name, email, and phone number.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      if (selectedContactId !== null) {
        await updateContact(selectedContactId, formData);
      } else {
        await addContact(formData);
      }

      setFormData(emptyForm);
      setSelectedContactId(null);
      await loadContacts();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save contact.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(contact: Contact) {
    setSelectedContactId(contact.id);
    setFormData({
      name: contact.name ?? "",
      email: contact.email ?? "",
      phoneNumber: contact.phoneNumber ?? "",
    });
    setErrorMessage("");
  }

  function openDeleteModal(contact: Contact) {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
    setErrorMessage("");
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  }

  async function confirmDelete() {
    if (!contactToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      await deleteContact(contactToDelete.id);

      if (selectedContactId === contactToDelete.id) {
        setSelectedContactId(null);
        setFormData(emptyForm);
      }

      setIsDeleteModalOpen(false);
      setContactToDelete(null);
      await loadContacts();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete contact.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelEdit() {
    setSelectedContactId(null);
    setFormData(emptyForm);
    setErrorMessage("");
  }

  function handleLogout() {
    router.push("/login");
  }

  const filteredContacts = useMemo(() => {
    const searchText = searchValue.toLowerCase().trim();

    if (!searchText) return contacts;

    return contacts.filter((contact) => {
      return (
        contact.name?.toLowerCase().includes(searchText) ||
        contact.email?.toLowerCase().includes(searchText) ||
        contact.phoneNumber?.toLowerCase().includes(searchText)
      );
    });
  }, [contacts, searchValue]);

  return (
    <main className="min-h-screen bg-slate-100 p-5 md:p-6">
      <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-lg text-white">
            <SquareUser />
          </div>
          <span className="text-base font-bold text-indigo-500">ContactFlow</span>

          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Contact Manager
          </h1>

          <span className="text-base font-bold text-indigo-500">ContactManager</span>

        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none transition focus:border-indigo-500 sm:w-80"
          />

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-300"
          >
            Log Out
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            {selectedContactId !== null ? "Edit Contact" : "Add New Contact"}
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            {selectedContactId !== null
              ? "Update the selected contact below."
              : "Fill in the details below to add a new contact to your list."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="name" className="mb-2 text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none transition focus:border-indigo-500"
            />

            <label htmlFor="email" className="mb-2 text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none transition focus:border-indigo-500"
            />

            <label
              htmlFor="phoneNumber"
              className="mb-2 text-sm font-semibold text-slate-700"
            >
              Phone
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              placeholder="209-555-1234"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none transition focus:border-indigo-500"
            />

            {errorMessage && (
              <p className="mb-3 text-sm font-medium text-red-600">{errorMessage}</p>
            )}

            <button
              disabled={isSaving}
              className="mt-1 rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving
                ? "Saving..."
                : selectedContactId !== null
                ? "Update Contact"
                : "Add Contact"}
            </button>

            {selectedContactId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="mt-3 rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-300"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">All Contacts</h2>
            <span className="text-sm font-semibold text-slate-500">
              {filteredContacts.length} contact{filteredContacts.length === 1 ? "" : "s"}
            </span>
          </div>

          {isLoading ? (
            <p className="py-5 text-slate-500">Loading contacts...</p>
          ) : filteredContacts.length === 0 ? (
            <p className="py-5 text-slate-500">No contacts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-t border-slate-200">
                    <th className="px-3 py-4 text-left text-sm font-bold text-slate-500">
                      Name
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-bold text-slate-500">
                      Email
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-bold text-slate-500">
                      Phone
                    </th>
                    <th className="px-3 py-4 text-left text-sm font-bold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-t border-slate-200">
                      <td className="px-3 py-4 text-sm text-slate-800">{contact.name}</td>
                      <td className="px-3 py-4 text-sm text-slate-800">{contact.email}</td>
                      <td className="px-3 py-4 text-sm text-slate-800">
                        {contact.phoneNumber}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(contact)}
                            className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(contact)}
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Delete Contact</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {contactToDelete?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-xl bg-slate-200 px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-300 disabled:opacity-70"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}