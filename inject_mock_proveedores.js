const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const injectionPoint = 'function ProveedoresModulo({proveedores, setProveedores, materiales, setMateriales, cfg, setToast}) {\n    const [view, setView] = Re.useState("list");';

const injectionCode = `function ProveedoresModulo({proveedores, setProveedores, materiales, setMateriales, cfg, setToast}) {
    Re.useEffect(() => {
        if (!proveedores || proveedores.length === 0) {
            const mock = [
                { id: 101, nombre: "Ferretería El Maestro", vendedor: "Juan Pérez", telefono: "+56912345678", email: "ventas@elmaestro.cl" },
                { id: 102, nombre: "Sodimac Constructor", vendedor: "Venta Empresas", telefono: "+56987654321", email: "empresas@sodimac.cl" }
            ];
            setProveedores(mock);
        }
    }, []);
    const [view, setView] = Re.useState("list");`;

if (c.includes(injectionPoint)) {
    c = c.replace(injectionPoint, injectionCode);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Injected mock data seeding.");
} else {
    console.log("Could not find injection point.");
}
