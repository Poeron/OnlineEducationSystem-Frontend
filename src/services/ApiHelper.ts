import { getAuthHeaders } from "./AuthHelper";
import { URL } from "../lib/constants";

export const get = async (url: string) => {
  const response = await fetch(URL + url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const post = async (
  url: string,
  body?: FormData | Record<string, unknown>
) => {
  const headers = getAuthHeaders();
  let requestBody;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (typeof body === "object") {
    requestBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  } else {
    throw new Error("Body must be an object or FormData");
  }

  const response = await fetch(URL + url, {
    method: "POST",
    headers: headers,
    body: requestBody,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  return JSON.parse(text);
};

export const put = async (url: string, body?: Record<string, unknown>) => {
  if (body && typeof body !== "object" && body !== undefined) {
    throw new Error("Body must be an object");
  }

  const response = await fetch(URL + url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  return JSON.parse(text);
};

export const remove = async (url: string) => {
  const response = await fetch(URL + url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
