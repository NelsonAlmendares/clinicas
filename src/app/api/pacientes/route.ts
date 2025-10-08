import { NextRequest } from 'next/server';
import { z } from 'zod';
import { listPacientes, createPaciente } from '../../../services/PacienteService';

export const pacienteSchema = z.object({
  id: z.number().optional(),
  historia: z.string().optional(),

  nombres: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "El apellido es obligatorio"),

  fecha_nacimiento: z.string().optional(),
  sexo: z.enum(["M", "F", "O"]).optional(), // M=Masculino, F=Femenino, O=Otro

  dpi_nit: z.string().min(6, "Debe tener al menos 6 caracteres").optional(),
  telefono: z.string().optional(),
  email: z.string().email("Correo inválido").optional(),

  contacto_emergencia: z.string().optional(),
  alergias: z.string().optional(),
  antecedentes: z.string().optional(),
  medicamentos: z.string().optional(),

  fecha_registro: z.string().optional(),
});


export async function GET() {
  try {
    const items = await listPacientes();
    return Response.json({ items }, { status: 200 });
  } catch (e: any) {
    const message = e?.message || "Error al listar pacientes";
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = pacienteSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ errors: parsed.error.flatten() }), { status: 400 });
  }
  const created = await createPaciente(parsed.data);
  return Response.json(created, { status: 201 });
}
