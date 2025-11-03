// src/app/api/amenidades/route.js

import { NextResponse } from "next/server";
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Amenidad from "@/modelos/Amenidad";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function bufferToStream(buffer) {
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
}

export async function GET() {
  await conectarBaseDeDatos();
  const list = await Amenidad.find().sort({ nombre: 1 });

  // Separar por tipo de reserva
  const conReserva = list.filter((a) => a.requiereReserva === "sí");
  const sinReserva = list.filter((a) => a.requiereReserva === "no");

  // Se añade la lista completa 'amenidades' al cuerpo de la respuesta para facilitar su uso
  // en el frontend (por ejemplo, para llenar listas de selección en la página de edición).
  return NextResponse.json({ success: true, amenidades: list, conReserva, sinReserva });
}

export async function POST(req) {
  await conectarBaseDeDatos();

  const formData = await req.formData();
  const nombre = formData.get("nombre");
  const requiereReserva = formData.get("requiereReserva");
  const tiempoMaximo = formData.get("tiempoMaximo");
  const imagen = formData.get("imagen");

  if (!nombre || !requiereReserva || !tiempoMaximo || !imagen) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  const arrayBuffer = await imagen.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "amenidades" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    bufferToStream(buffer).pipe(stream);
  });

  const nueva = await Amenidad.create({
    nombre,
    requiereReserva,
    tiempoMaximo,
    imagenUrl: uploadResult.secure_url,
    imagenPublicId: uploadResult.public_id,
  });

  return NextResponse.json({ message: "Amenidad guardada", amenidad: nueva }, { status: 201 });
}

export async function DELETE(req) {
  await conectarBaseDeDatos();

  const { searchParams } = new URL(req.url);
  const nombre = searchParams.get("nombre");

  if (!nombre) {
    return NextResponse.json(
      { error: "Debes proporcionar el nombre de la amenidad a eliminar." },
      { status: 400 }
    );
  }

  const amenidad = await Amenidad.findOne({ nombre });
  if (!amenidad) {
    return NextResponse.json(
      { error: `No se encontró la amenidad '${nombre}'` },
      { status: 404 }
    );
  }

  // Eliminar imagen de Cloudinary
  if (amenidad.imagenPublicId) {
    await cloudinary.uploader.destroy(amenidad.imagenPublicId).catch(() => {
      console.warn("⚠️ No se pudo eliminar la imagen en Cloudinary:", amenidad.imagenPublicId);
    });
  }

  await Amenidad.deleteOne({ nombre });

  return NextResponse.json(
    { message: `Amenidad '${nombre}' eliminada correctamente.` },
    { status: 200 }
  );
}

export async function PUT(req) {
  await conectarBaseDeDatos();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Debes proporcionar el ID de la amenidad a editar." },
      { status: 400 }
    );
  }

  // **CORRECCIÓN CLAVE: Leer como FormData en lugar de JSON**
  const formData = await req.formData();
  
  // Extraer campos del FormData
  const nombre = formData.get("nombre");
  let requiereReserva = formData.get("requiereReserva");
  const tiempoMaximo = formData.get("tiempoMaximo");
  const imagenFile = formData.get("imagen"); // Archivo nuevo (si aplica)
  const imagenUrlPrevia = formData.get("imagenUrl"); // URL previa (si se mantiene)

  // **CORRECCIÓN VALIDACIÓN: Convertir el valor a 'sí' o 'no'**
  // El frontend puede enviar 'true' o 'sí'. Normalizamos a la cadena esperada por Mongoose.
  if (requiereReserva === 'true' || requiereReserva === 'sí') {
      requiereReserva = 'sí';
  } else {
      requiereReserva = 'no';
  }

  if (!nombre || !requiereReserva || !tiempoMaximo) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios (nombre, reserva, tiempo)." },
      { status: 400 }
    );
  }
  
  // Obtener la amenidad actual para verificar el publicId de la imagen antigua
  const amenidadActual = await Amenidad.findById(id);

  if (!amenidadActual) {
    return NextResponse.json(
      { error: "Amenidad no encontrada para edición." },
      { status: 404 }
    );
  }

  let updateData = { nombre, requiereReserva, tiempoMaximo };

  // 1. Manejo y subida de nueva imagen si se adjuntó un archivo
  if (imagenFile && typeof imagenFile.size === 'number' && imagenFile.size > 0) {
    
    // a. Subir nueva imagen
    const arrayBuffer = await imagenFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "amenidades" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferToStream(buffer).pipe(stream);
    });

    // b. Actualizar datos de la imagen
    updateData.imagenUrl = uploadResult.secure_url;
    updateData.imagenPublicId = uploadResult.public_id;
    
    // c. Eliminar imagen previa (si existía)
    if (amenidadActual.imagenPublicId) {
        await cloudinary.uploader.destroy(amenidadActual.imagenPublicId).catch((err) => {
            console.warn("⚠️ Advertencia: No se pudo eliminar la imagen anterior en Cloudinary:", amenidadActual.imagenPublicId, err.message);
        });
    }

  } else if (imagenUrlPrevia) {
      // 2. No se subió nueva imagen, se mantiene la URL y el PublicId previos
      updateData.imagenUrl = imagenUrlPrevia;
      updateData.imagenPublicId = amenidadActual.imagenPublicId;
  } else {
      // 3. Error si no hay imagen (no debe ocurrir si el frontend funciona bien)
      return NextResponse.json({ error: "La amenidad debe tener una imagen." }, { status: 400 });
  }

  // Actualizar el documento en la base de datos
  const actualizada = await Amenidad.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true } 
  );

  if (!actualizada) {
    return NextResponse.json(
      { error: "Amenidad no encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Amenidad actualizada correctamente.", amenidad: actualizada },
    { status: 200 }
  );
}
