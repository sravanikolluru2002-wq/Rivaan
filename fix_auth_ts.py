import os

path = 'frontend/src/lib/auth.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

get_json = '''
export async function getJson(path: string, token?: string) {
  const response = await fetch(${getBackendUrl()}, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: Bearer  } : {}),
    },
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail?.message || data.detail || "Request failed");
  return data;
}

export async function putJson(path: string, body: any, token?: string) {
  const response = await fetch(${getBackendUrl()}, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: Bearer  } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail?.message || data.detail || "Request failed");
  return data;
}
'''

content += "\n" + get_json

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
