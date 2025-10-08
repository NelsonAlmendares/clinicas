import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getPaciente, updatePaciente, deletePaciente } from '../../../../services/PacienteService';

const idParam = (id: string) => {
  const n = Number(id);
  if (Number.isNaN(n)) throw new Error('Invalid id');
  return n;
};

const updateSchema = z.object({
  dni: z.string().min(6).optional(),
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  fecha_nacimiento: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  direccion: z.string().optional()
}).refine(obj => Object.keys(obj).length > 0, { message: 'No hay cambios' });

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const item = await getPaciente(idParam(params.id));
  return Response.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ errors: parsed.error.flatten() }), { status: 400 });
  const updated = await updatePaciente(idParam(params.id), parsed.data);
  return Response.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await deletePaciente(idParam(params.id));
  return new Response(null, { status: 204 });
}
