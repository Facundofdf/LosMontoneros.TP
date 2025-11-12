document.querySelectorAll('.toggle-producto').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    const res = await fetch(`/api/admin/productos/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) location.reload();
  });
});

document.querySelectorAll('.btn-eliminar').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;

    // ¡Importante! Pedir confirmación
    const confirmar = confirm('¿Estás seguro de que querés eliminar este producto?\nEsta acción no se puede deshacer.');

    if (!confirmar) {
      return; // El usuario canceló
    }

    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        location.reload(); // Recarga la página para ver los cambios
      } else {
        alert('Error al eliminar el producto.');
      }
    } catch (error) {
      console.error('Error en fetch de eliminar:', error);
      alert('Error de red al intentar eliminar.');
    }
  });
});