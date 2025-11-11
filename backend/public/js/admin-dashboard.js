document.querySelectorAll('.toggle-producto').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    const res = await fetch(`/api/admin/productos/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) location.reload();
  });
});