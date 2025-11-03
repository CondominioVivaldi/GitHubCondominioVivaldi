//Endpoint para crear una nueva reserva
import { conectarBaseDeDatos } from "@/lib/mongodb";
import Reserva from "@/modelos/Reserva";
import Vivienda from "@/modelos/Vivienda";
import Amenidad from "@/modelos/Amenidad";

export async function POST(request) {
    try {
        await conectarBaseDeDatos();
        const data = await request.json();

        console.log("DATA DE FORMULATIO!!@!", data)

        const vivienda = await Vivienda.findOne({ idVivienda: data.vivienda.trim() })

        console.log("VIVIENDA ENCONTRADA!!!", vivienda)

        const amenidad = await Amenidad.findOne({ nombre: data.amenidad })

        console.log("AMENIDAD ENCONTRADA!!!", amenidad)

        const nuevaReserva = new Reserva({
            ...data,
            amenidad: amenidad._id,
            vivienda: vivienda._id,
        });
        await nuevaReserva.save();

        console.log("GUARDAMOS RESERVA!!!", nuevaReserva)

        return new Response(JSON.stringify({ message: "Reserva creada exitosamente", reserva: nuevaReserva }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
