<template>
  <div>
    <h1>Panel de Administración</h1>
    <p>Bienvenido, {{ authStore.user?.email }}. Aquí puedes gestionar el sistema.</p>
    <input
      type="text"
      placeholder="Buscar paciente">
  </div>
  </template>