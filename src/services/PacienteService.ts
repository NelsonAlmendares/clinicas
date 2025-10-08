// Minimal: ajusta tipos según tu tabla
export type Paciente = {
  id?: number;
  historia?: string,
  nombres?: string;
  apellidos?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  dpi_nit?: string;
  telefono?: string;
  email?: string;
  contacto_emergencia?: string;
  alergias?: string;
  antecedentes?: string;
  medicamentos?: string;
  fecha_registro?: string;
};

const ORDS_BASE = 'https://g0575431ea754e6-clinicas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/api/';
const ORDS_APP  = process.env.ORDS_APP_BASE!;

const ORDS_PRIVATE_BASE = process.env.ORDS_PRIVATE_BASE!;
const ORDS_PRIVATE_BEARER = process.env.ORDS_PRIVATE_BEARER!;

function authHeaders() {
  return {
    Authorization: `Bearer ${ORDS_PRIVATE_BEARER}`,
    "Content-Type": "application/json",
  };
}

export async function listPacientes() {
  const url = `${ORDS_PRIVATE_BASE}/getPacientes/`;
  const r = await fetch(url, { headers: authHeaders(), cache: "no-store" as any });
  const raw = await r.text();
  if (!r.ok) {
    console.error("ORDS getPacientes ERROR", { status: r.status, url, body: raw });
    throw new Error(`ORDS getPacientes error ${r.status}`);
  }
  const json = raw ? JSON.parse(raw) : {};
  return json.items ?? json;
}


export async function getPaciente(id: number) {
  const r = await fetch(`${ORDS_BASE}${ORDS_APP}/getPacientesById/${id}`, { headers: authHeaders(), cache: 'no-store' });
  if (!r.ok) throw new Error(`ORDS get error ${r.status}`);
  return (await r.json()) as Paciente;
}

export async function createPaciente(p: Paciente) {
  const r = await fetch(`${ORDS_BASE}${ORDS_APP}/pacientes/`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(p)
  });
  if (!r.ok) throw new Error(`ORDS create error ${r.status}`);
  return await r.json();
}

export async function updatePaciente(id: number, p: Paciente) {
  const r = await fetch(`${ORDS_BASE}${ORDS_APP}/pacientes/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(p)
  });
  if (!r.ok) throw new Error(`ORDS update error ${r.status}`);
  return await r.json();
}

export async function deletePaciente(id: number) {
  const r = await fetch(`${ORDS_BASE}${ORDS_APP}/pacientes/${id}`, {
    method: 'DELETE', headers: authHeaders()
  });
  if (!r.ok) throw new Error(`ORDS delete error ${r.status}`);
  return { ok: true };
}
