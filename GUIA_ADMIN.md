# Guía Admin - Arena Gaming Valencia

## 1) Preparación inicial (una sola vez)
1. Abrir el archivo `env.js`.
2. Completar los campos:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (ya rellenada)
- `PAYMENT_STRIPE_URL`
- `PAYMENT_PAYPAL_URL`
- `PAYMENT_MBWAY_PHONE`

3. Abrir el panel de Supabase -> SQL Editor.
4. Ejecutar el archivo `database.sql` completo.

## 2) Crear cuenta y dar acceso de administrador
1. Abrir `login.html`.
2. Crear una cuenta en la pestaña "Registro".
3. En Supabase SQL Editor, ejecutar:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DEL_USUARIO';
```

4. Cerrar sesión e iniciar sesión de nuevo.
5. Confirmar que aparece el enlace `Admin` en el menú.

## 3) Acceder al panel de administración
1. Abrir `admin.html`.
2. Validar mensaje de acceso autorizado.

Si aparece "Sin permiso", la cuenta todavía no tiene `role = 'admin'`.

## 4) Gestión de productos
En el panel `Admin` -> pestaña `Productos`:
1. Completar:
- Nombre
- Descripción
- Precio
- URL de la imagen
- Stock
- Activo (Sí/No)
2. Clic en `Guardar producto`.
3. Confirmar que aparece en `Productos actuales`.
4. Confirmar que aparece en `loja.html`.
5. Para eliminar, clic en `Eliminar`.

## 5) Gestión de eventos
En el panel `Admin` -> pestaña `Eventos`:
1. Completar:
- Título
- Descripción
- Tipo
- Inicio / Fin
- Máx. participantes
2. Clic en `Guardar evento`.
3. Confirmar que aparece en `Eventos actuales`.
4. Para eliminar, clic en `Eliminar`.

## 6) Pagos
En el panel `Admin` -> pestaña `Pagos`:
1. Verificar estado de configuración de:
- Stripe
- PayPal
- MB Way

Si falta alguno, completarlo en `env.js`.

## 7) Prueba completa de la tienda (flujo del tutor)
1. Abrir `loja.html`.
2. Añadir productos al carrito.
3. Clic en `Ir al pago`.
4. En `pagamento.html`, probar:
- `Pagar con Stripe`
- `Pagar con PayPal`
- `Pagar por MB Way`

## 8) Qué validar para la evaluación
- Login/Registro funciona con Supabase.
- El panel `admin.html` solo abre para cuentas admin.
- El producto creado en admin aparece en la tienda.
- El evento creado en admin se guarda en la base de datos.
- El checkout crea registros de pedido.

## 9) Limitaciones actuales
- Stripe/PayPal están por enlace de pago (funcional por redirección).
- No existe webhook automático para marcar el pago como "paid".
- MB Way funciona con referencia manual.

## Archivos principales
- `admin.html`
- `loja.html`
- `pagamento.html`
- `script.js`
- `database.sql`
- `env.js`
