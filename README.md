# MediTurnos - Sistema de gestión de turnos
## Descripción del proyecto
MediTurnos es una plataforma web diseñada para optimizar la gestión de turnos médicos e historias clínicas, permitiendo a los pacientes reservar consultas de forma sencilla y a los médicos acceder y actualizar la información clínica de sus pacientes desde un único sistema centralizado.
### Problemas que resuelve
 - **Gestión de turnos:** Centralizala reserva y administración de turnos médicos.
 - **Acceso a historias clínicas:** Permite consultar y actualizar la información de los pacientes.
 - **Organización de consultas:** Facilita el seguimiento de la agenda diaria de atención.
 - **Autogestión de pacientes:** Los pacientes pueden solicitar y consultar turnos de forma online.
## Perfiles de usuario
### Paciente
- Registrarse e iniciar sesión.
- Solicitar turnos.
- Ver sus turnos programados.
- Cancelar turno.
### Médico
- Registrarse e iniciar sesión.
- Ver turnos del día.
- Buscar pacientes por nombre.
- Consultar historias clínicas.
- Actualizar historias clínicas con observaciones y diagnósticos.
## Reglas de negocio
### Gestión de turnos
- Un paciente no puede reservar dos turnos en el mismo horario.
- Un médico no puede tener más de un turno asignado en el mismo horario.
- Los turnos solo pueden reservarse en horarios disponibles del médico.
- Un paciente puede cancelar el turno hasta el horario de la consulta.
- Los turnos puede tener los siguientes estados: confirmado, cancelado y realizado.
### Historias Clínicas
- Cada paciente posee una única historia clínica.
- Solo los médicos pueden agregar o modificar registros en una historia clínica.
- Cada actualización de la historia clínica debe registrar fecha y médico responsable.
### Gestión de Pacientes
- Un paciente debe estar registrado para solicitar o ver sus turnos.
- Cada paciente debe tener un correo electrónico único.
- Los datos personales pueden ser actualizados únicamente por el propio paciente.
### Estados de Turno
- **Confirmado**: turno reservado y a la espera de la consulta.
- **Cancelado**: turno anulado por el paciente.
- **Realizado**: consulta efectuada y registrada en la historia clínica.
## Arquitectura del Proyecto
## Flujo de Datos
## Guía de Funcionalidades
### 1. Autenticación
#### Login
- Email: paciente@gmail.com (paciente)
- Email: medicoprueba@gmail.com (medico)
- Contraseña: 123456
#### Registro
Nuevo usuario se crea con rol "paciente" por defecto.
### 2. Solicitud de Turnos
1. Seleccionar fecha del turno
2. Seleccionar horario disponible (9:00 a 18:00hs)
3. Elegir especialidad
4. Elegir médico
5. Reservar turno
6. Confirmación de reserva exitosa
### 3. Mis Turnos
1. Ver todos los turnos programados
2. Visualizar fecha hora y estado del turno
3. Cancelar turnos con confirmación previa
4. Visualizar turnos cancelados
### 4. Perfil de Usuario
1. Ver información personal
2. Modificar datos del perfil
### 5. Agenda del Médico
1. Ver turnos del día
2. Ver próximos turnos programados
3. Buscar pacientes
4. Acceder a la historia clínica del paciente con posibilidad de modificarla
### 6. Historia Clínica
1. Visualizar historia clínica de un paciente
2. Agregar nueva información
3. Modificar información existente
## Configuración
### Variables del Entorno (.env)
```# Supabase```

VITE_SUPABASE_URL=https://wyuhlglqdbgddbtdekpv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XsDqUBtO73J8NWKWpujd6w_2Kv7hgO9
## Tech Stack
- **Frontend:** Vue.js 3
- **Build Tool:** Vite
- **Routing:** Vue Router
- **State Management:** Pinia
- **Backend:** Supabase
- **Estilos:** CSS
## Ejecución
```# Instalar dependencias```

npm install

```# Ejecutar en desarrollo```

npm run dev

```# Build para produccion```

npm run build

Acceso  http://localhost:5175/
## Estructura de Datos
