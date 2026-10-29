import { m1Base, mc, tf, mt, type Lesson } from './data';
import { m1Extra } from './m1data';

export const m1Checkpoint: Lesson = {
  id: 125, title: 'Checkpoint Módulo 2',
  tip: { title: 'Checkpoint: Familias de medicamentos', body: [
    '12 preguntas de las 24 familias. Necesitas **80% (10/12)** para ganar la insignia **Familias** y desbloquear el Módulo 3 · Casos de mostrador.',
    'Recuerda: genéricos / laboratorio aliado, impulso útil, fidelización en crónicos, y **refiere al médico** cuando haya alarma. Controlados = **cinto verde** y manual; nunca sin receta.',
  ] },
  exercises: [
    mc('m1cpe1', 'complete', 'El paracetamol en exceso daña principalmente el ______.', ['hígado', 'oído', 'pelo', 'ojo'], 0, 'Hígado: respetar dosis máxima.'),
    tf('m1cpe2', '“Se pueden combinar dos AINE orales para más efecto sin riesgo.”', false, 'Sumar AINE aumenta riesgos (estómago, riñón).'),
    mc('m1cpe3', 'case', 'Cliente pide jarabe con antibiótico para la tos, sin receta. ¿Qué haces?', ['Se lo vendo', 'Explico que el antibiótico va con receta y refiere al médico', 'Doble dosis del mucolítico'], 1, 'Antibiótico solo con receta.'),
    mt('m1cpe4', 'Une activo con grupo.', [['Salbutamol', 'Rescate (asma)'], ['Omeprazol', 'Reduce ácido (IBP)'], ['Metformina', 'Antidiabético']], 'Rescate, protector y crónico.'),
    mc('m1cpe5', 'case', 'Cliente hipertenso pide ginseng “para la energía”. Mejor orientación:', ['Vendérselo sin preguntar', 'No recomendar ginseng; puede afectar la presión; refiere al médico si insiste', 'Doble dosis'], 1, 'Ginseng y presión: cuidado.'),
    tf('m1cpe6', '“Los IBP (como omeprazol) se pueden tomar meses por cuenta propia aunque ya no haga falta.”', false, 'Uso prolongado sin seguimiento no es inocuo; si persiste, refiere al médico.'),
    mc('m1cpe7', 'choose', 'Medicamento controlado en la farmacia:', ['Se vende sin receta si el cliente insiste', 'Va con cinto verde; seguir el manual; nunca sin receta', 'Solo importa el precio'], 1, 'Cinto verde + manual; nunca sin receta.'),
    mc('m1cpe8', 'case', 'Cliente asmático recoge salbutamol. Impulso útil:', ['Solución salina para nebulizar y, si aplica, equipo/espaciador', 'Un segundo inhalador para usar el doble', 'Jarabe con antibiótico sin receta'], 0, 'Salina + nebulizador/espaciador complementan.'),
    mc('m1cpe9', 'case', 'Cliente crónico pide su antihipertensivo. Priorizas…', ['Cambiarle el miligramaje “porque es igual”', 'Mismo miligramaje / laboratorio aliado + plan de fidelización', 'Ginseng de regalo'], 1, 'Misma dosis y fidelización.'),
    tf('m1cpe10', '“Un suplemento natural puede sustituir la metformina del diabético.”', false, 'No reemplazan tratamiento; refiere al médico.'),
    mc('m1cpe11', 'case', 'Clienta compra anticonceptivos orales. Impulso útil:', ['Preservativos y lubricantes', 'Antibiótico “por si acaso”', 'Dejar la píldora si vomita una vez y ya'], 0, 'Preservativos + lubricantes.'),
    mt('m1cpe12', 'Une marca/línea con tipo.', [['Creci Kids', 'Multivitamínico infantil'], ['Memoritonic', 'Multivitamínico / memoria'], ['Emulsión Scott', 'Vitamina tipo emulsión']], 'Reconocer lo del mostrador.'),
  ],
};

export const m1Lessons = [...m1Base, ...m1Extra, m1Checkpoint];
