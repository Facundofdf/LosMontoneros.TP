document.getElementById("verProductos").addEventListener("click", async () => {
    const res = await fetch("http://localhost:3000/api/productos");
    const data = await res.json();
    console.log(data);
});
